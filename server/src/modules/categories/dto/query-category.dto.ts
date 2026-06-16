import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCategoryDto {
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
    description: 'Tìm kiếm danh mục theo tên hoặc slug',
    example: 'sofa',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc các danh mục con của một danh mục cha cụ thể',
    example: 1,
    type: Number,
  })
  parent_id?: number;

  @ApiPropertyOptional({
    description: 'Trường dùng để sắp xếp kết quả',
    example: 'created_at',
    enum: ['created_at', 'name', 'slug'],
    default: 'created_at',
  })
  sort_by?: 'created_at' | 'name' | 'slug';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  sort_order?: 'ASC' | 'DESC';
}
