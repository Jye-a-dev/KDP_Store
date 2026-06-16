import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserIdentityResponseDto {
  @ApiProperty({
    description: 'ID định danh liên kết (Auto increment)',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'UUID của người dùng',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  user_id: string;

  @ApiProperty({
    description: 'Nhà cung cấp OAuth',
    example: 'google',
  })
  provider: string;

  @ApiProperty({
    description: 'ID người dùng được cấp bởi nhà cung cấp OAuth',
    example: '12345678901234567890',
  })
  provider_id: string;

  @ApiPropertyOptional({
    description: 'Email liên kết',
    example: 'oauth.user@example.com',
    nullable: true,
    format: 'email',
  })
  provider_email: string | null;

  @ApiPropertyOptional({
    description: 'Access Token OAuth',
    example: 'ya29.a0AfB_byD...',
    nullable: true,
  })
  access_token: string | null;

  @ApiProperty({
    description: 'Thời điểm tạo liên kết (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  created_at: Date;
}

export class PaginatedUserIdentitiesResponseDto {
  @ApiProperty({
    description: 'Danh sách các liên kết tài khoản',
    type: [UserIdentityResponseDto],
  })
  data: UserIdentityResponseDto[];

  @ApiProperty({
    description: 'Tổng số bản ghi khớp với filter',
    example: 1,
  })
  total: number;

  @ApiProperty({
    description: 'Trang hiện tại',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Số bản ghi mỗi trang',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Tổng số trang',
    example: 1,
  })
  total_pages: number;
}

export class UserIdentityCountResponseDto {
  @ApiProperty({
    description: 'Tổng số liên kết OAuth trong hệ thống',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Số lượng liên kết Google',
    example: 30,
  })
  google: number;

  @ApiProperty({
    description: 'Số lượng liên kết Facebook',
    example: 15,
  })
  facebook: number;

  @ApiProperty({
    description: 'Số lượng liên kết khác',
    example: 5,
  })
  others: number;
}

export class DeleteUserIdentityResponseDto {
  @ApiProperty({
    description: 'Thông báo xác nhận xoá thành công',
    example: 'Đã xóa liên kết tài khoản "1" thành công',
  })
  message: string;
}
