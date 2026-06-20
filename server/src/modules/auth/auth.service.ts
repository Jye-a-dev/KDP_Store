import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { PG_CONNECTION } from '../../database/pg.provider';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
  password_hash: string | null;
  addresses?: unknown;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PG_CONNECTION) private readonly db: Pool,
    private readonly jwtService: JwtService,
  ) {}

  // ── REGISTER ──────────────────────────────────────────────────────────────
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // 1. Check email uniqueness
    const existing = await this.db.query(
      'SELECT id FROM users WHERE email = $1',
      [dto.email],
    );
    if ((existing.rowCount ?? 0) > 0) {
      throw new ConflictException(`Email "${dto.email}" đã được sử dụng`);
    }

    // 2. Hash password
    const password_hash = await bcrypt.hash(dto.password, 10);

    // 3. Insert user
    const { rows } = await this.db.query<UserRow>(
      `INSERT INTO users (email, password_hash, full_name, phone, role, is_active, addresses)
       VALUES ($1, $2, $3, $4, 'customer', true, '[]')
       RETURNING id, email, full_name, phone, avatar_url, role, is_active, addresses`,
      [dto.email, password_hash, dto.full_name, dto.phone ?? null],
    );

    const user = rows[0];
    return this._buildResponse(user);
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // 1. Find user by email
    const { rows } = await this.db.query<UserRow>(
      'SELECT id, email, full_name, phone, avatar_url, role, is_active, addresses, password_hash FROM users WHERE email = $1',
      [dto.email],
    );

    const user = rows[0];
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hoá');
    }

    // 2. Compare password
    if (!user.password_hash) {
      throw new UnauthorizedException(
        'Tài khoản này đăng nhập qua OAuth, vui lòng dùng Google',
      );
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    return this._buildResponse(user);
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────
  private _buildResponse(user: UserRow): AuthResponseDto {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone ?? undefined,
        avatar_url: user.avatar_url ?? undefined,
        role: user.role,
        is_active: user.is_active,
        addresses: (user.addresses as any[]) ?? [],
      },
    };
  }
}
