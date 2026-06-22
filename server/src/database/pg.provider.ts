import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const PG_CONNECTION = 'PG_CONNECTION';

export const pgProvider = {
  provide: PG_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Pool => {
    const logger = new Logger('DatabaseModule');

    const pool = new Pool({
      host: configService.get<string>('app.db.host'),
      port: configService.get<number>('app.db.port'),
      user: configService.get<string>('app.db.username'),
      password: configService.get<string>('app.db.password'),
      database: configService.get<string>('app.db.name'),
    });

    // Thực hiện kiểm tra kết nối dưới nền (không block quá trình khởi động server)
    pool
      .connect()
      .then(async (client) => {
        logger.log('✅ Kết nối PostgreSQL thành công!');
        logger.log(
          `📦 Database: ${configService.get<string>('app.db.name')} | Host: ${configService.get<string>('app.db.host')}:${configService.get<number>('app.db.port')}`,
        );
        try {
          await client.query(
            'ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;',
          );
          logger.log(
            '⚡ Đảm bảo cột sort_order trong bảng categories tồn tại.',
          );
          await client.query(
            'ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(512);',
          );
          logger.log('⚡ Đảm bảo cột image_url trong bảng categories tồn tại.');
        } catch (dbErr) {
          logger.error(
            '❌ Lỗi khi cập nhật bảng categories:',
            (dbErr as Error).message,
          );
        }
        client.release();
      })
      .catch((error) => {
        logger.error(
          '❌ Kết nối PostgreSQL thất bại!',
          (error as Error).message,
        );
        logger.error(
          `📦 Database: ${configService.get<string>('app.db.name')} | Host: ${configService.get<string>('app.db.host')}:${configService.get<number>('app.db.port')}`,
        );
      });

    return pool;
  },
};
