import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/pg.provider';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { QueryCartDto } from './dto/query-cart.dto';
import { PaginatedCarts, Cart } from './entities/cart.entity';

interface CountRow {
  total: string;
  active_carts: string;
  empty_carts: string;
}

interface CountResult {
  total: string;
}

@Injectable()
export class CartsService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateCartDto): Promise<Cart> {
    // Kiểm tra user có tồn tại không
    const userCheck = await this.db.query(
      'SELECT id FROM users WHERE id = $1',
      [dto.user_id],
    );
    if ((userCheck.rowCount ?? 0) === 0) {
      throw new NotFoundException(`User với id "${dto.user_id}" không tồn tại`);
    }

    // Kiểm tra xem user đã có giỏ hàng chưa (user_id là UNIQUE)
    const existing = await this.db.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [dto.user_id],
    );
    if ((existing.rowCount ?? 0) > 0) {
      throw new ConflictException(
        `Giỏ hàng của người dùng "${dto.user_id}" đã tồn tại`,
      );
    }

    // Kiểm tra các sản phẩm trong items
    for (const item of dto.items ?? []) {
      const prodCheck = await this.db.query(
        'SELECT id FROM products WHERE id = $1',
        [item.product_id],
      );
      if ((prodCheck.rowCount ?? 0) === 0) {
        throw new NotFoundException(
          `Sản phẩm với id "${item.product_id}" trong giỏ hàng không tồn tại`,
        );
      }
    }

    const { rows } = await this.db.query<Cart>(
      `INSERT INTO carts (user_id, items)
       VALUES ($1, $2)
       RETURNING id, user_id, items, created_at, updated_at`,
      [dto.user_id, JSON.stringify(dto.items ?? [])],
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // FIND ALL (filter + pagination + count)
  // ─────────────────────────────────────────────
  async findAll(query: QueryCartDto): Promise<PaginatedCarts> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const sortBy = query.sort_by || 'created_at';
    const sortOrder = query.sort_order === 'ASC' ? 'ASC' : 'DESC';

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.user_id) {
      conditions.push(`user_id = $${idx}`);
      params.push(query.user_id);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<CountResult>(
      `SELECT COUNT(*) AS total FROM carts ${where}`,
      params,
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const { rows } = await this.db.query<Cart>(
      `SELECT id, user_id, items, created_at, updated_at
       FROM carts
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
  async findOne(id: string): Promise<Cart> {
    const { rows } = await this.db.query<Cart>(
      'SELECT id, user_id, items, created_at, updated_at FROM carts WHERE id = $1',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Giỏ hàng với id "${id}" không tồn tại`);
    }
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // FIND BY USER ID
  // ─────────────────────────────────────────────
  async findByUserId(userId: string): Promise<Cart> {
    const { rows } = await this.db.query<Cart>(
      'SELECT id, user_id, items, created_at, updated_at FROM carts WHERE user_id = $1',
      [userId],
    );
    if (!rows[0]) {
      throw new NotFoundException(
        `Giỏ hàng của người dùng "${userId}" không tồn tại`,
      );
    }
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(id: string, dto: UpdateCartDto): Promise<Cart> {
    await this.findOne(id); // kiểm tra tồn tại

    // Kiểm tra sản phẩm
    for (const item of dto.items) {
      const prodCheck = await this.db.query(
        'SELECT id FROM products WHERE id = $1',
        [item.product_id],
      );
      if ((prodCheck.rowCount ?? 0) === 0) {
        throw new NotFoundException(
          `Sản phẩm với id "${item.product_id}" trong giỏ hàng không tồn tại`,
        );
      }
    }

    const { rows } = await this.db.query<Cart>(
      `UPDATE carts
       SET items = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, user_id, items, created_at, updated_at`,
      [JSON.stringify(dto.items), id],
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id); // kiểm tra tồn tại
    await this.db.query('DELETE FROM carts WHERE id = $1', [id]);
    return { message: `Đã xóa giỏ hàng "${id}" thành công` };
  }

  // ─────────────────────────────────────────────
  // COUNT
  // ─────────────────────────────────────────────
  async count(query: QueryCartDto): Promise<{
    total: number;
    active_carts: number;
    empty_carts: number;
  }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.user_id) {
      conditions.push(`user_id = $${idx}`);
      params.push(query.user_id);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await this.db.query<CountRow>(
      `
      SELECT
        COUNT(*)                                                      AS total,
        COUNT(*) FILTER (WHERE items IS NOT NULL AND items <> '[]'::jsonb) AS active_carts,
        COUNT(*) FILTER (WHERE items IS NULL OR items = '[]'::jsonb)     AS empty_carts
      FROM carts
      ${where}
    `,
      params,
    );
    const r = rows[0];
    return {
      total: parseInt(r.total, 10),
      active_carts: parseInt(r.active_carts, 10),
      empty_carts: parseInt(r.empty_carts, 10),
    };
  }
}
