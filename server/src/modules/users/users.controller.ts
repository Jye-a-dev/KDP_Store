import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import {
  UserResponseDto,
  PaginatedUsersResponseDto,
  UserCountResponseDto,
  DeleteUserResponseDto,
} from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @Post()
  @ApiOperation({ summary: 'Tạo mới một người dùng' })
  @ApiCreatedResponse({
    description: 'Người dùng được tạo thành công.',
    type: UserResponseDto,
  })
  @ApiConflictResponse({ description: 'Email đã tồn tại trong hệ thống.' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // GET /users?page=1&limit=10&search=...&role=customer&is_active=true&sort_by=created_at&sort_order=DESC
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng có phân trang và bộ lọc' })
  @ApiOkResponse({
    description: 'Trả về danh sách người dùng khớp với filter.',
    type: PaginatedUsersResponseDto,
  })
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  // GET /users/count
  @Get('count')
  @ApiOperation({
    summary: 'Thống kê số lượng người dùng theo vai trò và trạng thái',
  })
  @ApiOkResponse({
    description: 'Trả về số liệu thống kê người dùng.',
    type: UserCountResponseDto,
  })
  count(@Query() query: QueryUserDto) {
    return this.usersService.count(query);
  }

  // GET /users/:id
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một người dùng theo UUID' })
  @ApiOkResponse({
    description: 'Trả về chi tiết người dùng.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // PATCH /users/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin một người dùng' })
  @ApiOkResponse({
    description: 'Người dùng đã được cập nhật thành công.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng.' })
  @ApiConflictResponse({
    description: 'Email mới đã được sử dụng bởi người dùng khác.',
  })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // DELETE /users/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Xoá một người dùng' })
  @ApiOkResponse({
    description: 'Người dùng đã được xoá thành công.',
    type: DeleteUserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
