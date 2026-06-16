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

export interface Order {
  id: string; // UUID
  user_id: string | null; // UUID
  total_amount: number;
  shipping_fee: number;
  final_amount: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  items: OrderItem[];
  payment_info: PaymentInfo;
  order_status: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
