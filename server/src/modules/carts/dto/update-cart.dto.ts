import { ApiProperty } from '@nestjs/swagger';
import { CartItemDto } from './create-cart.dto';

export class UpdateCartDto {
  @ApiProperty({
    description: 'Danh sách các mặt hàng cập nhật trong giỏ (ghi đè mảng cũ)',
    type: [CartItemDto],
  })
  items: CartItemDto[];
}
