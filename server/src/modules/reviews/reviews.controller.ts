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
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import {
  ReviewResponseDto,
  PaginatedReviewsResponseDto,
  ReviewCountResponseDto,
  DeleteReviewResponseDto,
} from './dto/review-response.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới một đánh giá sản phẩm' })
  @ApiCreatedResponse({
    description: 'Đánh giá được tạo thành công.',
    type: ReviewResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy người dùng hoặc sản phẩm.',
  })
  @ApiBadRequestResponse({
    description: 'Số sao đánh giá không hợp lệ (phải từ 1-5).',
  })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đánh giá có phân trang và bộ lọc' })
  @ApiOkResponse({
    description: 'Trả về danh sách đánh giá.',
    type: PaginatedReviewsResponseDto,
  })
  findAll(@Query() query: QueryReviewDto) {
    return this.reviewsService.findAll(query);
  }

  @Get('count')
  @ApiOperation({ summary: 'Thống kê đánh giá (số sao và điểm trung bình)' })
  @ApiOkResponse({
    description: 'Trả về số liệu thống kê đánh giá.',
    type: ReviewCountResponseDto,
  })
  count(@Query() query: QueryReviewDto) {
    return this.reviewsService.count(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một đánh giá' })
  @ApiOkResponse({
    description: 'Trả về chi tiết đánh giá.',
    type: ReviewResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đánh giá.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật đánh giá' })
  @ApiOkResponse({
    description: 'Đánh giá được cập nhật thành công.',
    type: ReviewResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đánh giá.' })
  @ApiBadRequestResponse({
    description: 'Số sao cập nhật không hợp lệ (phải từ 1-5).',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá đánh giá' })
  @ApiOkResponse({
    description: 'Đánh giá được xoá thành công.',
    type: DeleteReviewResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đánh giá.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}
