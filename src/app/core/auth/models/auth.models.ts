export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  name?: string;
  email?: string;
  roles?: string[];
}

export interface LoginResponse {
  token: string;
  user?: AuthUser;
}

export interface StoredSession {
  token: string;
  user?: AuthUser;
}
