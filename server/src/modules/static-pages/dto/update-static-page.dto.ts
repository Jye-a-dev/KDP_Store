import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStaticPageDto {
  @ApiPropertyOptional({
    description: 'Đường dẫn tĩnh duy nhất mới cho trang',
    example: 'doi-tra-de-dang-new',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Tiêu đề mới của trang',
    example: 'Chính Sách Đổi Trả Dễ Dàng',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Nội dung chi tiết mới của trang',
    example: '<p>Nội dung đổi trả cập nhật...</p>',
  })
  content?: string;

  @ApiPropertyOptional({
    description: 'Nhóm phân loại mới',
    example: 'explore',
    enum: ['service', 'explore'],
  })
  group_type?: 'service' | 'explore';
}
