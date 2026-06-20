import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MaterialsConfigDto {
  @ApiProperty({
    description: 'Danh sách mã màu hex của sản phẩm',
    example: ['#FF0000', '#00FF00', '#0000FF'],
    type: [String],
  })
  colors!: string[];

  @ApiProperty({
    description: 'Danh sách link texture của vật liệu',
    example: ['https://storage.kdpstore.vn/textures/wood_pattern.jpg'],
    type: [String],
  })
  textures!: string[];
}

export class CameraConfigDto {
  @ApiProperty({ description: 'Góc alpha của camera', example: 0 })
  alpha?: number;

  @ApiProperty({ description: 'Góc beta của camera', example: 1 })
  beta?: number;

  @ApiProperty({ description: 'Khoảng cách bán kính của camera', example: 5 })
  radius?: number;
}

export class CreateProductDto {
  @ApiPropertyOptional({
    description: 'ID danh mục của sản phẩm',
    example: 1,
    nullable: true,
  })
  category_id?: number;

  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'Ghế Sofa Cổ Điển',
    minLength: 2,
    maxLength: 255,
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn tĩnh duy nhất. Tự động sinh từ tên nếu trống.',
    example: 'ghe-sofa-co-dien',
  })
  slug?: string;

  @ApiProperty({
    description: 'Mã định danh sản phẩm duy nhất (SKU)',
    example: 'SOFA-CL-01',
  })
  sku!: string;

  @ApiProperty({
    description: 'Giá bán gốc',
    example: 5500000,
    minimum: 0,
  })
  price!: number;

  @ApiPropertyOptional({
    description: 'Giá khuyến mãi (nếu có)',
    example: 4900000,
    nullable: true,
  })
  discount_price?: number;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết sản phẩm',
    example:
      'Ghế sofa cổ điển với chất liệu da cao cấp, phù hợp cho phòng khách sang trọng.',
    nullable: true,
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Số lượng tồn kho',
    example: 15,
    minimum: 0,
    default: 0,
  })
  stock?: number;

  @ApiPropertyOptional({
    description: 'Có hiển thị sản phẩm ra cửa hàng không',
    example: true,
    default: true,
  })
  is_published?: boolean;

  @ApiPropertyOptional({
    description: 'Mảng link ảnh 2D của sản phẩm',
    example: [
      'https://storage.kdpstore.vn/products/sofa-1.jpg',
      'https://storage.kdpstore.vn/products/sofa-2.jpg',
    ],
    type: [String],
    default: [],
  })
  images_2d?: string[];

  @ApiPropertyOptional({
    description: 'Đường dẫn URL của model 3D (file .glb/.gltf)',
    example: 'https://storage.kdpstore.vn/models/sofa.glb',
    nullable: true,
  })
  model_3d_url?: string;

  @ApiPropertyOptional({
    description: 'Nhãn/Huy hiệu sản phẩm (VD: Sale Off, New In, Limited)',
    example: 'New In',
    nullable: true,
  })
  badge?: string;

  @ApiPropertyOptional({
    description: 'Tỉ lệ phóng to/thu nhỏ trục X',
    example: 1.0,
    default: 1.0,
  })
  scale_x?: number;

  @ApiPropertyOptional({
    description: 'Tỉ lệ phóng to/thu nhỏ trục Y',
    example: 1.0,
    default: 1.0,
  })
  scale_y?: number;

  @ApiPropertyOptional({
    description: 'Tỉ lệ phóng to/thu nhỏ trục Z',
    example: 1.0,
    default: 1.0,
  })
  scale_z?: number;

  @ApiPropertyOptional({
    description: 'Góc xoay trục X',
    example: 0.0,
    default: 0.0,
  })
  rotation_x?: number;

  @ApiPropertyOptional({
    description: 'Góc xoay trục Y',
    example: 0.0,
    default: 0.0,
  })
  rotation_y?: number;

  @ApiPropertyOptional({
    description: 'Góc xoay trục Z',
    example: 0.0,
    default: 0.0,
  })
  rotation_z?: number;

  @ApiPropertyOptional({
    description: 'Cấu hình vật liệu 3D',
    type: MaterialsConfigDto,
    default: { colors: [], textures: [] },
  })
  materials_config?: MaterialsConfigDto;

  @ApiPropertyOptional({
    description: 'Cấu hình camera hiển thị 3D',
    type: CameraConfigDto,
    default: { alpha: 0, beta: 1, radius: 5 },
  })
  camera_config?: CameraConfigDto;
}
