import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { 
  IconPlus, 
  IconMinus, 
  IconFlame, 
  IconSearch, 
  IconLeaf, 
  IconChevronRight,
  IconArrowLeft,
  IconShoppingBag
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { menuItemApi } from "@/api/menuitems.api"

export function MenuPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const outletId = searchParams.get("outletId") || "6a6ad0a2e4e7a85cfca45b7a"
  
  const { cart, addToCart, updateQuantity, setOutletId, setTableId } = useAppStore()

  useEffect(() => {
    if (outletId) setOutletId(outletId)
    if (tableId) setTableId(tableId)
  }, [outletId, tableId, setOutletId, setTableId])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: rawMenuItems = [], isLoading } = useQuery({
    queryKey: ["menuItems", outletId],
    queryFn: () => menuItemApi.list(outletId),
  })

  const menuItems = rawMenuItems.map((item) => ({
    ...item,
    id: item.id || (item as any)._id,
  }))

  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))]

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cart.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0)

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/80 z-20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-9 w-9 rounded-full">
            <IconArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-base font-bold font-heading tracking-tight">SmartMenu Diner</h2>
            <p className="text-xs text-muted-foreground">Table: <span className="font-semibold text-primary">{tableId || "Guest"}</span></p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-2.5 py-1 text-xs rounded-full font-medium">
          Active Table
        </Badge>
      </div>

      {/* Search & Filter */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75" size={18} />
          <Input 
            placeholder="Search food, drinks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-muted/30 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat 
                  ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]" 
                  : "bg-secondary/70 text-secondary-foreground hover:bg-secondary border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="p-4 space-y-4 flex-1">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="overflow-hidden border border-border/65 animate-pulse p-4 space-y-3">
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-muted rounded w-1/5" />
                  <div className="h-8 bg-muted rounded w-1/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground space-y-2">
            <div className="text-3xl">🍽️</div>
            <p className="text-sm">No delicious dishes found matching your criteria.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const inCart = cart.find((i) => i.menuItem.id === item.id)
            return (
              <Card key={item.id} className="overflow-hidden border border-border/80 shadow-sm hover:shadow-md transition-all duration-250 group p-4 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start gap-2 justify-between">
                    <div className="flex items-start gap-2">
                      {item.isVeg !== undefined && (
                        <div className={`mt-0.5 flex-shrink-0 flex items-center justify-center p-0.5 rounded border ${
                          item.isVeg ? "border-green-600 bg-green-50/50 dark:bg-green-950/20" : "border-red-600 bg-red-50/50 dark:bg-red-950/20"
                        }`}>
                          <span className={`h-2.5 w-2.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                        </div>
                      )}
                      <h3 className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                    </div>
                    {item.isPopular && (
                      <Badge variant="secondary" className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] gap-0.5 px-1.5 py-0 border border-amber-200/50 shrink-0">
                        <IconFlame size={10} className="fill-amber-500 stroke-amber-500" /> Hot
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-normal">{item.description}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-dashed border-border">
                  <span className="font-bold text-sm text-foreground">₹{item.price.toFixed(2)}</span>
                  {inCart ? (
                    <div className="flex items-center bg-primary/5 border border-primary/20 rounded-xl p-0.5 shadow-sm">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg text-primary hover:bg-primary/10 active:scale-95 animate-fade-in"
                        onClick={() => updateQuantity(item.id, inCart.quantity - 1)}
                      >
                        <IconMinus size={12} />
                      </Button>
                      <span className="px-2.5 text-xs font-bold text-primary">{inCart.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg text-primary hover:bg-primary/10 active:scale-95 animate-fade-in"
                        onClick={() => updateQuantity(item.id, inCart.quantity + 1)}
                      >
                        <IconPlus size={12} />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => addToCart(item)}
                      size="sm" 
                      className="h-8 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl text-xs font-semibold px-3 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Add <IconPlus size={12} className="ml-1" />
                    </Button>
                  )}
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-4 bg-background/90 backdrop-blur-md border-t border-border/80 z-20 animate-slide-up">
          <Button 
            onClick={() => navigate("/checkout")}
            className="w-full py-6 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl shadow-lg flex justify-between px-5 font-semibold transition-all hover:opacity-95 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                <IconShoppingBag size={12} /> {cartCount}
              </span>
              <span>View Cart</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold">₹{cartTotal.toFixed(2)}</span>
              <IconChevronRight size={18} />
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
