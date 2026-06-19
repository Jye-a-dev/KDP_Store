import { ApiProperty } from '@nestjs/swagger';

export class UpdatePageContentDto {
  @ApiProperty({
    description: 'Nội dung hiển thị mới',
    example: 'Giảm giá 50% ngày mai',
  })
  value!: string;
}
