import axiosInstance from "@/config/axiosInstance"
import { type User } from "@/lib/store"

export interface LoginDto {
  name: string
  phone: string
  tableId?: string
}

export interface RegisterDto {
  name: string
  email: string
  phone?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  customer: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

export const authApi = {
  loginGuest: (data: LoginDto) =>
    axiosInstance.post<User>("/auth/guest-login", data).then((r) => r.data),
  register: (data: RegisterDto) =>
    axiosInstance.post<void>("/customer/auth/register", data).then((r) => r.data),
  sendOtp: (email: string) =>
    axiosInstance.post<void>("/customer/auth/send-otp", { email }).then((r) => r.data),
  verifyOtp: (email: string, code: string) =>
    axiosInstance.post<AuthResponse>("/customer/auth/verify-otp", { email, code }).then((r) => r.data),
  logout: () =>
    axiosInstance.post("/auth/logout").then((r) => r.data),
}

