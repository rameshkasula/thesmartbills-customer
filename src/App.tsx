import { BrowserRouter } from "react-router-dom"
import { QueryProvider } from "@/components/QueryProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { AppRoutes } from "@/components/AppRoutes"

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tsb-customer-theme">
      <QueryProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground flex flex-col w-full max-w-md mx-auto">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App
