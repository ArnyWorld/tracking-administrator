export interface UserByEnterpriseRequest {
  name: string;
  password: string;
  firstname: string;
  lastname: string;
  create_at?: Date;
  update_at?: Date;
  email: string;
  phone: number;
  state_id: string | number;
  user_type_id: string | number;
}
