import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({
    description: 'Tên người nhận tại địa chỉ này',
    example: 'Nguyễn Văn A',
  })
  name: string;

  @ApiProperty({
    description: 'Số điện thoại liên lạc tại địa chỉ này',
    example: '0901234567',
  })
  phone: string;

  @ApiProperty({
    description: 'Địa chỉ đầy đủ (số nhà, đường, quận, tỉnh/thành)',
    example: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  })
  address: string;

  @ApiPropertyOptional({
    description: 'Đánh dấu đây là địa chỉ mặc định',
    example: true,
    default: false,
  })
  is_default?: boolean;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Email duy nhất của người dùng (dùng để đăng nhập)',
    example: 'nguyenvana@example.com',
    format: 'email',
  })
  email: string;

  @ApiPropertyOptional({
    description:
      'Mật khẩu đã được hash (bcrypt). Để trống nếu đăng nhập qua OAuth.',
    example: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36jQZ6qAvtW1nTi2v4xlBXy',
  })
  password_hash?: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ của người dùng',
    example: 'Nguyễn Văn A',
    minLength: 2,
    maxLength: 100,
  })
  full_name: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại (10 chữ số, bắt đầu bằng 0)',
    example: '0901234567',
    pattern: '^0[0-9]{9}$',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL ảnh đại diện',
    example: 'https://storage.kdpstore.vn/avatars/user-abc123.jpg',
    format: 'uri',
  })
  avatar_url?: string;

  @ApiPropertyOptional({
    description: 'Vai trò của người dùng trong hệ thống',
    example: 'customer',
    enum: ['customer', 'admin'],
    default: 'customer',
  })
  role?: 'customer' | 'admin';

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động của tài khoản',
    example: true,
    default: true,
  })
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Danh sách địa chỉ giao hàng của người dùng',
    type: [AddressDto],
    example: [
      {
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Nguyễn Huệ, Q1, TP. HCM',
        is_default: true,
      },
    ],
  })
  addresses?: AddressDto[];
}
