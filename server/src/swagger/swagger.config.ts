import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('KDP Store API')
    .setDescription(
      `
## Giới thiệu
API backend cho hệ thống quản lý cửa hàng **KDP Store**.

## Authentication
Hiện tại API chưa yêu cầu xác thực. Bearer token sẽ được bổ sung trong phiên bản sau.

## Phân trang
Các endpoint trả về danh sách đều hỗ trợ phân trang qua query params:
- \`page\`: Trang hiện tại (mặc định: 1)
- \`limit\`: Số bản ghi mỗi trang (mặc định: 10, tối đa: 100)
    `,
    )
    .setVersion('1.0.0')
    .setContact('KDP Store Team', '', 'admin@kdpstore.vn')
    .addTag('users', 'Quản lý người dùng — CRUD & thống kê')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'KDP Store API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
    },
  });
}
