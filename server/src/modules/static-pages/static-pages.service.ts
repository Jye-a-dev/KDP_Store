import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/pg.provider';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { StaticPage } from './entities/static-page.entity';

@Injectable()
export class StaticPagesService implements OnModuleInit {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async onModuleInit() {
    // 1. Create table if not exists
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS static_pages (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        group_type VARCHAR(50) NOT NULL, -- 'service' or 'explore'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Seed default policies if empty
    const { rowCount } = await this.db.query(
      'SELECT 1 FROM static_pages LIMIT 1',
    );
    if (rowCount === 0) {
      const defaults = [
        // Services
        {
          slug: 'doi-tra-de-dang',
          title: 'Đổi Trả Dễ Dàng',
          group_type: 'service',
          content: `
            <h2>Chính Sách Đổi Trả Sản Phẩm Secondhand tại KDP Store</h2>
            <p>Nhằm đảm bảo trải nghiệm mua sắm tuyệt vời nhất, chúng tôi áp dụng chính sách đổi trả linh hoạt:</p>
            <ul>
              <li><strong>Thời gian:</strong> Hỗ trợ đổi trả trong vòng 3 ngày kể từ ngày nhận hàng.</li>
              <li><strong>Điều kiện:</strong> Sản phẩm còn nguyên tag, chưa qua sử dụng thêm và đúng với hiện trạng lúc cửa hàng giao.</li>
              <li><strong>Chi phí:</strong> Miễn phí đổi hàng nếu lỗi thuộc về mô tả sai của cửa hàng. Các lý do chủ quan khác sẽ tính phí ship 2 chiều.</li>
            </ul>
          `.trim(),
        },
        {
          slug: 'bao-hanh-san-pham',
          title: 'Bảo Hành Sản Phẩm',
          group_type: 'service',
          content: `
            <h2>Chính Sách Bảo Hành & Bảo Dưỡng Đồ Secondhand</h2>
            <p>KDP Store cam kết đồng hành lâu dài cùng sản phẩm của bạn:</p>
            <ul>
              <li><strong>Quần áo/Phụ kiện:</strong> Hỗ trợ sửa khoá, đính nút hoặc sửa đường chỉ miễn phí trong 1 tháng đầu.</li>
              <li><strong>Đồ nội thất 3D/Vật phẩm cao cấp:</strong> Bảo hành kết cấu từ 3 đến 6 tháng tuỳ tình trạng sản phẩm lúc mua.</li>
              <li><strong>Bảo dưỡng:</strong> Dịch vụ giặt khô/vệ sinh giày với giá ưu đãi cực sâu dành riêng cho thành viên Z-CLUB.</li>
            </ul>
          `.trim(),
        },
        {
          slug: 'membership-perks',
          title: 'Membership Perks',
          group_type: 'service',
          content: `
            <h2>Đặc Quyền Thành Viên Z-CLUB</h2>
            <p>Tham gia cộng đồng thời trang bền vững và nhận ngập tràn đặc quyền:</p>
            <ul>
              <li>Tích điểm 5% giá trị mỗi đơn hàng, quy đổi trực tiếp thành voucher giảm giá.</li>
              <li>Ưu tiên đặt trước (Pre-order) các bộ sưu tập drop secondhand giới hạn.</li>
              <li>Miễn phí vận chuyển cho toàn bộ hoá đơn từ 500k.</li>
            </ul>
          `.trim(),
        },
        // Explore
        {
          slug: 've-kdp-store',
          title: 'Về KDP Store',
          group_type: 'explore',
          content: `
            <h2>KDP Store - Thời Trang Tái Sinh & Sống Xanh</h2>
            <p>KDP Store được thành lập năm 2026 với tầm nhìn cách mạng hoá thời trang secondhand tại Việt Nam. Chúng tôi tin rằng mỗi món đồ cũ đều mang một câu chuyện độc bản cần được kể tiếp.</p>
            <p>Bằng việc tích hợp công nghệ trình chiếu 3D tương tác, khách hàng có thể kiểm tra từng đường kim mũi chỉ và góc cạnh sản phẩm một cách chân thực nhất trước khi quyết định sở hữu.</p>
          `.trim(),
        },
        {
          slug: 'lookbook-2026',
          title: 'Lookbook 2026',
          group_type: 'explore',
          content: `
            <h2>Lookbook 2026 // Retro & Y2K Aesthetics</h2>
            <p>Chiêm ngưỡng những set đồ secondhand mang đậm dấu ấn thời gian được tuyển chọn và mix-match bởi Z Studio. Cảm hứng giao thoa giữa phong cách đường phố Retro thập niên 90 và hơi thở vị lai Y2K.</p>
            <p>Các sản phẩm xuất hiện trong Lookbook hiện đang được bày bán độc quyền tại cửa hàng KDP Store.</p>
          `.trim(),
        },
        {
          slug: 'chinh-sach-xanh',
          title: 'Chính Sách Xanh',
          group_type: 'explore',
          content: `
            <h2>Cam Kết Bảo Vệ Môi Trường</h2>
            <p>Mỗi giao dịch tại KDP Store góp phần giảm thiểu rác thải dệt may ra môi trường:</p>
            <ul>
              <li>100% bao bì sử dụng giấy tái chế thân thiện môi trường.</li>
              <li>Khuyến khích khách hàng quyên góp quần áo cũ để nhận ưu đãi mua sắm mới.</li>
              <li>Trích lập quỹ trồng rừng ngập mặn Việt Nam từ 1% doanh thu mỗi đơn hàng bán ra.</li>
            </ul>
          `.trim(),
        },
      ];

      for (const item of defaults) {
        await this.db.query(
          'INSERT INTO static_pages (slug, title, group_type, content) VALUES ($1, $2, $3, $4)',
          [item.slug, item.title, item.group_type, item.content],
        );
      }
    }
  }

  async findAll(): Promise<StaticPage[]> {
    const { rows } = await this.db.query<StaticPage>(
      'SELECT * FROM static_pages ORDER BY created_at DESC',
    );
    return rows;
  }

  async findOne(id: number): Promise<StaticPage> {
    const { rows } = await this.db.query<StaticPage>(
      'SELECT * FROM static_pages WHERE id = $1',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Trang tĩnh với ID "${id}" không tồn tại`);
    }
    return rows[0];
  }

  async findBySlug(slug: string): Promise<StaticPage> {
    const { rows } = await this.db.query<StaticPage>(
      'SELECT * FROM static_pages WHERE slug = $1',
      [slug],
    );
    if (!rows[0]) {
      throw new NotFoundException(
        `Trang tĩnh với slug "${slug}" không tồn tại`,
      );
    }
    return rows[0];
  }

  async create(dto: CreateStaticPageDto): Promise<StaticPage> {
    const slugCheck = await this.db.query(
      'SELECT id FROM static_pages WHERE slug = $1',
      [dto.slug],
    );
    if ((slugCheck.rowCount ?? 0) > 0) {
      throw new ConflictException(`Đường dẫn slug "${dto.slug}" đã tồn tại`);
    }

    const { rows } = await this.db.query<StaticPage>(
      `INSERT INTO static_pages (slug, title, content, group_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [dto.slug, dto.title, dto.content, dto.group_type],
    );
    return rows[0];
  }

  async update(id: number, dto: UpdateStaticPageDto): Promise<StaticPage> {
    await this.findOne(id); // Check existence

    if (dto.slug) {
      const slugCheck = await this.db.query(
        'SELECT id FROM static_pages WHERE slug = $1 AND id <> $2',
        [dto.slug, id],
      );
      if ((slugCheck.rowCount ?? 0) > 0) {
        throw new ConflictException(`Đường dẫn slug "${dto.slug}" đã tồn tại`);
      }
    }

    const fields: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    const allowed: (keyof UpdateStaticPageDto)[] = [
      'slug',
      'title',
      'content',
      'group_type',
    ];

    for (const key of allowed) {
      if (dto[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        params.push(dto[key]);
        idx++;
      }
    }

    if (fields.length === 0) return this.findOne(id);

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const { rows } = await this.db.query<StaticPage>(
      `UPDATE static_pages SET ${fields.join(', ')}
       WHERE id = $${idx}
       RETURNING *`,
      params,
    );
    return rows[0];
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id); // Check existence
    await this.db.query('DELETE FROM static_pages WHERE id = $1', [id]);
    return { message: `Đã xóa trang tĩnh ID "${id}" thành công` };
  }
}
