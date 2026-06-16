import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductDto {
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
    description: 'Tìm kiếm sản phẩm theo tên, sku hoặc slug',
    example: 'sofa',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc sản phẩm theo danh mục',
    example: 1,
    type: Number,
  })
  category_id?: number;

  @ApiPropertyOptional({
    description: 'Lọc sản phẩm có giá lớn hơn hoặc bằng giá trị này',
    example: 1000000,
    type: Number,
  })
  min_price?: number;

  @ApiPropertyOptional({
    description: 'Lọc sản phẩm có giá nhỏ hơn hoặc bằng giá trị này',
    example: 10000000,
    type: Number,
  })
  max_price?: number;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái hiển thị sản phẩm',
    example: true,
    type: Boolean,
  })
  is_published?: boolean;

  @ApiPropertyOptional({
    description: 'Trường dùng để sắp xếp kết quả',
    example: 'created_at',
    enum: ['created_at', 'name', 'price', 'stock'],
    default: 'created_at',
  })
  sort_by?: 'created_at' | 'name' | 'price' | 'stock';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  sort_order?: 'ASC' | 'DESC';
}
