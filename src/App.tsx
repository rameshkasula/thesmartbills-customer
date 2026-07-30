import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { QueryProvider } from "@/components/QueryProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { AppRoutes } from "@/config/AppRoutes"
import { useAppStore } from "@/lib/store"

export function App() {
  const fetchUser = useAppStore((state) => state.fetchUser)
  
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <ThemeProvider defaultTheme="light" storageKey="tsb-customer-theme">
      <QueryProvider>
        <BrowserRouter>
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background text-foreground">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App
