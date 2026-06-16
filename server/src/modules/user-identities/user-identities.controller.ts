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
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UserIdentitiesService } from './user-identities.service';
import { CreateUserIdentityDto } from './dto/create-user-identity.dto';
import { UpdateUserIdentityDto } from './dto/update-user-identity.dto';
import { QueryUserIdentityDto } from './dto/query-user-identity.dto';
import {
  UserIdentityResponseDto,
  PaginatedUserIdentitiesResponseDto,
  UserIdentityCountResponseDto,
  DeleteUserIdentityResponseDto,
} from './dto/user-identity-response.dto';

@ApiTags('user-identities')
@Controller('user-identities')
export class UserIdentitiesController {
  constructor(private readonly userIdentitiesService: UserIdentitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới liên kết tài khoản OAuth' })
  @ApiCreatedResponse({
    description: 'Liên kết được tạo thành công.',
    type: UserIdentityResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng gốc.' })
  @ApiConflictResponse({
    description: 'Liên kết OAuth với provider này đã tồn tại.',
  })
  create(@Body() dto: CreateUserIdentityDto) {
    return this.userIdentitiesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách các liên kết OAuth có phân trang và bộ lọc',
  })
  @ApiOkResponse({
    description: 'Trả về danh sách các liên kết OAuth.',
    type: PaginatedUserIdentitiesResponseDto,
  })
  findAll(@Query() query: QueryUserIdentityDto) {
    return this.userIdentitiesService.findAll(query);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Thống kê số lượng liên kết OAuth theo nhà cung cấp',
  })
  @ApiOkResponse({
    description: 'Trả về số liệu thống kê liên kết OAuth.',
    type: UserIdentityCountResponseDto,
  })
  count(@Query() query: QueryUserIdentityDto) {
    return this.userIdentitiesService.count(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một liên kết OAuth' })
  @ApiOkResponse({
    description: 'Trả về chi tiết liên kết OAuth.',
    type: UserIdentityResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy liên kết OAuth.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userIdentitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật access token hoặc email liên kết' })
  @ApiOkResponse({
    description: 'Cập nhật liên kết thành công.',
    type: UserIdentityResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy liên kết OAuth.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserIdentityDto,
  ) {
    return this.userIdentitiesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá liên kết OAuth' })
  @ApiOkResponse({
    description: 'Xoá liên kết thành công.',
    type: DeleteUserIdentityResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy liên kết OAuth.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userIdentitiesService.remove(id);
  }
}
