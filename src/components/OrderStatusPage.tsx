import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  IconCircleCheck, 
  IconChefHat, 
  IconReceipt, 
  IconArrowLeft,
  IconClock
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { orders } = useAppStore()
  const order = orders.find((o) => o.id === orderId)

  const [activeStep, setActiveStep] = useState(1)

  // Simulate progress pipeline
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <h2 className="text-xl font-bold">Order not found</h2>
        <p className="text-muted-foreground mt-2">We couldn't retrieve this order's status.</p>
        <Button onClick={() => navigate("/")} className="mt-4 bg-orange-600 text-white rounded-xl">
          Go back to Scan
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Success banner */}
      <div className="bg-emerald-600 text-white p-6 text-center space-y-2 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <IconCircleCheck size={28} />
        </div>
        <h2 className="text-xl font-heading font-bold">Order Placed Successfully!</h2>
        <p className="text-xs text-emerald-100">Your table order has been registered in our kitchen system.</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Live Order Tracker */}
        <Card className="border border-border/80 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-1.5">
              <IconClock size={18} className="text-primary" />
              Live Kitchen Tracker
            </CardTitle>
            <CardDescription>Order ID: {order.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative pl-6 space-y-6 border-l-2 border-primary/20">
              {/* Step 1 */}
              <div className="relative">
                <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                  activeStep >= 1 ? "bg-primary border-primary" : "bg-background border-muted-foreground"
                }`} />
                <div className="space-y-1">
                  <h4 className={`text-sm font-semibold ${activeStep >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                    Order Received
                  </h4>
                  <p className="text-xs text-muted-foreground">Kitchen accepted order. Table {order.tableId}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                  activeStep >= 2 ? "bg-primary border-primary animate-pulse" : "bg-background border-muted"
                }`} />
                <div className="space-y-1">
                  <h4 className={`text-sm font-semibold ${activeStep >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                    Preparing Ingredients
                  </h4>
                  <p className="text-xs text-muted-foreground">Chef is currently prepping fresh ingredients.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                  activeStep >= 3 ? "bg-primary border-primary" : "bg-background border-muted"
                }`} />
                <div className="space-y-1">
                  <h4 className={`text-sm font-semibold ${activeStep >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
                    Ready & Serving
                  </h4>
                  <p className="text-xs text-muted-foreground">Food will arrive at your table shortly!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details list */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-1.5">
              <IconReceipt size={18} className="text-muted-foreground" />
              Receipt Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {item.menuItem.name} <span className="font-semibold text-foreground">x{item.quantity}</span>
                  </span>
                  <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-border pt-3 flex justify-between text-sm font-bold">
              <span>Grand Total Paid</span>
              <span className="text-primary">${(order.totalAmount * 1.08).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action button to order more */}
        <div className="space-y-2">
          <Button 
            onClick={() => navigate(`/menu/${order.tableId}`)}
            className="w-full py-5 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <IconChefHat size={18} />
            <span>Order More Dishes</span>
          </Button>

          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full py-5 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <IconArrowLeft size={16} />
            <span>Back to Scan Page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
