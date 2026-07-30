import React from "react"
import { useTheme } from "@/components/theme-provider"
import { BrandLogo } from "@/components/BrandLogo"
import { IconSun, IconMoon } from "@tabler/icons-react"

interface CommonLayoutProps {
  children: React.ReactNode
}

export function CommonLayout({ children }: CommonLayoutProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-background text-foreground transition-all duration-300">
      {/* Ambient top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full opacity-10 dark:opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

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

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 px-4 py-6 text-center text-xs text-muted-foreground mt-auto">
        <p>© {new Date().getFullYear()} The Smart Bills. All rights reserved.</p>
      </footer>
    </div>
  )
}
