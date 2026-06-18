import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiPropertyOptional({
    description:
      'UUID của người đánh giá. Trả về null nếu ẩn danh hoặc user bị xoá.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    nullable: true,
  })
  user_id?: string;

  @ApiProperty({
    description: 'ID của sản phẩm được đánh giá',
    example: 1,
  })
  product_id!: number;

  @ApiProperty({
    description: 'Số sao đánh giá (từ 1 đến 5 sao)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating?: number;

  @ApiPropertyOptional({
    description: 'Nội dung nhận xét chi tiết',
    example: 'Sản phẩm rất đẹp, chất lượng cao, giao hàng nhanh chóng!',
    nullable: true,
  })
  comment?: string;
}
