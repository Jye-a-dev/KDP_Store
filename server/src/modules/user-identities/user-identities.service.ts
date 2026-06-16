import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/pg.provider';
import { CreateUserIdentityDto } from './dto/create-user-identity.dto';
import { UpdateUserIdentityDto } from './dto/update-user-identity.dto';
import { QueryUserIdentityDto } from './dto/query-user-identity.dto';
import {
  PaginatedUserIdentities,
  UserIdentity,
} from './entities/user-identity.entity';

interface CountRow {
  total: string;
  google: string;
  facebook: string;
  others: string;
}

interface CountResult {
  total: string;
}

@Injectable()
export class UserIdentitiesService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateUserIdentityDto): Promise<UserIdentity> {
    // Kiểm tra user có tồn tại không
    const userCheck = await this.db.query(
      'SELECT id FROM users WHERE id = $1',
      [dto.user_id],
    );
    if ((userCheck.rowCount ?? 0) === 0) {
      throw new NotFoundException(`User với id "${dto.user_id}" không tồn tại`);
    }

    // Kiểm tra trùng provider & provider_id
    const dup = await this.db.query(
      'SELECT id FROM user_identities WHERE provider = $1 AND provider_id = $2',
      [dto.provider, dto.provider_id],
    );
    if ((dup.rowCount ?? 0) > 0) {
      throw new ConflictException(
        `Liên kết OAuth với "${dto.provider}" (ID: ${dto.provider_id}) đã tồn tại`,
      );
    }

    const { rows } = await this.db.query<UserIdentity>(
      `INSERT INTO user_identities
         (user_id, provider, provider_id, provider_email, access_token)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, provider, provider_id, provider_email, access_token, created_at`,
      [
        dto.user_id,
        dto.provider,
        dto.provider_id,
        dto.provider_email ?? null,
        dto.access_token ?? null,
      ],
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // FIND ALL (filter + pagination + count)
  // ─────────────────────────────────────────────
  async findAll(query: QueryUserIdentityDto): Promise<PaginatedUserIdentities> {
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

    if (query.provider) {
      conditions.push(`provider = $${idx}`);
      params.push(query.provider);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<CountResult>(
      `SELECT COUNT(*) AS total FROM user_identities ${where}`,
      params,
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const { rows } = await this.db.query<UserIdentity>(
      `SELECT id, user_id, provider, provider_id, provider_email, access_token, created_at
       FROM user_identities
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
  async findOne(id: number): Promise<UserIdentity> {
    const { rows } = await this.db.query<UserIdentity>(
      `SELECT id, user_id, provider, provider_id, provider_email, access_token, created_at
       FROM user_identities WHERE id = $1`,
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(
        `Liên kết tài khoản với id "${id}" không tồn tại`,
      );
    }
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(id: number, dto: UpdateUserIdentityDto): Promise<UserIdentity> {
    await this.findOne(id); // kiểm tra tồn tại

    const fields: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    const allowed: (keyof UpdateUserIdentityDto)[] = [
      'provider_email',
      'access_token',
    ];

    for (const key of allowed) {
      if (dto[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        params.push(dto[key]);
        idx++;
      }
    }

    if (fields.length === 0) return this.findOne(id);

    params.push(id);

    const { rows } = await this.db.query<UserIdentity>(
      `UPDATE user_identities SET ${fields.join(', ')}
       WHERE id = $${idx}
       RETURNING id, user_id, provider, provider_id, provider_email, access_token, created_at`,
      params,
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id); // kiểm tra tồn tại
    await this.db.query('DELETE FROM user_identities WHERE id = $1', [id]);
    return { message: `Đã xóa liên kết tài khoản "${id}" thành công` };
  }

  // ─────────────────────────────────────────────
  // COUNT
  // ─────────────────────────────────────────────
  async count(query: QueryUserIdentityDto): Promise<{
    total: number;
    google: number;
    facebook: number;
    others: number;
  }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.user_id) {
      conditions.push(`user_id = $${idx}`);
      params.push(query.user_id);
      idx++;
    }

    if (query.provider) {
      conditions.push(`provider = $${idx}`);
      params.push(query.provider);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await this.db.query<CountRow>(
      `
      SELECT
        COUNT(*)                                                      AS total,
        COUNT(*) FILTER (WHERE provider = 'google')                    AS google,
        COUNT(*) FILTER (WHERE provider = 'facebook')                  AS facebook,
        COUNT(*) FILTER (WHERE provider NOT IN ('google', 'facebook')) AS others
      FROM user_identities
      ${where}
    `,
      params,
    );
    const r = rows[0];
    return {
      total: parseInt(r.total, 10),
      google: parseInt(r.google, 10),
      facebook: parseInt(r.facebook, 10),
      others: parseInt(r.others, 10),
    };
  }
}
