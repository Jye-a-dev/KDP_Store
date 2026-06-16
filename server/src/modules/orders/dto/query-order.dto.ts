import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryOrderDto {
  @ApiPropertyOptional({
    description: 'Trang hiện tại (bắt đầu từ 1)',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Số bản ghi mỗi trang (tối đa 100)',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Lọc theo UUID người dùng',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái đơn hàng',
    example: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  })
  order_status?: string;

  @ApiPropertyOptional({
    description: 'Lọc đơn hàng có tổng tiền tối thiểu',
    example: 1000000,
    type: Number,
  })
  min_amount?: number;

  @ApiPropertyOptional({
    description: 'Lọc đơn hàng có tổng tiền tối đa',
    example: 5000000,
    type: Number,
  })
  max_amount?: number;

  @ApiPropertyOptional({
    description: 'Lọc theo phương thức thanh toán',
    example: 'VNPAY',
  })
  payment_method?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái thanh toán',
    example: 'completed',
  })
  payment_status?: string;

  @ApiPropertyOptional({
    description: 'Trường dùng để sắp xếp kết quả',
    example: 'created_at',
    enum: ['created_at', 'total_amount'],
    default: 'created_at',
  })
  sort_by?: 'created_at' | 'total_amount';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  sort_order?: 'ASC' | 'DESC';
}
