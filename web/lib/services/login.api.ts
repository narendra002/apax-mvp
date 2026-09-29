import { baseAPI } from './base.api';

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token: string
  user: unknown
}

export const loginApi = (data: LoginRequest) => (
  baseAPI<LoginResponse>('/login', 'POST', data)
)
