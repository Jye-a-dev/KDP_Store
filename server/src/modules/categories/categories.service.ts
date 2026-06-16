import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/pg.provider';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { PaginatedCategories, Category } from './entities/category.entity';

interface CountRow {
  total: string;
  roots: string;
  subcategories: string;
}

interface CountResult {
  total: string;
}

@Injectable()
export class CategoriesService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  private slugify(text: string): string {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateCategoryDto): Promise<Category> {
    // Kiểm tra parent_id nếu có
    if (dto.parent_id !== undefined && dto.parent_id !== null) {
      const parentCheck = await this.db.query(
        'SELECT id FROM categories WHERE id = $1',
        [dto.parent_id],
      );
      if ((parentCheck.rowCount ?? 0) === 0) {
        throw new NotFoundException(
          `Danh mục cha với id "${dto.parent_id}" không tồn tại`,
        );
      }
    }

    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);

    // Kiểm tra trùng slug
    const dup = await this.db.query(
      'SELECT id FROM categories WHERE slug = $1',
      [slug],
    );
    if ((dup.rowCount ?? 0) > 0) {
      throw new ConflictException(`Đường dẫn slug "${slug}" đã tồn tại`);
    }

    const { rows } = await this.db.query<Category>(
      `INSERT INTO categories (parent_id, name, slug)
       VALUES ($1, $2, $3)
       RETURNING id, parent_id, name, slug, created_at`,
      [dto.parent_id ?? null, dto.name, slug],
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // FIND ALL (filter + pagination + count)
  // ─────────────────────────────────────────────
  async findAll(query: QueryCategoryDto): Promise<PaginatedCategories> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const sortBy = query.sort_by || 'created_at';
    const sortOrder = query.sort_order === 'ASC' ? 'ASC' : 'DESC';

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.search) {
      conditions.push(`(LOWER(name) LIKE $${idx} OR LOWER(slug) LIKE $${idx})`);
      params.push(`%${query.search.toLowerCase()}%`);
      idx++;
    }

    if (query.parent_id !== undefined) {
      if (query.parent_id === null || String(query.parent_id) === 'null') {
        conditions.push(`parent_id IS NULL`);
      } else {
        conditions.push(`parent_id = $${idx}`);
        params.push(Number(query.parent_id));
        idx++;
      }
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<CountResult>(
      `SELECT COUNT(*) AS total FROM categories ${where}`,
      params,
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const { rows } = await this.db.query<Category>(
      `SELECT id, parent_id, name, slug, created_at
       FROM categories
       ${where}
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset],
    );

    return {
      data: rows,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────
  async findOne(id: number): Promise<Category> {
    const { rows } = await this.db.query<Category>(
      `SELECT id, parent_id, name, slug, created_at
       FROM categories WHERE id = $1`,
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Danh mục với id "${id}" không tồn tại`);
    }
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const current = await this.findOne(id); // kiểm tra tồn tại

    if (dto.parent_id !== undefined) {
      if (dto.parent_id === id) {
        throw new ConflictException(
          `Không thể chọn chính danh mục này làm danh mục cha`,
        );
      }
      if (dto.parent_id !== null) {
        const parentCheck = await this.db.query(
          'SELECT id FROM categories WHERE id = $1',
          [dto.parent_id],
        );
        if ((parentCheck.rowCount ?? 0) === 0) {
          throw new NotFoundException(
            `Danh mục cha với id "${dto.parent_id}" không tồn tại`,
          );
        }
      }
    }

    // Nếu thay đổi name/slug, kiểm tra tính duy nhất của slug mới
    let slug = current.slug;
    if (dto.slug || dto.name) {
      slug = dto.slug
        ? this.slugify(dto.slug)
        : this.slugify(dto.name ?? current.name);
      if (slug !== current.slug) {
        const dup = await this.db.query(
          'SELECT id FROM categories WHERE slug = $1 AND id <> $2',
          [slug, id],
        );
        if ((dup.rowCount ?? 0) > 0) {
          throw new ConflictException(
            `Đường dẫn slug "${slug}" đã được sử dụng`,
          );
        }
      }
    }

    const fields: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (dto.parent_id !== undefined) {
      fields.push(`parent_id = $${idx}`);
      params.push(dto.parent_id);
      idx++;
    }

    if (dto.name !== undefined) {
      fields.push(`name = $${idx}`);
      params.push(dto.name);
      idx++;
    }

    if (slug !== current.slug) {
      fields.push(`slug = $${idx}`);
      params.push(slug);
      idx++;
    }

    if (fields.length === 0) return this.findOne(id);

    params.push(id);

    const { rows } = await this.db.query<Category>(
      `UPDATE categories SET ${fields.join(', ')}
       WHERE id = $${idx}
       RETURNING id, parent_id, name, slug, created_at`,
      params,
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id); // kiểm tra tồn tại
    // Do ràng buộc ON DELETE SET NULL, các danh mục con sẽ tự động được set parent_id = null
    await this.db.query('DELETE FROM categories WHERE id = $1', [id]);
    return { message: `Đã xóa danh mục "${id}" thành công` };
  }

  // ─────────────────────────────────────────────
  // COUNT
  // ─────────────────────────────────────────────
  async count(query: QueryCategoryDto): Promise<{
    total: number;
    roots: number;
    subcategories: number;
  }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.search) {
      conditions.push(`(LOWER(name) LIKE $${idx} OR LOWER(slug) LIKE $${idx})`);
      params.push(`%${query.search.toLowerCase()}%`);
      idx++;
    }

    if (query.parent_id !== undefined) {
      if (query.parent_id === null || String(query.parent_id) === 'null') {
        conditions.push(`parent_id IS NULL`);
      } else {
        conditions.push(`parent_id = $${idx}`);
        params.push(Number(query.parent_id));
        idx++;
      }
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await this.db.query<CountRow>(
      `
      SELECT
        COUNT(*)                                       AS total,
        COUNT(*) FILTER (WHERE parent_id IS NULL)      AS roots,
        COUNT(*) FILTER (WHERE parent_id IS NOT NULL)  AS subcategories
      FROM categories
      ${where}
    `,
      params,
    );
    const r = rows[0];
    return {
      total: parseInt(r.total, 10),
      roots: parseInt(r.roots, 10),
      subcategories: parseInt(r.subcategories, 10),
    };
  }
}
