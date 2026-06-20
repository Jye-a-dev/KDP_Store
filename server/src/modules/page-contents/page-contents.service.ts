import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/pg.provider';
import { CreatePageContentDto } from './dto/create-page-content.dto';
import { PageContent } from './entities/page-content.entity';

@Injectable()
export class PageContentsService implements OnModuleInit {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async onModuleInit() {
    // 1. Create table if not exists
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS page_contents (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Seed default data if table is empty
    const { rowCount } = await this.db.query(
      'SELECT 1 FROM page_contents LIMIT 1',
    );
    if (rowCount === 0) {
      const defaults = {
        announcement_bar:
          'Săn Deal Khởi Động Hè - Nhập mã "NewSale_2026" giảm thêm 15%',
        hero_tagline: 'Drop 01 // Xu Hướng Đột Phá',
        hero_title_normal: 'Bứt phá',
        hero_title_highlight: 'Màu Sắc',
        hero_description:
          'Đập tan sự đơn điệu với những thiết kế Oversize và nội thất tương tác 3D mang tuyên ngôn cá tính mạnh mẽ.',
        hero_btn: 'Mua Ngay Cực Cháy',
        newsletter_title: 'Gia Nhập Cộng Đồng Z-CLUB',
        newsletter_description:
          'Nhận ngay thông báo về các đợt Sneaker Drop, nội thất 3D giới hạn và ưu đãi dành riêng cho thành viên.',
        newsletter_placeholder: 'Nhập email của bạn...',
        newsletter_btn: 'Đăng Ký',
        newsletter_cta_url: '/products',
        customer_promo_badge: 'Z-CLUB Member',
        customer_promo_title: 'Ưu đãi dành riêng cho bạn',
        customer_promo_code: 'ZCLUB15',
        customer_promo_desc: 'giảm thêm 15%',
        customer_promo_btn: 'Mua Ngay',
      };

      for (const [key, value] of Object.entries(defaults)) {
        await this.db.query(
          'INSERT INTO page_contents (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
          [key, value],
        );
      }
    }
  }

  // Find all page contents as an object { [key]: value }
  async findAll(): Promise<Record<string, string>> {
    const { rows } = await this.db.query<{ key: string; value: string }>(
      'SELECT key, value FROM page_contents',
    );
    const result: Record<string, string> = {};
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return result;
  }

  // Find all page contents as list of entities for admin panel listing
  async findAllList(): Promise<PageContent[]> {
    const { rows } = await this.db.query<PageContent>(
      'SELECT key, value, updated_at FROM page_contents ORDER BY key ASC',
    );
    return rows;
  }

  async findOne(key: string): Promise<PageContent> {
    const { rows } = await this.db.query<PageContent>(
      'SELECT key, value, updated_at FROM page_contents WHERE key = $1',
      [key],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Nội dung với key "${key}" không tồn tại`);
    }
    return rows[0];
  }

  async create(dto: CreatePageContentDto): Promise<PageContent> {
    const { rows } = await this.db.query<PageContent>(
      `INSERT INTO page_contents (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
       RETURNING key, value, updated_at`,
      [dto.key, dto.value],
    );
    return rows[0];
  }

  async update(key: string, value: string): Promise<PageContent> {
    const { rows } = await this.db.query<PageContent>(
      `INSERT INTO page_contents (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
       RETURNING key, value, updated_at`,
      [key, value],
    );
    return rows[0];
  }

  async remove(key: string): Promise<{ message: string }> {
    const { rowCount } = await this.db.query(
      'DELETE FROM page_contents WHERE key = $1',
      [key],
    );
    if (rowCount === 0) {
      throw new NotFoundException(`Nội dung với key "${key}" không tồn tại`);
    }
    return { message: `Đã xóa key "${key}" thành công` };
  }
}
