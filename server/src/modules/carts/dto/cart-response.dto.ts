import { ApiProperty } from '@nestjs/swagger';
import { CartItemDto } from './create-cart.dto';

export class CartResponseDto {
  @ApiProperty({
    description: 'UUID của giỏ hàng',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'UUID của người sở hữu giỏ hàng',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  user_id: string;

  @ApiProperty({
    description: 'Danh sách các mặt hàng trong giỏ',
    type: [CartItemDto],
  })
  items: CartItemDto[];

  @ApiProperty({
    description: 'Thời điểm tạo giỏ hàng (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Thời điểm cập nhật giỏ hàng cuối cùng (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  updated_at: Date;
}

export class PaginatedCartsResponseDto {
  @ApiProperty({ description: 'Danh sách giỏ hàng', type: [CartResponseDto] })
  data: CartResponseDto[];

  @ApiProperty({ description: 'Tổng số giỏ hàng', example: 10 })
  total: number;

  @ApiProperty({ description: 'Trang hiện tại', example: 1 })
  page: number;

  @ApiProperty({ description: 'Số bản ghi mỗi trang', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Tổng số trang', example: 1 })
  total_pages: number;
}

export class CartCountResponseDto {
  @ApiProperty({ description: 'Tổng số giỏ hàng trong hệ thống', example: 50 })
  total: number;

  @ApiProperty({ description: 'Số lượng giỏ hàng có chứa hàng', example: 35 })
  active_carts: number;

  @ApiProperty({ description: 'Số lượng giỏ hàng trống', example: 15 })
  empty_carts: number;
}

export class DeleteCartResponseDto {
  @ApiProperty({
    description: 'Thông báo xác nhận xoá thành công',
    example:
      'Đã xóa giỏ hàng "a1b2c3d4-e5f6-7890-abcd-ef1234567890" thành công',
  })
  message: string;
}
