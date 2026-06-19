import { Module } from '@nestjs/common';
import { PageContentsController } from './page-contents.controller';
import { PageContentsService } from './page-contents.service';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PageContentsController],
  providers: [PageContentsService],
  exports: [PageContentsService],
})
export class PageContentsModule {}
