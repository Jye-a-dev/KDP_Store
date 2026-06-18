export interface Order {
  id: string;
  user_id: string | null;
  total_amount: number;
  shipping_fee: number;
  final_amount: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  items: OrderItem[];
  payment_info: PaymentInfo;
  order_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  color?: string;
}

export interface PaymentInfo {
  method: string;
  status: string;
  transaction_id?: string | null;
  paid_at?: string | null;
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  delivered: number;
  cancelled: number;
  total_revenue: number;
}

export interface UserStats {
  total: number;
  customers: number;
  admins: number;
  active: number;
  inactive: number;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  description: string;
  stock: number;
  images_2d: string[] | string;
  model_3d_url: string | null;
  is_published: boolean;
}

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  created_at?: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ProductStats {
  total: number;
  published: number;
  hidden: number;
  out_of_stock: number;
}

export interface UserAddress {
  name: string;
  phone: string;
  address: string;
  is_default?: boolean;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: "customer" | "admin";
  is_active: boolean;
  addresses: UserAddress[];
  created_at: string;
  updated_at: string;
}

