import { ApiProperty } from '@nestjs/swagger';

export class CreatePageContentDto {
  @ApiProperty({
    description: 'Key định danh nội dung',
    example: 'announcement_bar',
  })
  key!: string;

  @ApiProperty({
    description: 'Nội dung hiển thị',
    example: 'Giảm giá 50% hôm nay',
  })
  value!: string;
}
