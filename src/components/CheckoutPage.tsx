import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  IconChevronLeft, 
  IconShoppingCart, 
  IconTrash, 
  IconPlus, 
  IconMinus, 
  IconLock,
  IconArrowRight,
  IconSparkles
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, tableId, user, updateQuantity, removeFromCart, setUser } = useAppStore()
  
  // Auth state inputs (mock login)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)

  const cartTotal = cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0)
  const tax = cartTotal * 0.08
  const grandTotal = cartTotal + tax

  const handleBack = () => {
    if (tableId) {
      navigate(`/menu/${tableId}`)
    } else {
      navigate("/")
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return

    setIsSubmittingAuth(true)
    // Simulate login endpoint latency
    setTimeout(() => {
      setUser({
        name,
        phone,
        token: `mock-jwt-token-${Math.random()}`
      })
      setIsSubmittingAuth(false)
    }, 800)
  }

  const handleProceedToPayment = () => {
    if (user) {
      navigate("/payment")
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <IconShoppingCart size={28} />
          </div>
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">Go back to the menu to add delicious items to your order.</p>
          <Button onClick={handleBack} className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl">
            Go to Menu
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border z-10 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
          <IconChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="text-lg font-heading font-bold">Review Order</h2>
          <p className="text-xs text-muted-foreground">Table: {tableId || "Not specified"}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Cart Items List */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <IconShoppingCart size={18} className="text-orange-600" />
              Items Added
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between items-center gap-4 py-2 border-b border-border last:border-b-0 last:pb-0">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.menuItem.name}</h4>
                  <p className="text-xs text-muted-foreground">${item.menuItem.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-secondary rounded-lg p-0.5">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    >
                      <IconMinus size={10} />
                    </Button>
                    <span className="px-2 text-xs font-bold">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    >
                      <IconPlus size={10} />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive/80"
                    onClick={() => removeFromCart(item.menuItem.id)}
                  >
                    <IconTrash size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bill Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST & Restaurant Charges (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-dashed border-border mt-2">
              <span>Grand Total</span>
              <span className="text-primary">${grandTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Auth section */}
        {!user ? (
          <Card className="border-primary/20 border shadow-md bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-1.5 text-primary">
                <IconLock size={16} /> Guest Checkout Login
              </CardTitle>
              <CardDescription>Enter details to link order & receive digital bill updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Your Name</Label>
                  <Input 
                    id="name"
                    required
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                  <Input 
                    id="phone"
                    required
                    type="tel"
                    placeholder="Enter 10-digit number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background rounded-xl"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmittingAuth}
                  className="w-full bg-primary hover:opacity-90 text-primary-foreground rounded-xl py-5"
                >
                  {isSubmittingAuth ? "Logging you in..." : "Link Profile & Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-green-500/20 bg-green-500/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold text-sm">
                  <IconSparkles size={14} className="fill-green-600" />
                  Logged in as {user.name}
                </div>
                <p className="text-xs text-muted-foreground">{user.phone}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUser(null)}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Change
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer Action Button */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background/90 backdrop-blur-md border-t border-border z-10 animate-slide-up">
          <Button 
            onClick={handleProceedToPayment}
            className="w-full py-6 bg-primary hover:opacity-90 text-primary-foreground rounded-xl shadow-lg font-semibold flex justify-center items-center gap-2"
          >
            <span>Proceed to Payment</span>
            <IconArrowRight size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}
