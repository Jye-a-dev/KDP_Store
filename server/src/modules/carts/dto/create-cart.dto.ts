import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    description: 'ID của sản phẩm',
    example: 1,
  })
  product_id!: number;

  @ApiProperty({
    description: 'Số lượng sản phẩm trong giỏ hàng',
    example: 2,
    minimum: 1,
  })
  quantity!: number;

  @ApiPropertyOptional({
    description: 'Màu sắc được chọn của sản phẩm (mã HEX hoặc tên màu)',
    example: '#FF0000',
  })
  selected_color?: string;
}

export class CreateCartDto {
  @ApiProperty({
    description: 'UUID của người sở hữu giỏ hàng',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  user_id!: string;

  @ApiPropertyOptional({
    description: 'Danh sách các mặt hàng trong giỏ',
    type: [CartItemDto],
    default: [],
  })
  items?: CartItemDto[];
}
