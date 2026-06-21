import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description:
      'ID của danh mục cha mới. Để trống nếu muốn chuyển thành danh mục gốc.',
    example: null,
    nullable: true,
  })
  parent_id?: number;

  @ApiPropertyOptional({
    description: 'Tên danh mục mới',
    example: 'Ghế Sofa Da',
    minLength: 2,
    maxLength: 100,
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn tĩnh mới. Phải là duy nhất.',
    example: 'ghe-sofa-da',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Có hiển thị trên thanh navbar hay không',
    example: true,
  })
  show_on_navbar?: boolean;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    example: 1,
  })
  sort_order?: number;
}
