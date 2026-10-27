export interface ApiResponse {
  content: any[];
  data?: any[];
  pagination?: {
    pages: number;
    rowsNumber: number;
  };
}
