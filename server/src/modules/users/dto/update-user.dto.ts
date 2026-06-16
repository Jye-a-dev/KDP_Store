import { ApiPropertyOptional } from '@nestjs/swagger';
import { AddressDto } from './create-user.dto';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email mới của người dùng (phải là email duy nhất)',
    example: 'newemail@example.com',
    format: 'email',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Mật khẩu mới đã được hash (bcrypt)',
    example: '$2b$10$newHashedPasswordExampleXXXXXXXXXXXXXXXXXX',
  })
  password_hash?: string;

  @ApiPropertyOptional({
    description: 'Họ và tên mới',
    example: 'Trần Thị B',
    minLength: 2,
    maxLength: 100,
  })
  full_name?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại mới',
    example: '0912345678',
    pattern: '^0[0-9]{9}$',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL ảnh đại diện mới',
    example: 'https://storage.kdpstore.vn/avatars/user-xyz789.jpg',
    format: 'uri',
  })
  avatar_url?: string;

  @ApiPropertyOptional({
    description: 'Thay đổi vai trò của người dùng',
    example: 'admin',
    enum: ['customer', 'admin'],
  })
  role?: 'customer' | 'admin';

  @ApiPropertyOptional({
    description: 'Kích hoạt hoặc vô hiệu hoá tài khoản',
    example: false,
  })
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Cập nhật toàn bộ danh sách địa chỉ (ghi đè)',
    type: [AddressDto],
    example: [
      {
        name: 'Trần Thị B',
        phone: '0912345678',
        address: '456 Lê Lợi, Q3, TP. HCM',
        is_default: true,
      },
      {
        name: 'Trần Thị B (văn phòng)',
        phone: '0912345678',
        address: '789 Điện Biên Phủ, Bình Thạnh, TP. HCM',
        is_default: false,
      },
    ],
  })
  addresses?: AddressDto[];
}
