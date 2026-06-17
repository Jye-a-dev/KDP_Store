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
