import axiosInstance from "@/config/axiosInstance"
import { type MenuItem } from "@/lib/store"

export type MenuItemStatus = "available" | "unavailable"

export interface CreateMenuItemDto {
  name: string
  price: number
  description: string
  category: string
  image: string
  isPopular?: boolean
  isVeg?: boolean
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {}

export const menuItemApi = {
  list: (outletId?: string, includeDeleted = false) => {
    const params = new URLSearchParams()
    if (outletId) params.append("outletId", outletId)
    if (includeDeleted) params.append("includeDeleted", "true")
    const query = params.toString() ? `?${params.toString()}` : ""
    return axiosInstance
      .get<MenuItem[]>(`/menu-item${query}`)
      .then((r) => r.data)
  },
  create: (data: CreateMenuItemDto) =>
    axiosInstance.post<MenuItem>("/menu-item", data).then((r) => r.data),
  update: (id: string, data: UpdateMenuItemDto) =>
    axiosInstance.patch<MenuItem>(`/menu-item/${id}`, data).then((r) => r.data),
  updateStatus: (id: string, status: MenuItemStatus) =>
    axiosInstance
      .patch<MenuItem>(`/menu-item/${id}/status`, { status })
      .then((r) => r.data),
  delete: (id: string) =>
    axiosInstance.delete(`/menu-item/${id}`).then((r) => r.data),
  restore: (id: string) =>
    axiosInstance
      .post<MenuItem>(`/menu-item/${id}/restore`)
      .then((r) => r.data),
}
