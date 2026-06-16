import { Module } from '@nestjs/common';
import { pgProvider } from './pg.provider';

@Module({
  providers: [pgProvider],
  exports: [pgProvider],
})
export class DatabaseModule {}
