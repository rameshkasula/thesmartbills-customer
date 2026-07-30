import { create } from "zustand"

export interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  category: string
  image: string
  isPopular?: boolean
  isVeg?: boolean
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export interface User {
  name: string
  phone: string
  token: string
}

export interface Order {
  id: string
  tableId: string
  items: CartItem[]
  totalAmount: number
  status: "received" | "preparing" | "cooking" | "ready" | "delivered"
  timestamp: string
}

interface AppState {
  tableId: string | null
  cart: CartItem[]
  user: User | null
  orders: Order[]
  setTableId: (tableId: string | null) => void
  setUser: (user: User | null) => void
  addToCart: (item: MenuItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  createOrder: () => Order
}

export const useAppStore = create<AppState>((set, get) => ({
  tableId: null,
  cart: [],
  user: null,
  orders: [],

  setTableId: (tableId) => set({ tableId }),
  setUser: (user) => set({ user }),

  addToCart: (item) => {
    set((state) => {
      const existing = state.cart.find((i) => i.menuItem.id === item.id)
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { cart: [...state.cart, { menuItem: item, quantity: 1 }] }
    })
  },

  removeFromCart: (itemId) => {
    set((state) => ({
      cart: state.cart.filter((i) => i.menuItem.id !== itemId),
    }))
  },

  updateQuantity: (itemId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((i) => i.menuItem.id !== itemId) }
      }
      return {
        cart: state.cart.map((i) =>
          i.menuItem.id === itemId ? { ...i, quantity } : i
        ),
      }
    })
  },

  clearCart: () => set({ cart: [] }),

  createOrder: () => {
    const { cart, tableId } = get()
    const totalAmount = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableId: tableId || "T-1",
      items: [...cart],
      totalAmount,
      status: "received",
      timestamp: new Date().toLocaleTimeString(),
    }

    set((state) => ({
      orders: [newOrder, ...state.orders],
      cart: [],
    }))

    return newOrder
  },
}))
