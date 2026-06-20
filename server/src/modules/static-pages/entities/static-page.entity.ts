export interface StaticPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  group_type: 'service' | 'explore'; // 'service' for Dịch vụ, 'explore' for Khám phá
  created_at: Date;
  updated_at: Date;
}
