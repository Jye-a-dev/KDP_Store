import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/pg.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { PaginatedUsers, User } from './entities/user.entity';

type UserRow = Omit<User, 'password_hash'>;

interface CountRow {
  total: string;
  customers: string;
  admins: string;
  active: string;
  inactive: string;
}

interface CountResult {
  total: string;
}

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateUserDto): Promise<Omit<User, 'password_hash'>> {
    const existing = await this.db.query(
      'SELECT id FROM users WHERE email = $1',
      [dto.email],
    );
    if ((existing.rowCount ?? 0) > 0) {
      throw new ConflictException(`Email "${dto.email}" đã tồn tại`);
    }

    const { rows } = await this.db.query<User>(
      `INSERT INTO users
         (email, password_hash, full_name, phone, avatar_url, role, is_active, addresses)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, full_name, phone, avatar_url, role, is_active, addresses, created_at, updated_at`,
      [
        dto.email,
        dto.password_hash ?? null,
        dto.full_name,
        dto.phone ?? null,
        dto.avatar_url ?? null,
        dto.role ?? 'customer',
        dto.is_active ?? true,
        JSON.stringify(dto.addresses ?? []),
      ],
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // FIND ALL (filter + pagination + count)
  // ─────────────────────────────────────────────
  async findAll(query: QueryUserDto): Promise<PaginatedUsers> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const sortBy = query.sort_by || 'created_at';
    const sortOrder = query.sort_order === 'ASC' ? 'ASC' : 'DESC';

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.search) {
      conditions.push(
        `(LOWER(full_name) LIKE $${idx} OR LOWER(email) LIKE $${idx})`,
      );
      params.push(`%${query.search.toLowerCase()}%`);
      idx++;
    }

    if (query.role) {
      conditions.push(`role = $${idx}`);
      params.push(query.role);
      idx++;
    }

    if (query.is_active !== undefined) {
      conditions.push(`is_active = $${idx}`);
      params.push(String(query.is_active) === 'true');
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Đếm tổng bản ghi khớp filter
    const countResult = await this.db.query<CountResult>(
      `SELECT COUNT(*) AS total FROM users ${where}`,
      params,
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Lấy dữ liệu có phân trang
    const { rows } = await this.db.query<UserRow>(
      `SELECT id, email, full_name, phone, avatar_url, role, is_active, addresses, created_at, updated_at
       FROM users
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
  async findOne(id: string): Promise<Omit<User, 'password_hash'>> {
    const { rows } = await this.db.query<UserRow>(
      `SELECT id, email, full_name, phone, avatar_url, role, is_active, addresses, created_at, updated_at
       FROM users WHERE id = $1`,
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`User với id "${id}" không tồn tại`);
    }
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password_hash'>> {
    await this.findOne(id); // kiểm tra tồn tại

    // Kiểm tra email trùng với user khác
    if (dto.email) {
      const dup = await this.db.query(
        'SELECT id FROM users WHERE email = $1 AND id <> $2',
        [dto.email, id],
      );
      if ((dup.rowCount ?? 0) > 0) {
        throw new ConflictException(
          `Email "${dto.email}" đã được dùng bởi user khác`,
        );
      }
    }

    const fields: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    const allowed: (keyof UpdateUserDto)[] = [
      'email',
      'password_hash',
      'full_name',
      'phone',
      'avatar_url',
      'role',
      'is_active',
      'addresses',
    ];

    for (const key of allowed) {
      if (dto[key] !== undefined) {
        const value = key === 'addresses' ? JSON.stringify(dto[key]) : dto[key];
        fields.push(`${key} = $${idx}`);
        params.push(value);
        idx++;
      }
    }

    if (fields.length === 0) return this.findOne(id);

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const { rows } = await this.db.query<UserRow>(
      `UPDATE users SET ${fields.join(', ')}
       WHERE id = $${idx}
       RETURNING id, email, full_name, phone, avatar_url, role, is_active, addresses, created_at, updated_at`,
      params,
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id); // kiểm tra tồn tại
    await this.db.query('DELETE FROM users WHERE id = $1', [id]);
    return { message: `Đã xóa user "${id}" thành công` };
  }

  // ─────────────────────────────────────────────
  // COUNT (tổng / theo role)
  // ─────────────────────────────────────────────
  async count(query: QueryUserDto): Promise<{
    total: number;
    customers: number;
    admins: number;
    active: number;
    inactive: number;
  }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.search) {
      conditions.push(
        `(LOWER(full_name) LIKE $${idx} OR LOWER(email) LIKE $${idx})`,
      );
      params.push(`%${query.search.toLowerCase()}%`);
      idx++;
    }

    if (query.role) {
      conditions.push(`role = $${idx}`);
      params.push(query.role);
      idx++;
    }

    if (query.is_active !== undefined) {
      conditions.push(`is_active = $${idx}`);
      params.push(String(query.is_active) === 'true');
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await this.db.query<CountRow>(
      `
      SELECT
        COUNT(*)                                      AS total,
        COUNT(*) FILTER (WHERE role = 'customer')     AS customers,
        COUNT(*) FILTER (WHERE role = 'admin')        AS admins,
        COUNT(*) FILTER (WHERE is_active = TRUE)      AS active,
        COUNT(*) FILTER (WHERE is_active = FALSE)     AS inactive
      FROM users
      ${where}
    `,
      params,
    );
    const r = rows[0];
    return {
      total: parseInt(r.total, 10),
      customers: parseInt(r.customers, 10),
      admins: parseInt(r.admins, 10),
      active: parseInt(r.active, 10),
      inactive: parseInt(r.inactive, 10),
    };
  }
}
