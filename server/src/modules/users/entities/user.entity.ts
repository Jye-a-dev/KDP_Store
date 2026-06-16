export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'customer' | 'admin';
  is_active: boolean;
  addresses: Address[];
  created_at: Date;
  updated_at: Date;
}

export interface Address {
  name: string;
  phone: string;
  address: string;
  is_default?: boolean;
}

export interface PaginatedUsers {
  data: Omit<User, 'password_hash'>[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
