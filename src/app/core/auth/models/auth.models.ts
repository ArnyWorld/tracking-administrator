export interface AuthUser {
  exp: number;
  lat: number;
  user: User;
}

export interface User {
  name: string | null;
  lastname: string | null;
  email: string;
  create_at: number;
  phone: string | null;
  username: string;
  type: string;
}
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  expires: number;
}

export interface AuthSession {
  token: string;
  expires: number;
  user: AuthUser;
}
