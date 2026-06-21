import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.config';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Cấu hình static folder phục vụ files (như hình ảnh, model 3D) ngoài src code
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Server đang chạy tại:    http://localhost:${port}`);
  console.log(`📄 Swagger UI có tại:       http://localhost:${port}/api/docs`);
  console.log(
    `📦 Swagger JSON có tại:     http://localhost:${port}/api/docs-json\n`,
  );
}
void bootstrap();
