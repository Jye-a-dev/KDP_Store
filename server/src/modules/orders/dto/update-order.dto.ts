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
}
