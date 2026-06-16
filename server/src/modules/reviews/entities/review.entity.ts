export interface Review {
  id: number;
  user_id: string | null; // UUID
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: Date;
}

export interface PaginatedReviews {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
