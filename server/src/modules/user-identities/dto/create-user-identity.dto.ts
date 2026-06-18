import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserIdentityDto {
  @ApiProperty({
    description: 'UUID của người dùng liên kết',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  user_id!: string;

  @ApiProperty({
    description: 'Nhà cung cấp OAuth (ví dụ: google, facebook)',
    example: 'google',
  })
  provider!: string;

  @ApiProperty({
    description: 'ID người dùng được cấp bởi nhà cung cấp OAuth',
    example: '12345678901234567890',
  })
  provider_id!: string;

  @ApiPropertyOptional({
    description: 'Email liên kết từ nhà cung cấp OAuth',
    example: 'oauth.user@example.com',
    format: 'email',
    nullable: true,
  })
  provider_email?: string;

  @ApiPropertyOptional({
    description: 'Access Token OAuth nhận được',
    example: 'ya29.a0AfB_byD...',
    nullable: true,
  })
  access_token?: string;
}
