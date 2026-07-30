import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { outletApi } from "@/api/outlet.api"
import { 
  IconCircleCheck, 
  IconChefHat, 
  IconReceipt, 
  IconArrowLeft,
  IconClock,
  IconChevronRight
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { orders } = useAppStore()
  const order = orders.find((o) => o.id === orderId)

  const { data: outlet } = useQuery({
    queryKey: ["outlet", "6a6ad0a2e4e7a85cfca45b7a"],
    queryFn: () => outletApi.getOutlet("6a6ad0a2e4e7a85cfca45b7a"),
  })

  const taxPercent = outlet?.taxPercentage ?? 5
  const totalPaidAmount = order ? order.totalAmount * (1 + taxPercent / 100) : 0

  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(2), 5000)
    const timer2 = setTimeout(() => setActiveStep(3), 12000)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center bg-background">
        <h2 className="text-xl font-bold font-heading">Order not found</h2>
        <p className="text-muted-foreground text-sm mt-2">We couldn't retrieve this order's status.</p>
        <Button onClick={() => navigate("/")} className="mt-6 bg-primary hover:bg-primary/95 text-white rounded-xl py-5 shadow-sm px-6">
          Go back to Scan
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-background">
      {/* Success banner */}
      <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 text-white p-6 text-center space-y-2 flex flex-col items-center justify-center shadow-md">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <IconCircleCheck size={28} />
        </div>
        <h2 className="text-lg font-heading font-bold tracking-tight">Order Placed Successfully!</h2>
        <p className="text-xs text-emerald-100/90 max-w-[260px] leading-relaxed">
          Your table order has been registered in our kitchen system.
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Live Order Tracker */}
        <Card className="border border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-muted/20 border-b border-border/60">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <IconClock size={18} className="text-primary animate-pulse" />
              Live Kitchen Tracker
            </CardTitle>
            <CardDescription className="text-xs">Order ID: <span className="font-mono font-medium">{order.id}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-5">
            <div className="relative pl-6 space-y-6 border-l border-primary/20 ml-2">
              {/* Step 1 */}
              <div className="relative">
                <div className={`absolute -left-[30px] top-0.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  activeStep >= 1 ? "bg-primary border-primary shadow-sm" : "bg-background border-muted-foreground"
                }`} />
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-semibold ${activeStep >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                    Order Received
                  </h4>
                  <p className="text-[11px] text-muted-foreground">Kitchen accepted order. Table {order.tableId}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className={`absolute -left-[30px] top-0.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  activeStep >= 2 ? "bg-primary border-primary shadow-sm animate-pulse" : "bg-background border-muted"
                }`} />
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-semibold ${activeStep >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                    Preparing Ingredients
                  </h4>
                  <p className="text-[11px] text-muted-foreground">Chef is currently prepping fresh ingredients.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className={`absolute -left-[30px] top-0.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  activeStep >= 3 ? "bg-primary border-primary shadow-sm" : "bg-background border-muted"
                }`} />
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-semibold ${activeStep >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
                    Ready & Serving
                  </h4>
                  <p className="text-[11px] text-muted-foreground">Food will arrive at your table shortly!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details list */}
        <Card className="border border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-muted/20 border-b border-border/60">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <IconReceipt size={18} className="text-muted-foreground" />
              Receipt Details
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border pt-2.5">
            {order.items.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between items-center py-2.5 text-xs">
                <span className="text-muted-foreground">
                  {item.menuItem.name} <span className="font-semibold text-foreground">x{item.quantity}</span>
                </span>
                <span className="font-semibold">₹{(item.menuItem.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-3 flex justify-between text-sm font-bold mt-2">
              <span className="text-foreground">Total Paid (incl. tax)</span>
              <span className="text-primary">₹{totalPaidAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="space-y-3 pt-2">
          <Button 
            onClick={() => navigate(`/menuitems/${order.tableId}`)}
            className="w-full py-6 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <IconChefHat size={18} />
            <span>Order More Dishes</span>
            <IconChevronRight size={16} />
          </Button>

          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full py-6 rounded-xl border-border/80 font-semibold flex items-center justify-center gap-2 hover:bg-secondary/40 transition-all active:scale-[0.98]"
          >
            <IconArrowLeft size={16} />
            <span>Back to Scan Page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
