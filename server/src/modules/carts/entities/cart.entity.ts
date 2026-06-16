export interface CartItem {
  product_id: number;
  quantity: number;
  selected_color?: string;
}

export interface Cart {
  id: string; // UUID
  user_id: string; // UUID
  items: CartItem[];
  created_at: Date;
  updated_at: Date;
}

export interface PaginatedCarts {
  data: Cart[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
