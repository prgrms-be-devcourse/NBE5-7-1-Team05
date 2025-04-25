import { User } from "./User";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}
