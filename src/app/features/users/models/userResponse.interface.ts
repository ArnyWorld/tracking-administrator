export interface User {
  id: string;
  name: string;
  lastname: string;
  create_at: number;
  email: string;
  phone: number | null;
  username: string;
  password?: string;
  type?: 'personal' | 'enterprise' | string;
  enterprises: Enterprise[];
}

export interface Enterprise {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
}
