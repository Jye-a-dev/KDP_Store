import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserIdentitiesService } from './user-identities.service';
import { CreateUserIdentityDto } from './dto/create-user-identity.dto';
import { UpdateUserIdentityDto } from './dto/update-user-identity.dto';
import { QueryUserIdentityDto } from './dto/query-user-identity.dto';

@Controller('user-identities')
export class UserIdentitiesController {
  constructor(private readonly userIdentitiesService: UserIdentitiesService) {}

  @Post()
  create(@Body() dto: CreateUserIdentityDto) {
    return this.userIdentitiesService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryUserIdentityDto) {
    return this.userIdentitiesService.findAll(query);
  }

  @Get('count')
  count(@Query() query: QueryUserIdentityDto) {
    return this.userIdentitiesService.count(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userIdentitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserIdentityDto,
  ) {
    return this.userIdentitiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userIdentitiesService.remove(id);
  }
}
