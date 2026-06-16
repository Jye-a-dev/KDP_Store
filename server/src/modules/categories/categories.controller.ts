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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import {
  CategoryResponseDto,
  PaginatedCategoriesResponseDto,
  CategoryCountResponseDto,
  DeleteCategoryResponseDto,
} from './dto/category-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới một danh mục sản phẩm' })
  @ApiCreatedResponse({
    description: 'Danh mục được tạo thành công.',
    type: CategoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy danh mục cha (parent_id).',
  })
  @ApiConflictResponse({ description: 'Đường dẫn slug đã tồn tại.' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách danh mục có phân trang và bộ lọc' })
  @ApiOkResponse({
    description: 'Trả về danh sách danh mục.',
    type: PaginatedCategoriesResponseDto,
  })
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get('count')
  @ApiOperation({ summary: 'Thống kê số lượng danh mục gốc và danh mục con' })
  @ApiOkResponse({
    description: 'Trả về số liệu thống kê danh mục.',
    type: CategoryCountResponseDto,
  })
  count(@Query() query: QueryCategoryDto) {
    return this.categoriesService.count(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một danh mục' })
  @ApiOkResponse({
    description: 'Trả về chi tiết danh mục.',
    type: CategoryResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy danh mục.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục sản phẩm' })
  @ApiOkResponse({
    description: 'Cập nhật danh mục thành công.',
    type: CategoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy danh mục hoặc danh mục cha mới.',
  })
  @ApiConflictResponse({
    description: 'Lỗi trùng vòng lặp cha-con hoặc trùng slug mới.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá danh mục sản phẩm' })
  @ApiOkResponse({
    description: 'Xoá danh mục thành công.',
    type: DeleteCategoryResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy danh mục.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
