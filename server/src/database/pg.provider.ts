import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const PG_CONNECTION = 'PG_CONNECTION';

export const pgProvider = {
  provide: PG_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<Pool> => {
    const logger = new Logger('DatabaseModule');

    const pool = new Pool({
      host: configService.get<string>('app.db.host'),
      port: configService.get<number>('app.db.port'),
      user: configService.get<string>('app.db.username'),
      password: configService.get<string>('app.db.password'),
      database: configService.get<string>('app.db.name'),
    });

    try {
      const client = await pool.connect();
      logger.log('✅ Kết nối PostgreSQL thành công!');
      logger.log(
        `📦 Database: ${configService.get<string>('app.db.name')} | Host: ${configService.get<string>('app.db.host')}:${configService.get<number>('app.db.port')}`,
      );
      client.release();
    } catch (error) {
      logger.error('❌ Kết nối PostgreSQL thất bại!', (error as Error).message);
      logger.error(
        `📦 Database: ${configService.get<string>('app.db.name')} | Host: ${configService.get<string>('app.db.host')}:${configService.get<number>('app.db.port')}`,
      );
    }

    return pool;
  },
};
