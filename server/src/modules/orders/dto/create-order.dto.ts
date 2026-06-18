import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'ID của sản phẩm', example: 1 })
  product_id: number | undefined;

  @ApiProperty({ description: 'Số lượng mua', example: 1, minimum: 1 })
  quantity: number | undefined;

  @ApiPropertyOptional({ description: 'Màu sắc lựa chọn', example: '#000000' })
  color?: string;
}

export class CreateOrderPaymentInfoDto {
  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'COD',
    default: 'COD',
  })
  method: string | undefined;

  @ApiPropertyOptional({
    description: 'Mã giao dịch từ cổng thanh toán',
    example: null,
    nullable: true,
  })
  transaction_id?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái thanh toán',
    example: 'pending',
    default: 'pending',
  })
  status?: string;

  @ApiPropertyOptional({
    description: 'Thời điểm thanh toán',
    example: null,
    nullable: true,
  })
  paid_at?: string;
}

export class CreateOrderDto {
  @ApiPropertyOptional({
    description: 'UUID của người mua (null nếu mua không cần tài khoản)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    nullable: true,
  })
  user_id?: string;

  @ApiProperty({
    description: 'Họ tên người nhận hàng',
    example: 'Nguyễn Văn A',
  })
  shipping_name: string | undefined;

  @ApiProperty({
    description: 'Số điện thoại nhận hàng',
    example: '0901234567',
  })
  shipping_phone: string | undefined;

  @ApiProperty({
    description: 'Địa chỉ nhận hàng chi tiết',
    example: '123 Nguyễn Huệ, Quận 1, TP. HCM',
  })
  shipping_address: string | undefined;

  @ApiPropertyOptional({
    description: 'Phí vận chuyển',
    example: 30000,
    default: 0.0,
  })
  shipping_fee?: number;

  @ApiProperty({
    description:
      'Danh sách sản phẩm mua (chỉ cần gửi ID và số lượng, server tự tính giá hiện tại)',
    type: [CreateOrderItemDto],
  })
  items: CreateOrderItemDto[] | undefined;

  @ApiPropertyOptional({
    description: 'Thông tin thanh toán ban đầu',
    type: CreateOrderPaymentInfoDto,
  })
  payment_info?: CreateOrderPaymentInfoDto;
}
