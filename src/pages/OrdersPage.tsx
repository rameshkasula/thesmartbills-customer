import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/lib/store"
import { IconChevronLeft, IconReceipt, IconChevronRight, IconClock } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function OrdersPage() {
  const navigate = useNavigate()
  const { orders } = useAppStore()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/80 z-20 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9 rounded-full">
          <IconChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="text-base font-bold font-heading tracking-tight">Your Orders</h2>
          <p className="text-xs text-muted-foreground">History of your dining orders</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <IconReceipt size={24} />
            </div>
            <h3 className="font-bold text-sm">No orders placed yet</h3>
            <p className="text-xs text-muted-foreground max-w-[200px]">Any orders you place during this session will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <Card 
              key={order.id} 
              onClick={() => navigate(`/orders/${order.id}`)}
              className="border border-border/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <CardTitle className="text-xs font-bold font-mono text-muted-foreground group-hover:text-primary transition-colors">
                    {order.id}
                  </CardTitle>
                  <CardDescription className="text-[10px] flex items-center gap-1">
                    <IconClock size={10} /> {order.timestamp}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-[10px] capitalize">
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent className="pb-3 flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items • Table {order.tableId}
                </span>
                <div className="flex items-center gap-1 font-bold text-foreground">
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                  <IconChevronRight size={14} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
