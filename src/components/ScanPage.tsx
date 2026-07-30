import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IconQrcode, IconCamera, IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function ScanPage() {
  const navigate = useNavigate()
  const setTableId = useAppStore((state) => state.setTableId)
  const [tableInput, setTableInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tableInput.trim()) {
      setTableId(tableInput.trim())
      navigate(`/menu/${tableInput.trim()}`)
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
            navigate(`/menu/${mockTable}`)
          }, 600)
          return 100
        }
        return prev + 10
      })
    }, 150)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-4 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary dark:bg-primary/20">
            <IconQrcode size={36} />
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">The Smart Bills</h1>
          <p className="text-muted-foreground text-sm">
            Scan the QR to get menu and order food. You can check us at{" "}
            <a 
              href="https://partner.thesmartbills.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              partner.thesmartbills.com
            </a>
          </p>
        </div>

        {isScanning ? (
          <Card className="border-2 border-primary overflow-hidden bg-muted/30">
            <CardContent className="pt-6 flex flex-col items-center justify-center space-y-6">
              <div className="relative w-48 h-48 border-4 border-dashed border-primary rounded-xl flex items-center justify-center overflow-hidden bg-black/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-bounce" />
                <IconCamera size={48} className="text-primary animate-pulse" />
              </div>
              <div className="space-y-2 w-full max-w-xs">
                <div className="flex justify-between text-xs font-medium">
                  <span>Simulating Camera feed...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-150" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Simulate QR Scan</CardTitle>
                <CardDescription>Click below to simulate a phone camera scanning the table QR code.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={handleSimulateScan} 
                  className="w-full py-6 text-base font-semibold bg-primary hover:opacity-90 text-primary-foreground rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <IconCamera className="mr-2" size={20} />
                  Simulate QR Scan
                </Button>
              </CardContent>
            </Card>

            <div className="relative flex py-2 items-center justify-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase font-semibold">Or enter manually</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input 
                type="text" 
                placeholder="e.g., Table-5" 
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                className="flex-1 rounded-xl"
              />
              <Button type="submit" className="rounded-xl px-5 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800">
                Go <IconChevronRight size={16} className="ml-1" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
