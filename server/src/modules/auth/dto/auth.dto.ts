import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'nguyenvana@example.com' })
  email: string;

  @ApiProperty({ example: 'matkhau123' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  full_name: string;

  @ApiProperty({ example: 'nguyenvana@example.com' })
  email: string;

  @ApiProperty({ example: 'matkhau123' })
  password: string;

  @ApiPropertyOptional({ example: '0901234567' })
  phone?: string;
}

export class AuthUserDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() full_name: string;
  @ApiPropertyOptional() phone?: string;
  @ApiPropertyOptional() avatar_url?: string;
  @ApiProperty() role: string;
  @ApiProperty() is_active: boolean;
}

export class AuthResponseDto {
  @ApiProperty() access_token: string;
  @ApiProperty({ type: AuthUserDto }) user: AuthUserDto;
}
