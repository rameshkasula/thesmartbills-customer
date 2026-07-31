import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IconCamera, IconChevronRight, IconQrcode } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { APP_PATHS } from "@/config/paths"

export function ScanPage() {
  const navigate = useNavigate()
  const setTableId = useAppStore((state) => state.setTableId)
  const setOutletId = useAppStore((state) => state.setOutletId)
  const [tableInput, setTableInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tableIdParam = params.get("tableId")
    const outletIdParam = params.get("outletId")
    if (tableIdParam && outletIdParam) {
      setTableId(tableIdParam)
      setOutletId(outletIdParam)
      navigate(`${APP_PATHS.MENU_ITEMS}/${tableIdParam}?outletId=${outletIdParam}`, { replace: true })
    }
  }, [navigate, setTableId, setOutletId])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tableInput.trim()) {
      setTableId(tableInput.trim())
      navigate(`${APP_PATHS.MENU_ITEMS}/${tableInput.trim()}`)
    }
  }

  const handleSimulateScan = () => {
    setIsScanning(true)
    setScanProgress(0)

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            const mockTable = `Table-${Math.floor(Math.random() * 20) + 1}`
            setTableId(mockTable)
            setIsScanning(false)
            navigate(`${APP_PATHS.MENU_ITEMS}/${mockTable}`)
          }, 600)
          return 100
        }
        return prev + 10
      })
    }, 150)
  }

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center p-4 text-center">
      <div className="w-full space-y-8">
        <div className="space-y-3">
          <div className="mb-4 flex items-center justify-center">
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 text-xs font-semibold border-primary/20 text-primary bg-primary/5 rounded-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Now Ordering — Live Dining
            </Badge>
          </div>
          
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20 shadow-sm shadow-primary/10">
            <IconQrcode size={30} />
          </div>
          
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Welcome to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-chart-1))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Dine & Pay
            </span>
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Scan the table QR code to view our premium digital menu and order delicious food instantly.
          </p>
        </div>

        {isScanning ? (
          <Card className="overflow-hidden border-border/80 shadow-lg bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center space-y-6 pt-6">
              <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-primary bg-black/5 dark:bg-white/5">
                <div className="absolute top-0 left-0 h-1 w-full animate-bounce bg-primary" />
                <IconCamera size={40} className="animate-pulse text-primary/80" />
              </div>
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Accessing Camera...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border border-border/60 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold">Simulate QR Scan</CardTitle>
                <CardDescription className="text-xs">
                  Click to simulate your phone's camera scanning the table QR.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={handleSimulateScan}
                  className="w-full rounded-xl bg-primary py-6 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/95 active:scale-[0.98] cursor-pointer"
                >
                  <IconCamera className="mr-2" size={18} />
                  Scan Table QR
                </Button>
              </CardContent>
            </Card>

            <div className="relative flex items-center justify-center py-1">
              <div className="flex-grow border-t border-border"></div>
              <span className="mx-4 flex-shrink text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Or Enter Table ID
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., Table-5"
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                className="flex-1 rounded-xl bg-muted/20 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-primary/50"
              />
              <Button
                type="submit"
                className="rounded-xl bg-foreground text-background px-5 hover:bg-foreground/90 transition-all active:scale-[0.97]"
              >
                Go <IconChevronRight size={16} className="ml-1" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
