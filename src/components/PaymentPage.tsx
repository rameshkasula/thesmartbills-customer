import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { 
  IconChevronLeft, 
  IconCreditCard, 
  IconDeviceMobile, 
  IconBrandGoogle, 
  IconShieldCheck,
  IconLoader2 
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

  // Form states
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")

  const cartTotal = cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0)
  const grandTotal = cartTotal * 1.08

  // React Query mutation to process mock payment
  const paymentMutation = useMutation({
    mutationFn: async () => {
      // Simulate gateway latency
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Create the order in store
      const order = createOrder()
      return order
    },
    onSuccess: (order) => {
      navigate(`/order/${order.id}`)
    }
  })

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()
    paymentMutation.mutate()
  }

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border z-10 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/checkout")} className="h-8 w-8">
          <IconChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="text-lg font-heading font-bold">Secure Payment</h2>
          <p className="text-xs text-muted-foreground">Amount to pay: ${grandTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Payment Methods */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
              paymentMethod === "card" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:bg-secondary/50"
            }`}
          >
            <IconCreditCard size={20} />
            <span>Card</span>
          </button>
          <button
            onClick={() => setPaymentMethod("upi")}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
              paymentMethod === "upi" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:bg-secondary/50"
            }`}
          >
            <IconDeviceMobile size={20} />
            <span>UPI / QR</span>
          </button>
          <button
            onClick={() => setPaymentMethod("cash")}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
              paymentMethod === "cash" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:bg-secondary/50"
            }`}
          >
            <IconBrandGoogle size={20} />
            <span>Pay Counter</span>
          </button>
        </div>

        {/* Dynamic Payment Details */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {paymentMethod === "card" && "Credit or Debit Card"}
              {paymentMethod === "upi" && "Instant UPI Transfer"}
              {paymentMethod === "cash" && "Pay at Counter"}
            </CardTitle>
            <CardDescription>
              {paymentMethod === "card" && "Safe and secure card authorization."}
              {paymentMethod === "upi" && "Scan dynamic QR or enter UPI ID."}
              {paymentMethod === "cash" && "Generate order and pay directly to the server cashier."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              {paymentMethod === "card" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardNumber" className="text-xs">Card Number</Label>
                    <Input 
                      id="cardNumber"
                      required
                      placeholder="4111 2222 3333 4444" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="rounded-xl font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiry" className="text-xs">Expiry Date</Label>
                      <Input 
                        id="expiry"
                        required
                        placeholder="MM/YY" 
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="rounded-xl text-center"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvv" className="text-xs">CVV</Label>
                      <Input 
                        id="cvv"
                        required
                        type="password"
                        placeholder="•••" 
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="rounded-xl text-center"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "upi" && (
                <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-xl bg-muted/30 gap-3">
                  <div className="w-36 h-36 bg-primary/5 flex items-center justify-center rounded-lg border border-primary/20">
                    {/* Simulated QR payload */}
                    <div className="w-28 h-28 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold text-center p-2">
                      Scan to Pay Grand Total
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Scan this QR with GooglePay, PhonePe, or Paytm.</p>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="p-4 border rounded-xl bg-primary/5 text-primary text-xs leading-relaxed">
                  You can order now, show the order code to cashier, and pay with cash/card at the restaurant billing desk.
                </div>
              )}

              <Button 
                type="submit" 
                disabled={paymentMutation.isPending}
                className="w-full mt-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl py-5"
              >
                {paymentMutation.isPending ? (
                  <>
                    <IconLoader2 className="animate-spin mr-2" size={18} />
                    Processing Secure Payment...
                  </>
                ) : (
                  `Pay $${grandTotal.toFixed(2)} Now`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <IconShieldCheck className="text-emerald-600" size={16} />
          <span>256-bit encryption with 3D Secure Verification</span>
        </div>
      </div>
    </div>
  )
}
