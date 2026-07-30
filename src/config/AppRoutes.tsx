import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { APP_PATHS } from "./paths"
import { CommonLayout } from "@/components/layout/CommonLayout"
import { LoadingFallback } from "@/components/layout/LoadingFallback"

const ScanPage = lazy(() => import("@/pages/ScanPage").then(module => ({ default: module.ScanPage })))
const MenuPage = lazy(() => import("@/pages/MenuPage").then(module => ({ default: module.MenuPage })))
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage").then(module => ({ default: module.CheckoutPage })))
const PaymentPage = lazy(() => import("@/pages/PaymentPage").then(module => ({ default: module.PaymentPage })))
const OrderStatusPage = lazy(() => import("@/pages/OrderStatusPage").then(module => ({ default: module.OrderStatusPage })))
const AuthPage = lazy(() => import("@/pages/AuthPage").then(module => ({ default: module.AuthPage })))
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then(module => ({ default: module.ProfilePage })))

export function AppRoutes() {
  return (
    <CommonLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path={APP_PATHS.HOME} element={<ScanPage />} />
          <Route path={APP_PATHS.MENU_ITEMS} element={<MenuPage />} />
          <Route path={`${APP_PATHS.MENU_ITEMS}/:tableId`} element={<MenuPage />} />
          <Route path={APP_PATHS.CHECKOUT} element={<CheckoutPage />} />
          <Route path={APP_PATHS.PAYMENT} element={<PaymentPage />} />
          <Route path={APP_PATHS.ORDER_STATUS} element={<OrderStatusPage />} />
          <Route path={APP_PATHS.AUTH} element={<AuthPage />} />
          <Route path={APP_PATHS.PROFILE} element={<ProfilePage />} />
          <Route path="*" element={<Navigate to={APP_PATHS.HOME} />} />
        </Routes>
      </Suspense>
    </CommonLayout>
  )
}
