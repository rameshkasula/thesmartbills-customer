import axiosInstance from "@/config/axiosInstance"

export interface OutletDto {
  id: string
  name: string
  taxPercentage: number
}

export const outletApi = {
  getOutlet: (id: string) =>
    axiosInstance.get<OutletDto>(`/outlet/${id}`).then((r) => r.data),
}
