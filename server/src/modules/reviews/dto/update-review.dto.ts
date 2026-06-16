import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiPropertyOptional({
    description: 'Cập nhật số sao đánh giá (từ 1 đến 5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  rating?: number;

  @ApiPropertyOptional({
    description: 'Cập nhật nội dung nhận xét chi tiết',
    example: 'Sản phẩm dùng tốt sau vài ngày thử nghiệm.',
    nullable: true,
  })
  comment?: string;
}
