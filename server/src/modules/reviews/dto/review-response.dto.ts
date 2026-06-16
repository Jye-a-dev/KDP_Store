import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({ description: 'ID đánh giá (Auto increment)', example: 1 })
  id: number;

  @ApiPropertyOptional({
    description: 'UUID của người đánh giá. Trả về null nếu user đã bị xoá.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    nullable: true,
  })
  user_id: string | null;

  @ApiProperty({ description: 'ID của sản phẩm được đánh giá', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'Số sao đánh giá (1-5)', example: 5 })
  rating: number;

  @ApiPropertyOptional({
    description: 'Nội dung nhận xét',
    example: 'Rất tốt',
    nullable: true,
  })
  comment: string | null;

  @ApiProperty({
    description: 'Thời điểm tạo đánh giá (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  created_at: Date;
}

export class PaginatedReviewsResponseDto {
  @ApiProperty({ description: 'Danh sách đánh giá', type: [ReviewResponseDto] })
  data: ReviewResponseDto[];

  @ApiProperty({ description: 'Tổng số đánh giá khớp với filter', example: 12 })
  total: number;

  @ApiProperty({ description: 'Trang hiện tại', example: 1 })
  page: number;

  @ApiProperty({ description: 'Số bản ghi mỗi trang', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Tổng số trang', example: 2 })
  total_pages: number;
}

export class ReviewCountResponseDto {
  @ApiProperty({ description: 'Tổng số đánh giá trong hệ thống', example: 150 })
  total: number;

  @ApiProperty({
    description: 'Điểm đánh giá trung bình (1.0 đến 5.0)',
    example: 4.6,
  })
  average_rating: number;

  @ApiProperty({ description: 'Số lượng đánh giá 5 sao', example: 95 })
  five_stars: number;

  @ApiProperty({ description: 'Số lượng đánh giá 4 sao', example: 35 })
  four_stars: number;

  @ApiProperty({ description: 'Số lượng đánh giá 3 sao', example: 12 })
  three_stars: number;

  @ApiProperty({ description: 'Số lượng đánh giá 2 sao', example: 5 })
  two_stars: number;

  @ApiProperty({ description: 'Số lượng đánh giá 1 sao', example: 3 })
  one_star: number;
}

export class DeleteReviewResponseDto {
  @ApiProperty({
    description: 'Thông báo xác nhận xoá thành công',
    example: 'Đã xóa đánh giá "1" thành công',
  })
  message: string;
}
