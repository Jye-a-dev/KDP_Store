import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { QueryCartDto } from './dto/query-cart.dto';
import {
  CartResponseDto,
  PaginatedCartsResponseDto,
  CartCountResponseDto,
  DeleteCartResponseDto,
} from './dto/cart-response.dto';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @ApiOperation({ summary: 'Khởi tạo giỏ hàng mới cho người dùng' })
  @ApiCreatedResponse({
    description: 'Giỏ hàng được tạo thành công.',
    type: CartResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy người dùng hoặc sản phẩm trong giỏ.',
  })
  @ApiConflictResponse({
    description: 'Người dùng này đã có giỏ hàng (mỗi user chỉ tối đa 1 giỏ).',
  })
  create(@Body() dto: CreateCartDto) {
    return this.cartsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách giỏ hàng trong hệ thống (chỉ dành cho admin)',
  })
  @ApiOkResponse({
    description: 'Trả về danh sách giỏ hàng.',
    type: PaginatedCartsResponseDto,
  })
  findAll(@Query() query: QueryCartDto) {
    return this.cartsService.findAll(query);
  }

  @Get('count')
  @ApiOperation({ summary: 'Thống kê giỏ hàng trống và giỏ hàng có chứa đồ' })
  @ApiOkResponse({
    description: 'Trả về số liệu thống kê giỏ hàng.',
    type: CartCountResponseDto,
  })
  count(@Query() query: QueryCartDto) {
    return this.cartsService.count(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy chi tiết giỏ hàng theo UUID người dùng' })
  @ApiOkResponse({
    description: 'Trả về giỏ hàng của người dùng.',
    type: CartResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy giỏ hàng của người dùng này.',
  })
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.cartsService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết giỏ hàng theo UUID giỏ hàng' })
  @ApiOkResponse({
    description: 'Trả về chi tiết giỏ hàng.',
    type: CartResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy giỏ hàng.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cartsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật danh sách sản phẩm trong giỏ (ghi đè mảng cũ)',
  })
  @ApiOkResponse({
    description: 'Giỏ hàng được cập nhật thành công.',
    type: CartResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy giỏ hàng hoặc sản phẩm thêm vào.',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCartDto) {
    return this.cartsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá giỏ hàng' })
  @ApiOkResponse({
    description: 'Giỏ hàng đã được xoá thành công.',
    type: DeleteCartResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy giỏ hàng.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cartsService.remove(id);
  }
}
