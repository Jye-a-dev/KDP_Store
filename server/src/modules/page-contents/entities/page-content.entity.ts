import { ApiProperty } from '@nestjs/swagger';

export class PageContent {
  @ApiProperty({ description: 'Key của nội dung giao diện' })
  key!: string;

  @ApiProperty({ description: 'Giá trị nội dung' })
  value!: string;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  updated_at?: Date;
}
