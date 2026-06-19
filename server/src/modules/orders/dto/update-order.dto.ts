import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderPaymentInfoDto } from './create-order.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Cập nhật trạng thái đơn hàng',
    example: 'processing',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  })
  order_status?: string;

  @ApiPropertyOptional({
    description: 'Cập nhật thông tin thanh toán',
    type: CreateOrderPaymentInfoDto,
  })
  payment_info?: CreateOrderPaymentInfoDto;

  @ApiPropertyOptional({
    description: 'Cập nhật tên người nhận hàng',
    example: 'Nguyễn Văn A',
  })
  shipping_name?: string;

  @ApiPropertyOptional({
    description: 'Cập nhật số điện thoại người nhận',
    example: '0912345678',
  })
  shipping_phone?: string;

  @ApiPropertyOptional({
    description: 'Cập nhật địa chỉ giao hàng',
    example: '123 Đường ABC, Quận 1, TP. HCM',
  })
  shipping_address?: string;
}
