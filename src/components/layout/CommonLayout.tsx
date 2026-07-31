import React from "react"
import { useTheme } from "@/components/theme-provider"
import { BrandLogo } from "@/components/BrandLogo"
import { IconSun, IconMoon, IconHome, IconShoppingCart, IconReceipt, IconUser } from "@tabler/icons-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAppStore } from "@/lib/store"

interface CommonLayoutProps {
  children: React.ReactNode
}

export function CommonLayout({ children }: CommonLayoutProps) {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { tableId, cart, orders } = useAppStore()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const navItems = [
    {
      label: "Home",
      icon: <IconHome className="size-5" />,
      path: tableId ? `/menuitems/${tableId}` : "/",
      isActive: location.pathname === "/" || location.pathname.startsWith("/menuitems"),
    },
    {
      label: "Cart",
      icon: (
        <div className="relative">
          <IconShoppingCart className="size-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      ),
      path: "/checkout",
      isActive: location.pathname === "/checkout" || location.pathname === "/payment",
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
      isActive: location.pathname === "/profile" || location.pathname === "/auth",
    },
  ]

  return (
    <div className="relative flex flex-col w-full min-h-screen pb-20 bg-background text-foreground transition-all duration-300">
      {/* Ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20 dark:opacity-[0.12] z-0"
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "heroPulse 7s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full opacity-15 dark:opacity-[0.10] z-0"
        style={{
          background: "radial-gradient(circle, var(--color-chart-2) 0%, transparent 70%)",
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
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <BrandLogo />
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
        >
          {theme === "dark" ? (
            <IconSun className="size-4" />
          ) : (
            <IconMoon className="size-4" />
          )}
        </button>
      </header>

      <main className="flex-1 flex flex-col w-full relative z-10">
        {children}
      </main>

      {/* Bottom Navigation Tabs */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-background/85 backdrop-blur-md border-t border-border px-6 py-2 flex items-center justify-between shadow-lg">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
              item.isActive 
                ? "text-primary scale-105 font-bold" 
                : "text-muted-foreground hover:text-foreground hover:scale-102"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
