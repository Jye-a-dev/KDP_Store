import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { StaticPagesController } from './static-pages.controller';
import { StaticPagesService } from './static-pages.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [StaticPagesController],
  providers: [StaticPagesService],
  exports: [StaticPagesService],
})
export class StaticPagesModule {}
