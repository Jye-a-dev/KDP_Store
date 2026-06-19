import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/pg.provider';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { PaginatedOrders, Order, OrderItem } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';

interface CountRow {
  total: string;
  pending: string;
  processing: string;
  delivered: string;
  cancelled: string;
  total_revenue: string | null;
}

interface CountResult {
  total: string;
}

@Injectable()
export class OrdersService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateOrderDto): Promise<Order> {
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

    // Kết nối client từ pool để bắt đầu Transaction
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      const itemsSnapshot: OrderItem[] = [];
      let totalAmount = 0;

      // 2. Kiểm tra tồn kho và lấy thông tin giá từng sản phẩm
      // FIX 1: Thêm fallback `|| []` để tránh lỗi dto.items bị undefined
      for (const item of dto.items || []) {
        // FIX 2: Xử lý item.quantity bị undefined và ép về number mặc định là 1
        const orderQuantity = Number(item.quantity ?? 1);

        // Query khóa dòng (SELECT FOR UPDATE) để tránh tranh chấp đồng thời
        const prodRes = await client.query<Product>(
          'SELECT id, name, price, discount_price, stock, is_published FROM products WHERE id = $1 FOR UPDATE',
          [item.product_id],
        );
        const product = prodRes.rows[0];

        if (!product) {
          throw new NotFoundException(
            `Sản phẩm với id "${item.product_id}" không tồn tại`,
          );
        }

        if (!product.is_published) {
          throw new ConflictException(
            `Sản phẩm "${product.name}" đã ngừng kinh doanh`,
          );
        }

        // Dùng biến orderQuantity đã được làm sạch
        if (product.stock < orderQuantity) {
          throw new ConflictException(
            `Sản phẩm "${product.name}" không đủ hàng trong kho (Còn lại: ${product.stock}, yêu cầu: ${orderQuantity})`,
          );
        }

        // Xác định giá mua (ưu tiên giá khuyến mãi)
        const activePrice =
          product.discount_price !== null &&
          product.discount_price !== undefined
            ? Number(product.discount_price)
            : Number(product.price);

        totalAmount += activePrice * orderQuantity;

        // Trừ kho
        await client.query(
          'UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2',
          [orderQuantity, item.product_id],
        );

        // Thêm vào snapshot
        itemsSnapshot.push({
          product_id: product.id,
          name: product.name,
          quantity: orderQuantity, // FIX 3: Truyền thẳng số nguyên chuẩn
          price: activePrice,
          color: item.color,
        });
      }

      const shippingFee = Number(dto.shipping_fee ?? 0);
      const finalAmount = totalAmount + shippingFee;

      const paymentInfo = dto.payment_info ?? {
        method: 'COD',
        status: 'pending',
      };

      // 3. Tạo đơn hàng
      const orderRes = await client.query<Order>(
        `INSERT INTO orders (
           user_id, total_amount, shipping_fee, final_amount,
           shipping_name, shipping_phone, shipping_address, items, payment_info
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          dto.user_id ?? null,
          totalAmount,
          shippingFee,
          finalAmount,
          dto.shipping_name,
          dto.shipping_phone,
          dto.shipping_address,
          JSON.stringify(itemsSnapshot),
          JSON.stringify(paymentInfo),
        ],
      );

      await client.query('COMMIT');
      return orderRes.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // ─────────────────────────────────────────────
  // FIND ALL (filter + pagination + count)
  // ─────────────────────────────────────────────
  async findAll(query: QueryOrderDto): Promise<PaginatedOrders> {
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

    if (query.order_status) {
      conditions.push(`order_status = $${idx}`);
      params.push(query.order_status);
      idx++;
    }

    if (query.min_amount !== undefined) {
      conditions.push(`final_amount >= $${idx}`);
      params.push(Number(query.min_amount));
      idx++;
    }

    if (query.max_amount !== undefined) {
      conditions.push(`final_amount <= $${idx}`);
      params.push(Number(query.max_amount));
      idx++;
    }

    if (query.payment_method) {
      conditions.push(`payment_info->>'method' = $${idx}`);
      params.push(query.payment_method);
      idx++;
    }

    if (query.payment_status) {
      conditions.push(`payment_info->>'status' = $${idx}`);
      params.push(query.payment_status);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<CountResult>(
      `SELECT COUNT(*) AS total FROM orders ${where}`,
      params,
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const { rows } = await this.db.query<Order>(
      `SELECT * FROM orders
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
  async findOne(id: string): Promise<Order> {
    const { rows } = await this.db.query<Order>(
      'SELECT * FROM orders WHERE id = $1',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Đơn hàng với id "${id}" không tồn tại`);
    }
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const current = await this.findOne(id); // kiểm tra tồn tại

    const fields: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (dto.order_status !== undefined) {
      // Nếu hủy đơn hàng đang ở trạng thái pending/processing, cần hoàn lại kho?
      // Để đơn giản và đúng nghiệp vụ, ta có thể tự động trả lại kho khi đơn chuyển sang 'cancelled'
      if (
        dto.order_status === 'cancelled' &&
        current.order_status !== 'cancelled'
      ) {
        const client = await this.db.connect();
        try {
          await client.query('BEGIN');
          for (const item of current.items) {
            await client.query(
              'UPDATE products SET stock = stock + $1, updated_at = NOW() WHERE id = $2',
              [item.quantity, item.product_id],
            );
          }
          await client.query('COMMIT');
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      }

      fields.push(`order_status = $${idx}`);
      params.push(dto.order_status);
      idx++;
    }

    if (dto.payment_info !== undefined) {
      fields.push(`payment_info = $${idx}`);
      params.push(JSON.stringify(dto.payment_info));
      idx++;
    }

    if (dto.shipping_name !== undefined) {
      fields.push(`shipping_name = $${idx}`);
      params.push(dto.shipping_name);
      idx++;
    }

    if (dto.shipping_phone !== undefined) {
      fields.push(`shipping_phone = $${idx}`);
      params.push(dto.shipping_phone);
      idx++;
    }

    if (dto.shipping_address !== undefined) {
      fields.push(`shipping_address = $${idx}`);
      params.push(dto.shipping_address);
      idx++;
    }

    if (fields.length === 0) return this.findOne(id);

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const { rows } = await this.db.query<Order>(
      `UPDATE orders SET ${fields.join(', ')}
       WHERE id = $${idx}
       RETURNING *`,
      params,
    );
    return rows[0];
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id); // kiểm tra tồn tại
    await this.db.query('DELETE FROM orders WHERE id = $1', [id]);
    return { message: `Đã xóa đơn hàng "${id}" thành công` };
  }

  // ─────────────────────────────────────────────
  // COUNT
  // ─────────────────────────────────────────────
  async count(query: QueryOrderDto): Promise<{
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
    total_revenue: number;
  }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (query.user_id) {
      conditions.push(`user_id = $${idx}`);
      params.push(query.user_id);
      idx++;
    }

    if (query.order_status) {
      conditions.push(`order_status = $${idx}`);
      params.push(query.order_status);
      idx++;
    }

    if (query.min_amount !== undefined) {
      conditions.push(`final_amount >= $${idx}`);
      params.push(Number(query.min_amount));
      idx++;
    }

    if (query.max_amount !== undefined) {
      conditions.push(`final_amount <= $${idx}`);
      params.push(Number(query.max_amount));
      idx++;
    }

    if (query.payment_method) {
      conditions.push(`payment_info->>'method' = $${idx}`);
      params.push(query.payment_method);
      idx++;
    }

    if (query.payment_status) {
      conditions.push(`payment_info->>'status' = $${idx}`);
      params.push(query.payment_status);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await this.db.query<CountRow>(
      `
      SELECT
        COUNT(*)                                                      AS total,
        COUNT(*) FILTER (WHERE order_status = 'pending')              AS pending,
        COUNT(*) FILTER (WHERE order_status = 'processing')           AS processing,
        COUNT(*) FILTER (WHERE order_status = 'delivered')            AS delivered,
        COUNT(*) FILTER (WHERE order_status = 'cancelled')            AS cancelled,
        SUM(final_amount) FILTER (WHERE order_status = 'delivered')   AS total_revenue
      FROM orders
      ${where}
    `,
      params,
    );
    const r = rows[0];
    return {
      total: parseInt(r.total, 10),
      pending: parseInt(r.pending, 10),
      processing: parseInt(r.processing, 10),
      delivered: parseInt(r.delivered, 10),
      cancelled: parseInt(r.cancelled, 10),
      total_revenue: Number(r.total_revenue ?? 0),
    };
  }
}
