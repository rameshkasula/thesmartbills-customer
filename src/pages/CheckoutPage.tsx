import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { outletApi } from "@/api/outlet.api"
import { 
  IconChevronLeft, 
  IconShoppingCart, 
  IconTrash, 
  IconPlus, 
  IconMinus, 
  IconLock,
  IconArrowRight,
  IconSparkles,
  IconFileText
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, tableId, user, updateQuantity, removeFromCart, setUser } = useAppStore()
  
  const { data: outlet } = useQuery({
    queryKey: ["outlet", "6a6ad0a2e4e7a85cfca45b7a"],
    queryFn: () => outletApi.getOutlet("6a6ad0a2e4e7a85cfca45b7a"),
  })

  const cartTotal = cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0)
  const taxPercent = outlet?.taxPercentage ?? 5
  const tax = cartTotal * (taxPercent / 100)
  const grandTotal = cartTotal + tax

  const handleBack = () => {
    if (tableId) {
      navigate(`/menuitems/${tableId}`)
    } else {
      navigate("/")
    }
  }

  const handleProceedToPayment = () => {
    if (user) {
      navigate("/payment")
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center bg-background">
        <div className="space-y-4 max-w-xs">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground animate-bounce">
            <IconShoppingCart size={28} />
          </div>
          <h2 className="text-xl font-bold font-heading">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm">Add delicious items to your order from the menu first.</p>
          <Button onClick={handleBack} className="w-full bg-primary hover:bg-primary/95 text-white rounded-xl py-5 shadow-md">
            Go to Menu
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-28 bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/80 z-20 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9 rounded-full">
          <IconChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="text-base font-bold font-heading tracking-tight">Review Order</h2>
          <p className="text-xs text-muted-foreground">Table ID: <span className="font-semibold text-primary">{tableId || "Not specified"}</span></p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Cart Items List */}
        <Card className="border border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-muted/20">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconShoppingCart size={18} className="text-primary" />
              Items Added ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border pt-2">
            {cart.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between items-center gap-4 py-3 first:pt-1 last:pb-1">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">{item.menuItem.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">₹{item.menuItem.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-secondary border border-border/60 rounded-xl p-0.5 shadow-sm">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-lg text-secondary-foreground" 
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    >
                      <IconMinus size={10} />
                    </Button>
                    <span className="px-2.5 text-xs font-bold">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-lg text-secondary-foreground"
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    >
                      <IconPlus size={10} />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 active:scale-95"
                    onClick={() => removeFromCart(item.menuItem.id)}
                  >
                    <IconTrash size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card className="border border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-muted/20">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconFileText size={18} className="text-muted-foreground" />
              Bill Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs pt-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST & Restaurant Charges ({taxPercent}%)</span>
              <span className="font-medium text-foreground">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2.5 border-t border-dashed border-border mt-3">
              <span className="text-foreground">Grand Total</span>
              <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Auth section */}
        {!user ? (
          <Card className="border-primary/20 border shadow-md bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-primary">
                <IconLock size={16} /> Authentication Required
              </CardTitle>
              <CardDescription className="text-xs">You need to register or sign in to complete your order.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/auth", { state: { from: "/checkout" } })}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl py-5 shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Sign In / Register with OTP
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                  <IconSparkles size={14} className="fill-emerald-600 dark:fill-emerald-400" />
                  Logged in as {user.name}
                </div>
                {user.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                {user.email && <p className="text-[10px] text-muted-foreground">{user.email}</p>}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/profile")}
                className="text-xs text-muted-foreground hover:text-primary rounded-lg hover:bg-transparent cursor-pointer"
              >
                Manage Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer Action Button */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background/90 backdrop-blur-md border-t border-border/80 z-20 animate-slide-up">
          <Button 
            onClick={handleProceedToPayment}
            className="w-full py-6 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl shadow-lg font-semibold flex justify-center items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Proceed to Payment</span>
            <IconArrowRight size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}
