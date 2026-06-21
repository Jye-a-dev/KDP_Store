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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  ProductResponseDto,
  PaginatedProductsResponseDto,
  ProductCountResponseDto,
  DeleteProductResponseDto,
} from './dto/product-response.dto';

interface UploadedFileDto {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upload-3d')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload file 3D (.gltf, .glb, .obj, .fbx)' })
  async upload3D(@UploadedFile() file: any) {
    if (!file) {
      throw new Error('File upload thất bại.');
    }
    const uploadedFile = file as UploadedFileDto;
    if (!uploadedFile.buffer) {
      throw new Error('File buffer trống.');
    }

    const allowedExtensions = ['.gltf', '.glb', '.obj', '.fbx'];
    const ext = path.extname(uploadedFile.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(
        'Chỉ chấp nhận file 3D định dạng .gltf, .glb, .obj, .fbx',
      );
    }

    const supabaseUrl =
      process.env.SUPABASE_URL || 'https://jvjzdxblwznjlhoxsjux.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseKey || supabaseKey.startsWith('YOUR_')) {
      throw new Error(
        'Supabase Key chưa được cấu hình. Vui lòng cấu hình SUPABASE_KEY trong file .env',
      );
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `model-${uniqueSuffix}${ext}`;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.storage
      .from('3d model')
      .upload(filename, uploadedFile.buffer, {
        contentType: uploadedFile.mimetype || 'application/octet-stream',
        upsert: true,
      });

    if (error) {
      throw new Error(`Upload lên Supabase thất bại: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('3d model').getPublicUrl(filename);

    return {
      message: 'Upload file 3D lên Supabase thành công!',
      url: publicUrl,
    };
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed sản phẩm và danh mục từ Fake Store API' })
  @ApiCreatedResponse({
    description: 'Seed dữ liệu thành công.',
  })
  seed() {
    return this.productsService.seed();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới một sản phẩm 3D' })
  @ApiCreatedResponse({
    description: 'Sản phẩm được tạo thành công.',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy danh mục (category_id).',
  })
  @ApiConflictResponse({
    description: 'Mã SKU hoặc đường dẫn slug đã tồn tại.',
  })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm có phân trang và bộ lọc' })
  @ApiOkResponse({
    description: 'Trả về danh sách sản phẩm.',
    type: PaginatedProductsResponseDto,
  })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Thống kê sản phẩm theo trạng thái hiển thị và tồn kho',
  })
  @ApiOkResponse({
    description: 'Trả về số liệu thống kê sản phẩm.',
    type: ProductCountResponseDto,
  })
  count(@Query() query: QueryProductDto) {
    return this.productsService.count(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một sản phẩm' })
  @ApiOkResponse({
    description: 'Trả về chi tiết sản phẩm.',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy sản phẩm.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một sản phẩm theo slug' })
  @ApiOkResponse({
    description: 'Trả về chi tiết sản phẩm.',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy sản phẩm.' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm 3D' })
  @ApiOkResponse({
    description: 'Cập nhật sản phẩm thành công.',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy sản phẩm hoặc danh mục mới.',
  })
  @ApiConflictResponse({
    description: 'Trùng mã SKU hoặc slug với sản phẩm khác.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá sản phẩm' })
  @ApiOkResponse({
    description: 'Xoá sản phẩm thành công.',
    type: DeleteProductResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy sản phẩm.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
