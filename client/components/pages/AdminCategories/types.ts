export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  created_at: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}
