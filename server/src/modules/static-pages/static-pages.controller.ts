import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StaticPagesService } from './static-pages.service';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('static-pages')
@Controller('static-pages')
export class StaticPagesController {
  constructor(private readonly staticPagesService: StaticPagesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả các trang tĩnh (Công khai)' })
  findAll() {
    return this.staticPagesService.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Lấy chi tiết trang tĩnh qua đường dẫn slug (Công khai)',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.staticPagesService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết trang tĩnh qua ID (Chỉ Admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.staticPagesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới trang tĩnh (Chỉ Admin)' })
  create(@Body() dto: CreateStaticPageDto) {
    return this.staticPagesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật nội dung trang tĩnh qua ID (Chỉ Admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStaticPageDto,
  ) {
    return this.staticPagesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa trang tĩnh khỏi hệ thống (Chỉ Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.staticPagesService.remove(id);
  }
}
