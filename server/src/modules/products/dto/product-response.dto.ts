import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialsConfigDto, CameraConfigDto } from './create-product.dto';

export class ProductResponseDto {
  @ApiProperty({ description: 'ID sản phẩm (Auto increment)', example: 1 })
  id: number;

  @ApiPropertyOptional({
    description: 'ID danh mục của sản phẩm. Trả về null nếu danh mục bị xoá.',
    example: 1,
    nullable: true,
  })
  category_id: number | null;

  @ApiProperty({ description: 'Tên sản phẩm', example: 'Ghế Sofa Cổ Điển' })
  name: string;

  @ApiProperty({
    description: 'Đường dẫn tĩnh duy nhất của sản phẩm',
    example: 'ghe-sofa-co-dien',
  })
  slug: string;

  @ApiProperty({
    description: 'Mã định danh sản phẩm duy nhất (SKU)',
    example: 'SOFA-CL-01',
  })
  sku: string;

  @ApiProperty({ description: 'Giá bán gốc', example: 5500000 })
  price: number;

  @ApiPropertyOptional({
    description: 'Giá khuyến mãi. Trả về null nếu không giảm giá.',
    example: 4900000,
    nullable: true,
  })
  discount_price: number | null;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết',
    example: 'Ghế sofa cổ điển...',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ description: 'Số lượng hàng tồn kho', example: 15 })
  stock: number;

  @ApiProperty({ description: 'Trạng thái hiển thị sản phẩm', example: true })
  is_published: boolean;

  @ApiProperty({
    description: 'Mảng link ảnh 2D',
    example: ['https://storage.kdpstore.vn/products/sofa-1.jpg'],
    type: [String],
  })
  images_2d: string[];

  @ApiPropertyOptional({
    description: 'Đường dẫn model 3D',
    example: 'https://storage.kdpstore.vn/models/sofa.glb',
    nullable: true,
  })
  model_3d_url: string | null;

  @ApiProperty({ description: 'Tỉ lệ phóng to/thu nhỏ trục X', example: 1.0 })
  scale_x: number;

  @ApiProperty({ description: 'Tỉ lệ phóng to/thu nhỏ trục Y', example: 1.0 })
  scale_y: number;

  @ApiProperty({ description: 'Tỉ lệ phóng to/thu nhỏ trục Z', example: 1.0 })
  scale_z: number;

  @ApiProperty({ description: 'Góc xoay trục X', example: 0.0 })
  rotation_x: number;

  @ApiProperty({ description: 'Góc xoay trục Y', example: 0.0 })
  rotation_y: number;

  @ApiProperty({ description: 'Góc xoay trục Z', example: 0.0 })
  rotation_z: number;

  @ApiProperty({
    description: 'Cấu hình vật liệu 3D',
    type: MaterialsConfigDto,
  })
  materials_config: MaterialsConfigDto;

  @ApiProperty({
    description: 'Cấu hình camera hiển thị 3D',
    type: CameraConfigDto,
  })
  camera_config: CameraConfigDto;

  @ApiPropertyOptional({
    description: 'Ngày bắt đầu khuyến mãi (ISO 8601)',
    example: '2026-06-20T00:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  sale_start_date: Date | null;

  @ApiPropertyOptional({
    description: 'Ngày kết thúc khuyến mãi (ISO 8601)',
    example: '2026-06-25T00:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  sale_end_date: Date | null;

  @ApiProperty({
    description: 'Thời điểm tạo sản phẩm (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Thời điểm cập nhật sản phẩm cuối cùng (ISO 8601)',
    example: '2024-01-15T08:30:00.000Z',
    format: 'date-time',
  })
  updated_at: Date;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({
    description: 'Danh sách sản phẩm',
    type: [ProductResponseDto],
  })
  data: ProductResponseDto[];

  @ApiProperty({ description: 'Tổng số sản phẩm khớp với filter', example: 50 })
  total: number;

  @ApiProperty({ description: 'Trang hiện tại', example: 1 })
  page: number;

  @ApiProperty({ description: 'Số bản ghi mỗi trang', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Tổng số trang', example: 5 })
  total_pages: number;
}

export class ProductCountResponseDto {
  @ApiProperty({ description: 'Tổng số sản phẩm trong hệ thống', example: 100 })
  total: number;

  @ApiProperty({
    description: 'Số sản phẩm đang hiển thị (is_published = true)',
    example: 85,
  })
  published: number;

  @ApiProperty({
    description: 'Số sản phẩm bị ẩn (is_published = false)',
    example: 15,
  })
  hidden: number;

  @ApiProperty({
    description: 'Số sản phẩm đã hết hàng (stock = 0)',
    example: 5,
  })
  out_of_stock: number;
}

export class DeleteProductResponseDto {
  @ApiProperty({
    description: 'Thông báo xác nhận xoá thành công',
    example: 'Đã xóa sản phẩm "1" thành công',
  })
  message: string;
}
