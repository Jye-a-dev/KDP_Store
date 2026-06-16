import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserIdentityDto {
  @ApiPropertyOptional({
    description: 'Email liên kết mới từ nhà cung cấp OAuth',
    example: 'new.oauth.user@example.com',
    format: 'email',
    nullable: true,
  })
  provider_email?: string;

  @ApiPropertyOptional({
    description: 'Access Token OAuth mới nhận được',
    example: 'ya29.new_token...',
    nullable: true,
  })
  access_token?: string;
}
