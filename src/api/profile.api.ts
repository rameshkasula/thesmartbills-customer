import axiosInstance from "@/config/axiosInstance"
import { type User } from "@/lib/store"

export interface UpdateProfileDto {
  name?: string
  phone?: string
}

export const profileApi = {
  getProfile: () =>
    axiosInstance.get<User>("/customer/profile").then((r) => r.data),
  updateProfile: (data: UpdateProfileDto) =>
    axiosInstance.patch<User>("/customer/profile", data).then((r) => r.data),
  deleteAccount: () =>
    axiosInstance.delete("/customer").then((r) => r.data),
}
