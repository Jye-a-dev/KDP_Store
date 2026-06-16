export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  created_at: Date;
}

export interface PaginatedCategories {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
