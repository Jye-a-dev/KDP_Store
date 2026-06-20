import { ApiProperty } from '@nestjs/swagger';

export class CreateStaticPageDto {
  @ApiProperty({
    description: 'Đường dẫn tĩnh duy nhất cho trang',
    example: 'doi-tra-de-dang',
  })
  slug!: string;

  @ApiProperty({
    description: 'Tiêu đề của trang',
    example: 'Đổi Trả Dễ Dàng',
  })
  title!: string;

  @ApiProperty({
    description: 'Nội dung chi tiết của trang (HTML/Markdown/Text)',
    example: '<p>Chính sách đổi trả trong vòng 7 ngày...</p>',
  })
  content!: string;

  @ApiProperty({
    description: 'Nhóm phân loại: service (Dịch vụ) hoặc explore (Khám phá)',
    example: 'service',
    enum: ['service', 'explore'],
  })
  group_type!: 'service' | 'explore';
}
