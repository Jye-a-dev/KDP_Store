import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUserDto {
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
    description: 'Tìm kiếm theo email hoặc họ tên (không phân biệt hoa thường)',
    example: 'nguyenvana',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo vai trò người dùng',
    example: 'customer',
    enum: ['customer', 'admin'],
  })
  role?: 'customer' | 'admin';

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái hoạt động',
    example: true,
    type: Boolean,
  })
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Trường dùng để sắp xếp kết quả',
    example: 'created_at',
    enum: ['created_at', 'full_name', 'email'],
    default: 'created_at',
  })
  sort_by?: 'created_at' | 'full_name' | 'email';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  sort_order?: 'ASC' | 'DESC';
}
