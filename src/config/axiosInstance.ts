import axios from "axios"
import { getCookie } from "@/lib/cookies"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use((config) => {
  try {
    const token = getCookie("tsb_customer_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    console.error("Error reading token from cookies", error)
  }
  return config
})

export default axiosInstance
