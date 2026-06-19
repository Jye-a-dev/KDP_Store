import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PageContentsService } from './page-contents.service';
import { CreatePageContentDto } from './dto/create-page-content.dto';
import { UpdatePageContentDto } from './dto/update-page-content.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('page-contents')
@Controller('page-contents')
export class PageContentsController {
  constructor(private readonly pageContentsService: PageContentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy toàn bộ nội dung hiển thị dưới dạng Key-Value',
  })
  @ApiOkResponse({ description: 'Trả về object chứa key và value.' })
  findAll() {
    return this.pageContentsService.findAll();
  }

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Lấy danh sách các key nội dung hiển thị kèm ngày cập nhật (chỉ Admin)',
  })
  findAllList() {
    return this.pageContentsService.findAllList();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo hoặc ghi đè nội dung key mới (chỉ Admin)',
  })
  create(@Body() dto: CreatePageContentDto) {
    return this.pageContentsService.create(dto);
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật giá trị cho một key nội dung (chỉ Admin)',
  })
  update(@Param('key') key: string, @Body() dto: UpdatePageContentDto) {
    return this.pageContentsService.update(key, dto.value);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa một key nội dung khỏi hệ thống (chỉ Admin)',
  })
  remove(@Param('key') key: string) {
    return this.pageContentsService.remove(key);
  }
}
