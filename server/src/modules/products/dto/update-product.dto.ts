import { ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialsConfigDto, CameraConfigDto } from './create-product.dto';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'ID danh mục mới của sản phẩm',
    example: 2,
    nullable: true,
  })
  category_id?: number;

  @ApiPropertyOptional({
    description: 'Tên sản phẩm mới',
    example: 'Ghế Sofa Cổ Điển Nhập Khẩu',
    minLength: 2,
    maxLength: 255,
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn tĩnh mới. Phải là duy nhất.',
    example: 'ghe-sofa-co-dien-nhap-khau',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Mã SKU mới',
    example: 'SOFA-CL-01-NEW',
  })
  sku?: string;

  @ApiPropertyOptional({
    description: 'Giá bán gốc mới',
    example: 6000000,
    minimum: 0,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'Giá khuyến mãi mới',
    example: 5200000,
    nullable: true,
  })
  discount_price?: number;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết sản phẩm mới',
    example: 'Ghế sofa cổ điển với chất liệu da cao cấp nhập khẩu từ Ý.',
    nullable: true,
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Số lượng tồn kho mới',
    example: 20,
    minimum: 0,
  })
  stock?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái hiển thị sản phẩm',
    example: true,
  })
  is_published?: boolean;

  @ApiPropertyOptional({
    description: 'Mảng link ảnh 2D mới',
    example: ['https://storage.kdpstore.vn/products/sofa-new-1.jpg'],
    type: [String],
  })
  images_2d?: string[];

  @ApiPropertyOptional({
    description: 'Đường dẫn URL của model 3D mới',
    example: 'https://storage.kdpstore.vn/models/sofa-new.glb',
    nullable: true,
  })
  model_3d_url?: string;

  @ApiPropertyOptional({
    description: 'Nhãn/Huy hiệu sản phẩm mới',
    example: 'Sale Off',
    nullable: true,
  })
  badge?: string;

  @ApiPropertyOptional({ description: 'Tỉ lệ phóng to trục X', example: 1.1 })
  scale_x?: number;

  @ApiPropertyOptional({ description: 'Tỉ lệ phóng to trục Y', example: 1.1 })
  scale_y?: number;

  @ApiPropertyOptional({ description: 'Tỉ lệ phóng to trục Z', example: 1.1 })
  scale_z?: number;

  @ApiPropertyOptional({ description: 'Góc xoay trục X', example: 0.1 })
  rotation_x?: number;

  @ApiPropertyOptional({ description: 'Góc xoay trục Y', example: 0.2 })
  rotation_y?: number;

  @ApiPropertyOptional({ description: 'Góc xoay trục Z', example: 0.0 })
  rotation_z?: number;

  @ApiPropertyOptional({
    description: 'Cấu hình vật liệu 3D mới',
    type: MaterialsConfigDto,
  })
  materials_config?: MaterialsConfigDto;

  @ApiPropertyOptional({
    description: 'Cấu hình camera 3D mới',
    type: CameraConfigDto,
  })
  camera_config?: CameraConfigDto;

  @ApiPropertyOptional({
    description: 'Giá gốc mới trước khi dùng làm đồ secondhand',
    example: 8500000,
    nullable: true,
  })
  original_price?: number;

  @ApiPropertyOptional({
    description: 'Tình trạng độ mới mới của sản phẩm secondhand',
    example: 'Mới 98%',
  })
  condition?: string;

  @ApiPropertyOptional({
    description: 'Ngày nhập hàng mới về kho',
    example: '2026-06-20T00:00:00.000Z',
  })
  import_date?: Date;

  @ApiPropertyOptional({
    description: 'Ngày bắt đầu khuyến mãi',
    example: '2026-06-20T00:00:00.000Z',
    nullable: true,
  })
  sale_start_date?: Date;

  @ApiPropertyOptional({
    description: 'Ngày kết thúc khuyến mãi',
    example: '2026-06-25T00:00:00.000Z',
    nullable: true,
  })
  sale_end_date?: Date;
}
