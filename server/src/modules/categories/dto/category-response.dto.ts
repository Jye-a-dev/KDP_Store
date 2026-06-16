import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'ID danh mục (Auto increment)',
    example: 1,
  })
  id: number;

  @ApiPropertyOptional({
    description: 'ID danh mục cha. Trả về null nếu là danh mục gốc.',
    example: null,
    nullable: true,
  })
  parent_id: number | null;

  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Ghế Sofa',
  })
  name: string;

  @ApiProperty({
    description: 'Đường dẫn tĩnh duy nhất của danh mục',
    example: 'ghe-sofa',
  })
  slug: string;

  @ApiProperty({
    description: 'Thời điểm tạo danh mục (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  created_at: Date;
}

export class PaginatedCategoriesResponseDto {
  @ApiProperty({
    description: 'Danh sách các danh mục',
    type: [CategoryResponseDto],
  })
  data: CategoryResponseDto[];

  @ApiProperty({
    description: 'Tổng số danh mục khớp với filter',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Trang hiện tại',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Số bản ghi mỗi trang',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Tổng số trang',
    example: 3,
  })
  total_pages: number;
}

export class CategoryCountResponseDto {
  @ApiProperty({
    description: 'Tổng số danh mục trong hệ thống',
    example: 15,
  })
  total: number;

  @ApiProperty({
    description: 'Số lượng danh mục gốc (không có cha)',
    example: 5,
  })
  roots: number;

  @ApiProperty({
    description: 'Số lượng danh mục con',
    example: 10,
  })
  subcategories: number;
}

export class DeleteCategoryResponseDto {
  @ApiProperty({
    description: 'Thông báo xác nhận xoá thành công',
    example: 'Đã xóa danh mục "1" thành công',
  })
  message: string;
}
