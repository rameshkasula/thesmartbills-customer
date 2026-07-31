import React from "react"
import { useTheme } from "@/components/theme-provider"
import { BrandLogo } from "@/components/BrandLogo"
import {
  IconSun,
  IconMoon,
  IconHome,
  IconShoppingCart,
  IconReceipt,
  IconUser,
} from "@tabler/icons-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAppStore } from "@/lib/store"

interface CommonLayoutProps {
  children: React.ReactNode
}

export function CommonLayout({ children }: CommonLayoutProps) {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { tableId, cart } = useAppStore()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const navItems = [
    {
      label: "Home",
      icon: <IconHome className="size-5" />,
      path: tableId ? `/menuitems/${tableId}` : "/",
      isActive:
        location.pathname === "/" || location.pathname.startsWith("/menuitems"),
    },
    {
      label: "Cart",
      icon: (
        <div className="relative">
          <IconShoppingCart className="size-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {cartCount}
            </span>
          )}
        </div>
      ),
      path: "/checkout",
      isActive:
        location.pathname === "/checkout" || location.pathname === "/payment",
    },
    {
      label: "Orders",
      icon: <IconReceipt className="size-5" />,
      path: "/orders",
      isActive: location.pathname.startsWith("/orders"),
    },
    {
      label: "Profile",
      icon: <IconUser className="size-5" />,
      path: "/profile",
      isActive:
        location.pathname === "/profile" || location.pathname === "/auth",
    },
  ]

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background pb-20 text-foreground transition-all duration-300">
      {/* Ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20 dark:opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "heroPulse 7s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-20 z-0 h-[400px] w-[400px] rounded-full opacity-15 dark:opacity-[0.10]"
        style={{
          background:
            "radial-gradient(circle, var(--color-chart-2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <style>{`
        @keyframes heroPulse {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, 0) scale(1.08); }
        }
      `}</style>

      {/* Common Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md">
        <BrandLogo />
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {theme === "dark" ? (
            <IconSun className="size-4" />
          ) : (
            <IconMoon className="size-4" />
          )}
        </button>
      </header>

      <main className="relative z-10 flex w-full flex-1 flex-col">
        {children}
      </main>

      {/* Bottom Navigation Tabs */}
      <div className="fixed right-0 bottom-0 left-0 z-40 mx-auto flex max-w-md items-center justify-between border-t border-border bg-background/85 px-6 py-2 shadow-lg backdrop-blur-md">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl px-3 py-1 transition-all duration-200 ${
              item.isActive
                ? "scale-105 font-bold text-primary"
                : "text-muted-foreground hover:scale-102 hover:text-foreground"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold tracking-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
