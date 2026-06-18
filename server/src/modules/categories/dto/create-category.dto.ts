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
}
