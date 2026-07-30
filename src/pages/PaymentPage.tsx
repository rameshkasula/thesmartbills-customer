import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { outletApi } from "@/api/outlet.api"
import { 
  IconChevronLeft, 
  IconCreditCard, 
  IconDeviceMobile, 
  IconCash,
  IconShieldCheck,
  IconLoader2,
  IconQrcode
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function PaymentPage() {
  const navigate = useNavigate()
  const { cart, createOrder } = useAppStore()
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cash">("card")

  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")

  const { data: outlet } = useQuery({
    queryKey: ["outlet", "6a6ad0a2e4e7a85cfca45b7a"],
    queryFn: () => outletApi.getOutlet("6a6ad0a2e4e7a85cfca45b7a"),
  })

  const cartTotal = cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0)
  const taxPercent = outlet?.taxPercentage ?? 5
  const grandTotal = cartTotal * (1 + taxPercent / 100)

  const paymentMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const order = createOrder()
      return order
    },
    onSuccess: (order) => {
      navigate(`/orders/${order.id}`)
    }
  })

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()
    paymentMutation.mutate()
  }

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/80 z-20 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/checkout")} className="h-9 w-9 rounded-full">
          <IconChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="text-base font-bold font-heading tracking-tight">Secure Payment</h2>
          <p className="text-xs text-muted-foreground">Amount to pay: <span className="font-semibold text-primary">₹{grandTotal.toFixed(2)}</span></p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Payment Methods */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-semibold gap-2 transition-all duration-200 cursor-pointer ${
              paymentMethod === "card" 
                ? "border-primary bg-primary/5 text-primary scale-[1.02] shadow-sm" 
                : "border-border hover:bg-secondary/50 text-muted-foreground"
            }`}
          >
            <IconCreditCard size={20} />
            <span>Card</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("upi")}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-semibold gap-2 transition-all duration-200 cursor-pointer ${
              paymentMethod === "upi" 
                ? "border-primary bg-primary/5 text-primary scale-[1.02] shadow-sm" 
                : "border-border hover:bg-secondary/50 text-muted-foreground"
            }`}
          >
            <IconDeviceMobile size={20} />
            <span>UPI / QR</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("cash")}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-semibold gap-2 transition-all duration-200 cursor-pointer ${
              paymentMethod === "cash" 
                ? "border-primary bg-primary/5 text-primary scale-[1.02] shadow-sm" 
                : "border-border hover:bg-secondary/50 text-muted-foreground"
            }`}
          >
            <IconCash size={20} />
            <span>Pay Counter</span>
          </button>
        </div>

        {/* Dynamic Payment Details */}
        <Card className="border border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-muted/20">
            <CardTitle className="text-sm font-semibold">
              {paymentMethod === "card" && "Credit or Debit Card"}
              {paymentMethod === "upi" && "Instant UPI Transfer"}
              {paymentMethod === "cash" && "Pay at Counter"}
            </CardTitle>
            <CardDescription className="text-xs">
              {paymentMethod === "card" && "Safe and secure card authorization."}
              {paymentMethod === "upi" && "Scan dynamic QR code below to complete."}
              {paymentMethod === "cash" && "Generate order and pay directly to restaurant waiter or counter cashier."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              {paymentMethod === "card" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardNumber" className="text-xs font-semibold">Card Number</Label>
                    <Input 
                      id="cardNumber"
                      required
                      placeholder="4111 2222 3333 4444" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="rounded-xl font-mono focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiry" className="text-xs font-semibold">Expiry Date</Label>
                      <Input 
                        id="expiry"
                        required
                        placeholder="MM/YY" 
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="rounded-xl text-center focus-visible:ring-1 focus-visible:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvv" className="text-xs font-semibold">CVV</Label>
                      <Input 
                        id="cvv"
                        required
                        type="password"
                        placeholder="•••" 
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="rounded-xl text-center focus-visible:ring-1 focus-visible:ring-primary/50"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "upi" && (
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-border/80 rounded-xl bg-muted/15 gap-4">
                  <div className="w-36 h-36 bg-white dark:bg-zinc-950 flex flex-col items-center justify-center rounded-xl border border-primary/10 shadow-sm relative p-2.5">
                    <IconQrcode className="w-full h-full text-zinc-800 dark:text-zinc-100" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl pointer-events-none" />
                  </div>
                  <p className="text-xs text-muted-foreground text-center max-w-[220px] leading-normal">
                    Scan this dynamic QR code with any UPI app (GPay, PhonePe, Paytm).
                  </p>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="p-4 border border-primary/20 rounded-xl bg-primary/5 text-primary text-xs leading-relaxed font-medium">
                  We'll send the details straight to the kitchen. You can pay counter staff using card or cash when leaving the restaurant.
                </div>
              )}

              <Button 
                type="submit" 
                disabled={paymentMutation.isPending}
                className="w-full mt-4 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl py-6 shadow-md transition-all active:scale-[0.98]"
              >
                {paymentMutation.isPending ? (
                  <>
                    <IconLoader2 className="animate-spin mr-2" size={18} />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${grandTotal.toFixed(2)} Now`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <IconShieldCheck className="text-emerald-600 dark:text-emerald-500" size={16} />
          <span>256-bit Secure SSL Checkout</span>
        </div>
      </div>
    </div>
  )
}
