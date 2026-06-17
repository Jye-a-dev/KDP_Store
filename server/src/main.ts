import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

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
