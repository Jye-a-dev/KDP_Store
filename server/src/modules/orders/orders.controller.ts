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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import {
  OrderResponseDto,
  PaginatedOrdersResponseDto,
  OrderCountResponseDto,
  DeleteOrderResponseDto,
} from './dto/order-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo mới một đơn hàng (tự động tính giá và trừ tồn kho)',
  })
  @ApiCreatedResponse({
    description: 'Đơn hàng được đặt thành công.',
    type: OrderResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy người dùng hoặc sản phẩm mua.',
  })
  @ApiConflictResponse({
    description: 'Sản phẩm đã ngừng kinh doanh hoặc không đủ hàng tồn kho.',
  })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng có phân trang và bộ lọc' })
  @ApiOkResponse({
    description: 'Trả về danh sách đơn hàng.',
    type: PaginatedOrdersResponseDto,
  })
  findAll(@Query() query: QueryOrderDto) {
    return this.ordersService.findAll(query);
  }

  @Get('count')
  @ApiOperation({ summary: 'Thống kê trạng thái đơn hàng và doanh thu' })
  @ApiOkResponse({
    description: 'Trả về số liệu thống kê đơn hàng.',
    type: OrderCountResponseDto,
  })
  count(@Query() query: QueryOrderDto) {
    return this.ordersService.count(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một đơn hàng theo UUID' })
  @ApiOkResponse({
    description: 'Trả về chi tiết đơn hàng.',
    type: OrderResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật trạng thái đơn hàng hoặc thông tin thanh toán',
  })
  @ApiOkResponse({
    description: 'Đơn hàng được cập nhật thành công.',
    type: OrderResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá đơn hàng' })
  @ApiOkResponse({
    description: 'Đơn hàng được xoá thành công.',
    type: DeleteOrderResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.remove(id);
  }
}
