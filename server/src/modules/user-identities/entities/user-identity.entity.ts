export interface UserIdentity {
  id: number;
  user_id: string;
  provider: string;
  provider_id: string;
  provider_email: string | null;
  access_token: string | null;
  created_at: Date;
}

export interface PaginatedUserIdentities {
  data: UserIdentity[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
