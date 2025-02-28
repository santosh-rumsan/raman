export type Pagination = {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, unknown> | undefined;
};
