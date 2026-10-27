export interface CompanyDatabase {
  id: string;
  codename: string;
  description: string;
  fullname: string;
  server_id: string;
  enabled: 0 | 1;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
  user_id: string;
  user_database_id: string;
  monitor_server_id: string;
  create_at: number;
  update_at: number | null;
  deleted: 0 | 1;
  enabled: 0 | 1;
  databases: CompanyDatabase[];
}

export interface CompaniesResponse {
  success: boolean;
  content: Company[];
}
