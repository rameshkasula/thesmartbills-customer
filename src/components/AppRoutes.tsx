import { Routes, Route, Navigate } from "react-router-dom"
import { ScanPage } from "./ScanPage"
import { MenuPage } from "./MenuPage"
import { CheckoutPage } from "./CheckoutPage"
import { PaymentPage } from "./PaymentPage"
import { OrderStatusPage } from "./OrderStatusPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ScanPage />} />
      <Route path="/menu/:tableId" element={<MenuPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/order/:orderId" element={<OrderStatusPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
