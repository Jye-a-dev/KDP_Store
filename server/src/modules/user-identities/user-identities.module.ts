import { Module } from '@nestjs/common';
import { UserIdentitiesController } from './user-identities.controller';
import { UserIdentitiesService } from './user-identities.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserIdentitiesController],
  providers: [UserIdentitiesService],
  exports: [UserIdentitiesService],
})
export class UserIdentitiesModule {}
