export interface MaterialsConfig {
  colors: string[];
  textures: string[];
}

export interface CameraConfig {
  alpha: number;
  beta: number;
  radius: number;
}

export interface Product {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discount_price: number | null;
  description: string | null;
  stock: number;
  is_published: boolean;
  images_2d: string[];
  model_3d_url: string | null;
  badge: string | null;
  scale_x: number;
  scale_y: number;
  scale_z: number;
  rotation_x: number;
  rotation_y: number;
  rotation_z: number;
  materials_config: MaterialsConfig;
  camera_config: CameraConfig;
  created_at: Date;
  updated_at: Date;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
