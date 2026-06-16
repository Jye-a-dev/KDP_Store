import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/pg.provider';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { PaginatedReviews, Review } from './entities/review.entity';

interface CountRow {
  total: string;
  average_rating: string;
  five_stars: string;
  four_stars: string;
  three_stars: string;
  two_stars: string;
  one_star: string;
}

interface CountResult {
  total: string;
}

@Injectable()
export class ReviewsService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateReviewDto): Promise<Review> {
    // 1. Kiểm tra user_id nếu có
    if (dto.user_id) {
      const userCheck = await this.db.query(
        'SELECT id FROM users WHERE id = $1',
        [dto.user_id],
      );
      if ((userCheck.rowCount ?? 0) === 0) {
        throw new NotFoundException(
          `User với id "${dto.user_id}" không tồn tại`,
        );
      }
    }

    // 2. Kiểm tra product_id
    const prodCheck = await this.db.query(
      'SELECT id FROM products WHERE id = $1',
      [dto.product_id],
    );
    if ((prodCheck.rowCount ?? 0) === 0) {
      throw new NotFoundException(
        `Sản phẩm với id "${dto.product_id}" không tồn tại`,
      );
    }

    // 3. Kiểm tra rating hợp lệ
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Số sao đánh giá phải từ 1 đến 5 sao');
    }

    const { rows } = await this.db.query<Review>(
      `INSERT INTO reviews (user_id, product_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, product_id, rating, comment, created_at`,
      [dto.user_id ?? null, dto.product_id, dto.rating, dto.comment ?? null],
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // FIND ALL (filter + pagination + count)
  // ─────────────────────────────────────────────
  async findAll(query: QueryReviewDto): Promise<PaginatedReviews> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const sortBy = query.sort_by || 'created_at';
    const sortOrder = query.sort_order === 'ASC' ? 'ASC' : 'DESC';

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.product_id) {
      conditions.push(`product_id = $${idx}`);
      params.push(Number(query.product_id));
      idx++;
    }

    if (query.user_id) {
      conditions.push(`user_id = $${idx}`);
      params.push(query.user_id);
      idx++;
    }

    if (query.rating) {
      conditions.push(`rating = $${idx}`);
      params.push(Number(query.rating));
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<CountResult>(
      `SELECT COUNT(*) AS total FROM reviews ${where}`,
      params,
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const { rows } = await this.db.query<Review>(
      `SELECT id, user_id, product_id, rating, comment, created_at
       FROM reviews
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
  async findOne(id: number): Promise<Review> {
    const { rows } = await this.db.query<Review>(
      'SELECT id, user_id, product_id, rating, comment, created_at FROM reviews WHERE id = $1',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Đánh giá với id "${id}" không tồn tại`);
    }
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(id: number, dto: UpdateReviewDto): Promise<Review> {
    await this.findOne(id); // kiểm tra tồn tại

    if (dto.rating !== undefined && (dto.rating < 1 || dto.rating > 5)) {
      throw new BadRequestException('Số sao đánh giá phải từ 1 đến 5 sao');
    }

    const fields: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (dto.rating !== undefined) {
      fields.push(`rating = $${idx}`);
      params.push(dto.rating);
      idx++;
    }

    if (dto.comment !== undefined) {
      fields.push(`comment = $${idx}`);
      params.push(dto.comment);
      idx++;
    }

    if (fields.length === 0) return this.findOne(id);

    params.push(id);

    const { rows } = await this.db.query<Review>(
      `UPDATE reviews SET ${fields.join(', ')}
       WHERE id = $${idx}
       RETURNING id, user_id, product_id, rating, comment, created_at`,
      params,
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id); // kiểm tra tồn tại
    await this.db.query('DELETE FROM reviews WHERE id = $1', [id]);
    return { message: `Đã xóa đánh giá "${id}" thành công` };
  }

  // ─────────────────────────────────────────────
  // COUNT
  // ─────────────────────────────────────────────
  async count(query: QueryReviewDto): Promise<{
    total: number;
    average_rating: number;
    five_stars: number;
    four_stars: number;
    three_stars: number;
    two_stars: number;
    one_star: number;
  }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.product_id) {
      conditions.push(`product_id = $${idx}`);
      params.push(Number(query.product_id));
      idx++;
    }

    if (query.user_id) {
      conditions.push(`user_id = $${idx}`);
      params.push(query.user_id);
      idx++;
    }

    if (query.rating) {
      conditions.push(`rating = $${idx}`);
      params.push(Number(query.rating));
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await this.db.query<CountRow>(
      `
      SELECT
        COUNT(*)                                                      AS total,
        COALESCE(AVG(rating), 0)                                      AS average_rating,
        COUNT(*) FILTER (WHERE rating = 5)                            AS five_stars,
        COUNT(*) FILTER (WHERE rating = 4)                            AS four_stars,
        COUNT(*) FILTER (WHERE rating = 3)                            AS three_stars,
        COUNT(*) FILTER (WHERE rating = 2)                            AS two_stars,
        COUNT(*) FILTER (WHERE rating = 1)                            AS one_star
      FROM reviews
      ${where}
    `,
      params,
    );
    const r = rows[0];
    return {
      total: parseInt(r.total, 10),
      average_rating: parseFloat(parseFloat(r.average_rating).toFixed(1)),
      five_stars: parseInt(r.five_stars, 10),
      four_stars: parseInt(r.four_stars, 10),
      three_stars: parseInt(r.three_stars, 10),
      two_stars: parseInt(r.two_stars, 10),
      one_star: parseInt(r.one_star, 10),
    };
  }
}
