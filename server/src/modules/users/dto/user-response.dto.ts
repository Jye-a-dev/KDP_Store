import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─────────────────────────────────────────────
// Address Response
// ─────────────────────────────────────────────
export class AddressResponseDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  name: string;

  @ApiProperty({ example: '0901234567' })
  phone: string;

  @ApiProperty({ example: '123 Nguyễn Huệ, Q1, TP. HCM' })
  address: string;

  @ApiPropertyOptional({ example: true })
  is_default?: boolean;
}

// ─────────────────────────────────────────────
// User Response (không có password_hash)
// ─────────────────────────────────────────────
export class UserResponseDto {
  @ApiProperty({
    description: 'UUID của người dùng',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Email người dùng',
    example: 'nguyenvana@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Văn A',
  })
  full_name: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '0901234567',
    nullable: true,
  })
  phone: string | null;

  @ApiPropertyOptional({
    description: 'URL ảnh đại diện',
    example: 'https://storage.kdpstore.vn/avatars/user-abc123.jpg',
    nullable: true,
    format: 'uri',
  })
  avatar_url: string | null;

  @ApiProperty({
    description: 'Vai trò trong hệ thống',
    example: 'customer',
    enum: ['customer', 'admin'],
  })
  role: 'customer' | 'admin';

  @ApiProperty({
    description: 'Trạng thái hoạt động của tài khoản',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Danh sách địa chỉ giao hàng',
    type: [AddressResponseDto],
    example: [
      {
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Nguyễn Huệ, Q1, TP. HCM',
        is_default: true,
      },
    ],
  })
  addresses: AddressResponseDto[];

  @ApiProperty({
    description: 'Thời điểm tạo tài khoản (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Thời điểm cập nhật cuối (ISO 8601)',
    example: '2024-06-10T14:22:30.000Z',
    format: 'date-time',
  })
  updated_at: Date;
}

// ─────────────────────────────────────────────
// Paginated Users Response
// ─────────────────────────────────────────────
export class PaginatedUsersResponseDto {
  @ApiProperty({
    description: 'Danh sách người dùng trong trang hiện tại',
    type: [UserResponseDto],
  })
  data: UserResponseDto[];

  @ApiProperty({
    description: 'Tổng số người dùng khớp với filter',
    example: 42,
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
    example: 5,
  })
  total_pages: number;
}

// ─────────────────────────────────────────────
// Count Response
// ─────────────────────────────────────────────
export class UserCountResponseDto {
  @ApiProperty({
    description: 'Tổng số người dùng trong hệ thống',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Số lượng khách hàng (role = customer)',
    example: 135,
  })
  customers: number;

  @ApiProperty({
    description: 'Số lượng admin (role = admin)',
    example: 15,
  })
  admins: number;

  @ApiProperty({
    description: 'Số tài khoản đang hoạt động (is_active = true)',
    example: 142,
  })
  active: number;

  @ApiProperty({
    description: 'Số tài khoản bị vô hiệu hoá (is_active = false)',
    example: 8,
  })
  inactive: number;
}

// ─────────────────────────────────────────────
// Delete Response
// ─────────────────────────────────────────────
export class DeleteUserResponseDto {
  @ApiProperty({
    description: 'Thông báo xác nhận xoá thành công',
    example: 'Đã xóa user "a1b2c3d4-e5f6-7890-abcd-ef1234567890" thành công',
  })
  message: string;
}
