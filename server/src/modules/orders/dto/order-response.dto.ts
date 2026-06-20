import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderPaymentInfoDto } from './create-order.dto';

export class OrderItemResponseDto {
  @ApiProperty({ description: 'ID của sản phẩm', example: 1 })
  product_id!: number;

  @ApiProperty({
    description: 'Tên sản phẩm tại thời điểm mua',
    example: 'Ghế Sofa Cổ Điển',
  })
  name!: string;

  @ApiProperty({ description: 'Số lượng mua', example: 1 })
  quantity!: number;

  @ApiProperty({
    description: 'Giá sản phẩm tại thời điểm mua',
    example: 5500000,
  })
  price!: number;

  @ApiPropertyOptional({ description: 'Màu sắc được chọn', example: '#000000' })
  color?: string; // Các thuộc tính optional (?) thì không cần thêm !
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'UUID của đơn hàng',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  id!: string;

  @ApiPropertyOptional({
    description: 'UUID của người mua',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    nullable: true,
  })
  user_id!: string | null;

  @ApiProperty({ description: 'Tổng tiền các sản phẩm', example: 5500000 })
  total_amount!: number;

  @ApiProperty({ description: 'Phí vận chuyển', example: 30000 })
  shipping_fee!: number;

  @ApiProperty({
    description: 'Tổng số tiền phải thanh toán',
    example: 5530000,
  })
  final_amount!: number;

  @ApiProperty({ description: 'Họ tên người nhận', example: 'Nguyễn Văn A' })
  shipping_name!: string;

  @ApiProperty({
    description: 'Số điện thoại người nhận',
    example: '0901234567',
  })
  shipping_phone!: string;

  @ApiProperty({
    description: 'Địa chỉ nhận hàng chi tiết',
    example: '123 Nguyễn Huệ, Q1, TP. HCM',
  })
  shipping_address!: string;

  @ApiProperty({
    description: 'Danh sách sản phẩm snapshot',
    type: [OrderItemResponseDto],
  })
  items!: OrderItemResponseDto[];

  @ApiProperty({
    description: 'Thông tin thanh toán',
    type: CreateOrderPaymentInfoDto,
  })
  payment_info!: CreateOrderPaymentInfoDto;

  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    example: 'pending',
  })
  order_status!: string;

  @ApiProperty({
    description: 'Thời điểm tạo đơn hàng (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'Thời điểm cập nhật đơn hàng cuối cùng (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  updated_at!: Date;
}

export class PaginatedOrdersResponseDto {
  @ApiProperty({ description: 'Danh sách đơn hàng', type: [OrderResponseDto] })
  data!: OrderResponseDto[];

  @ApiProperty({ description: 'Tổng số đơn hàng khớp với filter', example: 20 })
  total!: number;

  @ApiProperty({ description: 'Trang hiện tại', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Số bản ghi mỗi trang', example: 10 })
  limit!: number;

  @ApiProperty({ description: 'Tổng số trang', example: 2 })
  total_pages!: number;
}

export class OrderCountResponseDto {
  @ApiProperty({ description: 'Tổng số đơn hàng', example: 100 })
  total!: number;

  @ApiProperty({
    description: 'Số đơn hàng đang chờ xử lý (pending)',
    example: 40,
  })
  pending!: number;

  @ApiProperty({
    description: 'Số đơn hàng đang xử lý (processing)',
    example: 30,
  })
  processing!: number;

  @ApiProperty({ description: 'Số đơn hàng đã giao (delivered)', example: 20 })
  delivered!: number;

  @ApiProperty({ description: 'Số đơn hàng đã hủy (cancelled)', example: 10 })
  cancelled!: number;

  @ApiProperty({
    description: 'Tổng doanh thu từ tất cả các đơn hàng thành công ',
    example: 120500000,
  })
  total_revenue!: number;
}

export class DeleteOrderResponseDto {
  @ApiProperty({
    description: 'Thông báo xác nhận xoá thành công',
    example:
      'Đã xóa đơn hàng "a1b2c3d4-e5f6-7890-abcd-ef1234567890" thành công',
  })
  message!: string;
}
