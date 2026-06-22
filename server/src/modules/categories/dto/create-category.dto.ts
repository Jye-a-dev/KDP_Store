import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiPropertyOptional({
    description: 'ID của danh mục cha. Để trống nếu là danh mục gốc.',
    example: null,
    nullable: true,
  })
  parent_id?: number;

  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Ghế Sofa',
    minLength: 2,
    maxLength: 100,
  })
  name!: string;

  @ApiPropertyOptional({
    description:
      'Đường dẫn tĩnh duy nhất. Nếu để trống sẽ được sinh tự động từ tên.',
    example: 'ghe-sofa',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Có hiển thị trên thanh navbar hay không',
    example: false,
    default: false,
  })
  show_on_navbar?: boolean;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    example: 0,
    default: 0,
  })
  sort_order?: number;

  @ApiPropertyOptional({
    description: 'Đường dẫn ảnh danh mục',
    example: 'https://images.unsplash.com/...',
    nullable: true,
  })
  image_url?: string;
}
