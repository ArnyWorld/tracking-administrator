export interface Pagination {
  pages: number;
  rowsNumber: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pagination: Pagination;
}
