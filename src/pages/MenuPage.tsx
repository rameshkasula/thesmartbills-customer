import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  IconPlus,
  IconMinus,
  IconFlame,
  IconSearch,
  IconChevronRight,
  IconArrowLeft,
  IconShoppingBag,
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

  const { cart, addToCart, updateQuantity, setOutletId, setTableId } =
    useAppStore()

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

  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((item) => item.category))),
  ]

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  )

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/80 bg-background/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-9 w-9 rounded-full"
          >
            <IconArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="font-heading text-base font-bold tracking-tight">
              SmartMenu Diner
            </h2>
            <p className="text-xs text-muted-foreground">
              Table:{" "}
              <span className="font-semibold text-primary">
                {tableId || "Guest"}
              </span>
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
        >
          Active Table
        </Badge>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4 p-4">
        <div className="relative">
          <IconSearch
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground/75"
            size={18}
          />
          <Input
            placeholder="Search food, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border-muted-foreground/20 bg-muted/30 pl-10 focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>

        {/* Categories Chips */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? "scale-[1.02] bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-secondary/70 text-secondary-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 space-y-4 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Card
                key={n}
                className="animate-pulse space-y-3 overflow-hidden border border-border/65 p-4"
              >
                <div className="space-y-2">
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-1/5 rounded bg-muted" />
                  <div className="h-8 w-1/4 rounded bg-muted" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="space-y-2 py-16 text-center text-muted-foreground">
            <div className="text-3xl">🍽️</div>
            <p className="text-sm">
              No delicious dishes found matching your criteria.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const inCart = cart.find((i) => i.menuItem.id === item.id)
            return (
              <Card
                key={item.id}
                className="group flex flex-col justify-between gap-3 overflow-hidden border border-border/80 p-4 shadow-sm transition-all duration-250 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {item.isVeg !== undefined && (
                        <div
                          className={`mt-0.5 flex flex-shrink-0 items-center justify-center rounded border p-0.5 ${
                            item.isVeg
                              ? "border-green-600 bg-green-50/50 dark:bg-green-950/20"
                              : "border-red-600 bg-red-50/50 dark:bg-red-950/20"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`}
                          />
                        </div>
                      )}
                      <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {item.name}
                      </h3>
                    </div>
                    {item.isPopular && (
                      <Badge
                        variant="secondary"
                        className="shrink-0 gap-0.5 border border-amber-200/50 bg-amber-50 px-1.5 py-0 text-[10px] text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      >
                        <IconFlame
                          size={10}
                          className="fill-amber-500 stroke-amber-500"
                        />{" "}
                        Hot
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-normal text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-border pt-2">
                  <span className="text-sm font-bold text-foreground">
                    ₹{item.price.toFixed(2)}
                  </span>
                  {inCart ? (
                    <div className="flex items-center rounded-xl border border-primary/20 bg-primary/5 p-0.5 shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="animate-fade-in h-7 w-7 rounded-lg text-primary hover:bg-primary/10 active:scale-95"
                        onClick={() =>
                          updateQuantity(item.id, inCart.quantity - 1)
                        }
                      >
                        <IconMinus size={12} />
                      </Button>
                      <span className="px-2.5 text-xs font-bold text-primary">
                        {inCart.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="animate-fade-in h-7 w-7 rounded-lg text-primary hover:bg-primary/10 active:scale-95"
                        onClick={() =>
                          updateQuantity(item.id, inCart.quantity + 1)
                        }
                      >
                        <IconPlus size={12} />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(item)}
                      size="sm"
                      className="h-8 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/95 active:scale-[0.98]"
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
        <div className="animate-slide-up fixed right-0 bottom-16 left-0 z-20 mx-auto max-w-md border-t border-border/80 bg-background/90 p-4 backdrop-blur-md">
          <Button
            onClick={() => navigate("/checkout")}
            className="flex w-full justify-between rounded-xl bg-primary px-5 py-6 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/95 hover:opacity-95 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-0.5 text-xs font-bold">
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
