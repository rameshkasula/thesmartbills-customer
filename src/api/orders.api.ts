import axiosInstance from "@/config/axiosInstance"
import { type Order } from "@/lib/store"

export interface CreateOrderDto {
  tableId: string
  items: {
    menuItemId: string
    quantity: number
  }[]
  totalAmount: number
}

export const ordersApi = {
  create: (data: CreateOrderDto) =>
    axiosInstance.post<Order>("/order", data).then((r) => r.data),
  get: (id: string) =>
    axiosInstance.get<Order>(`/order/${id}`).then((r) => r.data),
  listByTable: (tableId: string) =>
    axiosInstance.get<Order[]>(`/order/table/${tableId}`).then((r) => r.data),
}
