import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { 
  IconPlus, 
  IconMinus, 
  IconFlame, 
  IconSearch, 
  IconLeaf, 
  IconChevronRight 
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore, type MenuItem } from "@/lib/store"

const MOCK_MENU: MenuItem[] = [
  {
    id: "1",
    name: "Crispy Truffle Fries",
    price: 8.99,
    description: "Golden hand-cut fries tossed in white truffle oil, grated parmesan, and fresh herbs.",
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60",
    isPopular: true,
    isVeg: true
  },
  {
    id: "2",
    name: "Classic Smash Burger",
    price: 14.99,
    description: "Double smashed premium beef patty, melted cheddar, house pickle sauce, toasted brioche.",
    category: "Mains",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    isPopular: true,
    isVeg: false
  },
  {
    id: "3",
    name: "Spicy Avocado Roll",
    price: 12.49,
    description: "Creamy avocado, cucumber, spicy aioli, tempura flakes, drizzled with sweet unagi sauce.",
    category: "Mains",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60",
    isVeg: true
  },
  {
    id: "4",
    name: "Warm Lava Chocolate Cake",
    price: 7.99,
    description: "Rich dark chocolate cake with a molten lava center, served with fresh vanilla bean gelato.",
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60",
    isVeg: true
  },
  {
    id: "5",
    name: "Artisanal Mango Lemonade",
    price: 4.99,
    description: "Cold pressed fresh mango nectar, squeezed lemons, sparkling pure soda water.",
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",
    isVeg: true
  }
]

export function MenuPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const navigate = useNavigate()
  
  const { cart, addToCart, updateQuantity } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  // React Query query to fetch menu items
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      // Simulate API call latency
      await new Promise((resolve) => setTimeout(resolve, 800))
      return MOCK_MENU
    }
  })

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
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border z-10 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading font-bold">SmartMenu Diner</h2>
          <p className="text-xs text-muted-foreground">Ordering from: <span className="font-semibold text-primary">{tableId}</span></p>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-2.5 py-1">
          Active Table
        </Badge>
      </div>

      {/* Search & Filter */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search delicious food..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
              <Card key={n} className="overflow-hidden animate-pulse">
                <div className="h-40 bg-muted" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-6 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-8 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No delicious dishes found matching your criteria.
          </div>
        ) : (
          filteredItems.map((item) => {
            const inCart = cart.find((i) => i.menuItem.id === item.id)
            return (
              <Card key={item.id} className="overflow-hidden border border-border/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-28 h-28 object-cover flex-shrink-0"
                  />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 justify-between">
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                          {item.isVeg && <IconLeaf size={14} className="text-green-600 fill-green-600" />}
                        </div>
                        {item.isPopular && (
                          <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] gap-0.5 px-1.5 py-0">
                            <IconFlame size={10} className="fill-amber-500 stroke-amber-500" /> Hot
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-normal">{item.description}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-dashed border-border/60">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">${item.price.toFixed(2)}</span>
                      {inCart ? (
                        <div className="flex items-center bg-primary/5 border border-primary/20 rounded-lg p-0.5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-primary hover:opacity-85"
                            onClick={() => updateQuantity(item.id, inCart.quantity - 1)}
                          >
                            <IconMinus size={12} />
                          </Button>
                          <span className="px-2 text-xs font-bold text-primary">{inCart.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-primary hover:opacity-85"
                            onClick={() => updateQuantity(item.id, inCart.quantity + 1)}
                          >
                            <IconPlus size={12} />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => addToCart(item)}
                          size="sm" 
                          className="h-8 bg-primary hover:opacity-90 text-primary-foreground rounded-lg text-xs font-semibold px-3"
                        >
                          Add <IconPlus size={12} className="ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background/90 backdrop-blur-md border-t border-border z-10 animate-slide-up">
          <Button 
            onClick={() => navigate("/checkout")}
            className="w-full py-6 bg-primary hover:opacity-90 text-primary-foreground rounded-xl shadow-lg flex justify-between px-6 font-semibold"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{cartCount} items</span>
              <span>View Cart</span>
            </div>
            <div className="flex items-center gap-1">
              <span>${cartTotal.toFixed(2)}</span>
              <IconChevronRight size={18} />
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
