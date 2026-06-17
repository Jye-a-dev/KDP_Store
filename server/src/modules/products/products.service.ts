import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/pg.provider';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { PaginatedProducts, Product } from './entities/product.entity';

interface CountRow {
  total: string;
  published: string;
  hidden: string;
  out_of_stock: string;
}

interface CountResult {
  total: string;
}

interface FakeProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

@Injectable()
export class ProductsService {
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
  async create(dto: CreateProductDto): Promise<Product> {
    // Kiểm tra category_id nếu có
    if (dto.category_id !== undefined && dto.category_id !== null) {
      const catCheck = await this.db.query(
        'SELECT id FROM categories WHERE id = $1',
        [dto.category_id],
      );
      if ((catCheck.rowCount ?? 0) === 0) {
        throw new NotFoundException(
          `Danh mục với id "${dto.category_id}" không tồn tại`,
        );
      }
    }

    // Kiểm tra trùng SKU
    const skuCheck = await this.db.query(
      'SELECT id FROM products WHERE sku = $1',
      [dto.sku],
    );
    if ((skuCheck.rowCount ?? 0) > 0) {
      throw new ConflictException(`Mã SKU "${dto.sku}" đã tồn tại`);
    }

    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);

    // Kiểm tra trùng slug
    const slugCheck = await this.db.query(
      'SELECT id FROM products WHERE slug = $1',
      [slug],
    );
    if ((slugCheck.rowCount ?? 0) > 0) {
      throw new ConflictException(`Đường dẫn slug "${slug}" đã tồn tại`);
    }

    const { rows } = await this.db.query<Product>(
      `INSERT INTO products (
         category_id, name, slug, sku, price, discount_price, description, stock, is_published,
         images_2d, model_3d_url, scale_x, scale_y, scale_z, rotation_x, rotation_y, rotation_z,
         materials_config, camera_config
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       RETURNING *`,
      [
        dto.category_id ?? null,
        dto.name,
        slug,
        dto.sku,
        dto.price,
        dto.discount_price ?? null,
        dto.description ?? null,
        dto.stock ?? 0,
        dto.is_published ?? true,
        JSON.stringify(dto.images_2d ?? []),
        dto.model_3d_url ?? null,
        dto.scale_x ?? 1.0,
        dto.scale_y ?? 1.0,
        dto.scale_z ?? 1.0,
        dto.rotation_x ?? 0.0,
        dto.rotation_y ?? 0.0,
        dto.rotation_z ?? 0.0,
        JSON.stringify(dto.materials_config ?? { colors: [], textures: [] }),
        JSON.stringify(dto.camera_config ?? { alpha: 0, beta: 1, radius: 5 }),
      ],
    );

    return rows[0];
  }

  // ─────────────────────────────────────────────
  // FIND ALL (filter + pagination + count)
  // ─────────────────────────────────────────────
  async findAll(query: QueryProductDto): Promise<PaginatedProducts> {
    const sortBy = query.sort_by || 'created_at';
    const sortOrder = query.sort_order === 'ASC' ? 'ASC' : 'DESC';

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.search) {
      conditions.push(
        `(LOWER(name) LIKE $${idx} OR LOWER(sku) LIKE $${idx} OR LOWER(slug) LIKE $${idx})`,
      );
      params.push(`%${query.search.toLowerCase()}%`);
      idx++;
    }

    if (query.category_id) {
      conditions.push(`category_id = $${idx}`);
      params.push(Number(query.category_id));
      idx++;
    }

    if (query.min_price !== undefined) {
      conditions.push(`price >= $${idx}`);
      params.push(Number(query.min_price));
      idx++;
    }

    if (query.max_price !== undefined) {
      conditions.push(`price <= $${idx}`);
      params.push(Number(query.max_price));
      idx++;
    }

    if (query.is_published !== undefined) {
      conditions.push(`is_published = $${idx}`);
      params.push(String(query.is_published) === 'true');
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<CountResult>(
      `SELECT COUNT(*) AS total FROM products ${where}`,
      params,
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const isPaginated = query.page !== undefined || query.limit !== undefined;

    let sql = `SELECT * FROM products ${where} ORDER BY ${sortBy} ${sortOrder}`;
    const queryParams = [...params];

    let page = 1;
    let limit = total;

    if (isPaginated) {
      page = Math.max(Number(query.page) || 1, 1);
      limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
      const offset = (page - 1) * limit;

      sql += ` LIMIT $${idx} OFFSET $${idx + 1}`;
      queryParams.push(limit, offset);
    }

    const { rows } = await this.db.query<Product>(sql, queryParams);

    return {
      data: rows,
      total,
      page,
      limit,
      total_pages: limit > 0 ? Math.ceil(total / limit) : 1,
    };
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────
  async findOne(id: number): Promise<Product> {
    const { rows } = await this.db.query<Product>(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Sản phẩm với id "${id}" không tồn tại`);
    }
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const current = await this.findOne(id); // kiểm tra tồn tại

    if (dto.category_id !== undefined && dto.category_id !== null) {
      const catCheck = await this.db.query(
        'SELECT id FROM categories WHERE id = $1',
        [dto.category_id],
      );
      if ((catCheck.rowCount ?? 0) === 0) {
        throw new NotFoundException(
          `Danh mục với id "${dto.category_id}" không tồn tại`,
        );
      }
    }

    if (dto.sku && dto.sku !== current.sku) {
      const skuCheck = await this.db.query(
        'SELECT id FROM products WHERE sku = $1 AND id <> $2',
        [dto.sku, id],
      );
      if ((skuCheck.rowCount ?? 0) > 0) {
        throw new ConflictException(
          `Mã SKU "${dto.sku}" đã được sử dụng bởi sản phẩm khác`,
        );
      }
    }

    let slug = current.slug;
    if (dto.slug || dto.name) {
      slug = dto.slug
        ? this.slugify(dto.slug)
        : this.slugify(dto.name ?? current.name);
      if (slug !== current.slug) {
        const slugCheck = await this.db.query(
          'SELECT id FROM products WHERE slug = $1 AND id <> $2',
          [slug, id],
        );
        if ((slugCheck.rowCount ?? 0) > 0) {
          throw new ConflictException(
            `Đường dẫn slug "${slug}" đã được sử dụng`,
          );
        }
      }
    }

    const fields: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    const allowed: (keyof UpdateProductDto)[] = [
      'category_id',
      'name',
      'sku',
      'price',
      'discount_price',
      'description',
      'stock',
      'is_published',
      'images_2d',
      'model_3d_url',
      'scale_x',
      'scale_y',
      'scale_z',
      'rotation_x',
      'rotation_y',
      'rotation_z',
      'materials_config',
      'camera_config',
    ];

    for (const key of allowed) {
      if (dto[key] !== undefined) {
        let value = dto[key];
        if (
          key === 'images_2d' ||
          key === 'materials_config' ||
          key === 'camera_config'
        ) {
          value = JSON.stringify(value);
        }
        fields.push(`${key} = $${idx}`);
        params.push(value);
        idx++;
      }
    }

    if (slug !== current.slug) {
      fields.push(`slug = $${idx}`);
      params.push(slug);
      idx++;
    }

    if (fields.length === 0) return this.findOne(id);

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const { rows } = await this.db.query<Product>(
      `UPDATE products SET ${fields.join(', ')}
       WHERE id = $${idx}
       RETURNING *`,
      params,
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id); // kiểm tra tồn tại
    await this.db.query('DELETE FROM products WHERE id = $1', [id]);
    return { message: `Đã xóa sản phẩm "${id}" thành công` };
  }

  // ─────────────────────────────────────────────
  // COUNT
  // ─────────────────────────────────────────────
  async count(query: QueryProductDto): Promise<{
    total: number;
    published: number;
    hidden: number;
    out_of_stock: number;
  }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.search) {
      conditions.push(
        `(LOWER(name) LIKE $${idx} OR LOWER(sku) LIKE $${idx} OR LOWER(slug) LIKE $${idx})`,
      );
      params.push(`%${query.search.toLowerCase()}%`);
      idx++;
    }

    if (query.category_id) {
      conditions.push(`category_id = $${idx}`);
      params.push(Number(query.category_id));
      idx++;
    }

    if (query.min_price !== undefined) {
      conditions.push(`price >= $${idx}`);
      params.push(Number(query.min_price));
      idx++;
    }

    if (query.max_price !== undefined) {
      conditions.push(`price <= $${idx}`);
      params.push(Number(query.max_price));
      idx++;
    }

    if (query.is_published !== undefined) {
      conditions.push(`is_published = $${idx}`);
      params.push(String(query.is_published) === 'true');
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await this.db.query<CountRow>(
      `
      SELECT
        COUNT(*)                                         AS total,
        COUNT(*) FILTER (WHERE is_published = TRUE)      AS published,
        COUNT(*) FILTER (WHERE is_published = FALSE)     AS hidden,
        COUNT(*) FILTER (WHERE stock = 0)                AS out_of_stock
      FROM products
      ${where}
    `,
      params,
    );
    const r = rows[0];
    return {
      total: parseInt(r.total, 10),
      published: parseInt(r.published, 10),
      hidden: parseInt(r.hidden, 10),
      out_of_stock: parseInt(r.out_of_stock, 10),
    };
  }

  // ─────────────────────────────────────────────
  // SEED FROM FAKE STORE API
  // ─────────────────────────────────────────────
  async seed(): Promise<{
    message: string;
    categoriesCount: number;
    productsCount: number;
  }> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      // 1. Fetch products from Fake Store API
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error(
          `Failed to fetch from Fake Store API: ${response.statusText}`,
        );
      }
      const fakeProducts = (await response.json()) as FakeProduct[];

      // 2. Identify categories and insert them
      const categoryNames = Array.from(
        new Set(fakeProducts.map((p) => p.category)),
      );

      // Add 'furniture' dynamically to categories
      if (!categoryNames.includes('furniture')) {
        categoryNames.push('furniture');
      }

      const categoryMap = new Map<string, number>();

      for (const catName of categoryNames) {
        const slug = this.slugify(catName);
        const catRes = await client.query<{ id: number }>(
          `INSERT INTO categories (name, slug)
           VALUES ($1, $2)
           ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [catName, slug],
        );
        categoryMap.set(catName, catRes.rows[0].id);
      }

      // 3. Clear existing seeded products (idempotency)
      await client.query(`DELETE FROM products WHERE sku LIKE 'FS-%'`);

      // 4. Insert seeded products from Fake Store API
      for (const p of fakeProducts) {
        const categoryId = categoryMap.get(p.category) ?? null;
        const name = p.title;
        const slug = `${this.slugify(p.title)}-${p.id}`;
        const sku = `FS-${p.id}`;
        const price = Math.round(p.price * 26000);
        const description = p.description;
        const images2d = [p.image];
        const stock = 100; // default stock
        const isPublished = true;

        await client.query(
          `INSERT INTO products (
             category_id, name, slug, sku, price, description, stock, is_published, images_2d
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            categoryId,
            name,
            slug,
            sku,
            price,
            description,
            stock,
            isPublished,
            JSON.stringify(images2d),
          ],
        );
      }

      // 5. Insert 20 custom furniture items
      const mockFurniture = [
        {
          id: 101,
          title: 'Sofa da cao cấp Luxury - Premium Leather Sofa',
          price: 899.99,
          description:
            'Sofa chất liệu da bò Ý cao cấp, thiết kế hiện đại, khung gỗ sồi tự nhiên chống mối mọt. Mang lại vẻ sang trọng cho phòng khách của bạn.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 102,
          title: 'Sofa nỉ phong cách hiện đại - Modern Fabric Sofa',
          price: 499.99,
          description:
            'Sofa nỉ màu xám trung tính, đệm bông ép đàn hồi cao, thiết kế tối giản phù hợp cho căn hộ chung cư hoặc phòng khách nhỏ gọn.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 103,
          title: 'Bàn trà gỗ sồi tự nhiên - Oak Coffee Table',
          price: 199.99,
          description:
            'Bàn trà chế tác từ gỗ sồi tự nhiên nhập khẩu, phủ sơn PU chống thấm nước, tích hợp ngăn kéo đựng đồ tiện dụng.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 104,
          title: 'Ghế thư giãn gỗ bọc nệm - Wooden Lounge Chair',
          price: 149.99,
          description:
            'Ghế bành thư giãn phong cách Bắc Âu, khung gỗ tần bì chắc chắn kết hợp nệm bọc vải canvas mềm mại, thoáng mát.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 105,
          title: 'Tủ sách gỗ Minimalist - Minimalist Wooden Bookshelf',
          price: 249.99,
          description:
            'Kệ sách nhiều tầng bằng gỗ công nghiệp phủ melamine chống xước, thiết kế thông thoáng giúp trang trí và lưu trữ sách gọn gàng.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 106,
          title: 'Giường ngủ gỗ Walnut cao cấp - Walnut Queen Bed Frame',
          price: 799.99,
          description:
            'Khung giường cỡ Queen làm từ gỗ óc chó (Walnut) tự nhiên, vân gỗ sang trọng độc bản, khả năng chịu lực vượt trội không rung lắc.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 107,
          title: 'Đèn sàn Bắc Âu ấm áp - Nordic Floor Lamp',
          price: 79.99,
          description:
            'Đèn đứng trang trí phòng khách hoặc phòng đọc sách, khung thép sơn tĩnh điện đen bóng kết hợp chao đèn vải khuếch tán ánh sáng ấm áp.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 108,
          title: 'Bàn ăn mặt đá cẩm thạch - Marble Dining Table',
          price: 699.99,
          description:
            'Bàn ăn sang trọng dành cho 6 người, mặt đá cẩm thạch trắng nhân tạo chống ố, chống xước cùng chân kim loại mạ vàng.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 109,
          title: 'Ghế ăn bọc da chân sắt - Leather Dining Chair',
          price: 89.99,
          description:
            'Ghế ăn bọc da PU cao cấp chống nước, đệm mút siêu êm, chân sắt sơn tĩnh điện chống rỉ sét sét chịu tải đến 150kg.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 110,
          title: 'Kệ tivi thông minh gỗ sồi - Smart Oak TV Stand',
          price: 349.99,
          description:
            'Kệ tivi thiết kế rút gọn thông minh điều chỉnh chiều dài từ 1.8m đến 2.4m, trang bị nhiều hộc kéo lưu trữ đồ dùng phòng khách.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 111,
          title: 'Ghế công thái học xoay văn phòng - Ergonomic Office Chair',
          price: 179.99,
          description:
            'Ghế ngồi làm việc lưới thoáng khí, hỗ trợ cột sống 3D chỉnh độ cao tựa đầu và tay vịn, giảm đau lưng khi làm việc lâu.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 112,
          title: 'Bàn làm việc nâng hạ thông minh - Smart Standing Desk',
          price: 399.99,
          description:
            'Bàn làm việc thay đổi chiều cao tự động bằng động cơ điện đôi, ghi nhớ 4 vị trí, mặt bàn gỗ tự nhiên phủ melamine.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 113,
          title: 'Tủ quần áo âm tường hiện đại - Modern Built-in Wardrobe',
          price: 599.99,
          description:
            'Tủ áo thiết kế cao kịch trần, cánh lùa tiết kiệm không gian, nhiều ngăn treo đồ và ngăn kéo để trang sức phụ kiện gọn gàng.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 114,
          title: 'Gương đứng soi toàn thân viền gỗ - Full Length Mirror',
          price: 99.99,
          description:
            'Gương soi toàn thân chất liệu kính tráng bạc sắc nét, viền gỗ thông tự nhiên sơn sồi mộc mạc, làm đẹp và tạo cảm giác rộng rãi cho phòng ngủ.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 115,
          title: 'Thảm trải sàn Boho thổ cẩm - Boho Area Rug',
          price: 59.99,
          description:
            'Thảm dệt thổ cẩm sợi cotton tự nhiên thân thiện da chân, họa tiết Boho độc đáo thích hợp làm điểm nhấn phòng khách hay phòng ngủ.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 116,
          title: 'Ghế sofa đơn thư giãn - Single Sofa Accent Chair',
          price: 189.99,
          description:
            'Ghế bành sofa đơn bọc vải nhung êm ái chân kim loại mạ vàng sang trọng, tạo góc thư giãn đọc sách lý tưởng.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 117,
          title: 'Bàn trang điểm đèn LED hiện đại - Dressing Table with LED',
          price: 279.99,
          description:
            'Bàn trang điểm nhỏ gọn viền vàng kim, tích hợp gương soi bo tròn có dải đèn LED cảm ứng 3 chế độ sáng và tủ tab 3 ngăn kéo.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 118,
          title: 'Kệ giày thông minh đa năng - Smart Shoe Rack Cabinet',
          price: 119.99,
          description:
            'Kệ giày cánh lật siêu mỏng tiết kiệm diện tích lối ra vào, sức chứa lên đến 20 đôi giày kèm ngăn trên cùng để chìa khóa ví tiền.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 119,
          title: 'Ghế quầy bar gỗ tần bì - Ash Wooden Bar Stool',
          price: 69.99,
          description:
            'Ghế quầy bar chân cao làm từ gỗ tần bì tự nhiên, đệm ngồi hơi cong công thái học mang lại tư thế thoải mái khi thưởng thức đồ uống.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1579725942955-4d8377f8c66a?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 120,
          title: 'Tủ 5 ngăn kéo gỗ sồi cao cấp - Oak 5-Drawer Chest',
          price: 319.99,
          description:
            'Tủ ngăn kéo lưu trữ đồ gấp gọn trong phòng ngủ, kết cấu mộng gỗ truyền thống bền chắc, tay nắm âm sang trọng và an toàn.',
          category: 'furniture',
          image:
            'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
        },
      ];

      for (const p of mockFurniture) {
        const categoryId = categoryMap.get(p.category) ?? null;
        const name = p.title;
        const slug = `${this.slugify(p.title)}-${p.id}`;
        const sku = `FS-${p.id}`;
        const price = Math.round(p.price * 26000);
        const description = p.description;
        const images2d = [p.image];
        const stock = 100;
        const isPublished = true;

        await client.query(
          `INSERT INTO products (
             category_id, name, slug, sku, price, description, stock, is_published, images_2d
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            categoryId,
            name,
            slug,
            sku,
            price,
            description,
            stock,
            isPublished,
            JSON.stringify(images2d),
          ],
        );
      }

      await client.query('COMMIT');

      return {
        message: 'Seed dữ liệu thành công!',
        categoriesCount: categoryNames.length,
        productsCount: fakeProducts.length + mockFurniture.length,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
