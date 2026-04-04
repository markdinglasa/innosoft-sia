import { create } from 'zustand'

export interface CartItem {
  itemId: number
  itemCode: string
  name: string
  quantity: number
  price: number
  cost: number
  taxId?: number
  taxRate?: number
  isTaxInclusive?: boolean
  discountAmount?: number
  discountRate?: number
  // Calculated fields (stored in cart for quick UI access, but re-calculated by engine)
  amount: number
  taxAmount: number
  netAmount: number
}

export interface OrderSummary {
  subtotal: number
  totalTax: number
  totalDiscount: number
  totalAmount: number
}

interface OrderHubState {
  cart: CartItem[]
  selectedCustomerId: number | null
  setSelectedCustomerId: (id: number | null) => void
  addItem: (item: any) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  summary: OrderSummary
  setSummary: (summary: OrderSummary) => void
}

export const useOrderHubStore = create<OrderHubState>((set) => ({
  cart: [],
  selectedCustomerId: null,
  setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),
  
  addItem: (item) => set((state) => {
    const existingIndex = state.cart.findIndex(i => i.itemId === item.id)
    if (existingIndex > -1) {
      const newCart = [...state.cart]
      newCart[existingIndex].quantity += 1
      return { cart: newCart }
    }
    const newItem: CartItem = {
      itemId: item.id,
      itemCode: item.itemCode,
      name: item.name,
      quantity: 1,
      price: Number(item.price),
      cost: Number(item.cost),
      taxId: item.outTaxId,
      amount: 0,
      taxAmount: 0,
      netAmount: 0
    }
    return { cart: [...state.cart, newItem] }
  }),

  removeItem: (itemId) => set((state) => ({
    cart: state.cart.filter(i => i.itemId !== itemId)
  })),

  updateQuantity: (itemId, quantity) => set((state) => ({
    cart: state.cart.map(i => i.itemId === itemId ? { ...i, quantity } : i)
  })),

  clearCart: () => set({ cart: [], selectedCustomerId: null }),

  summary: {
    subtotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    totalAmount: 0
  },
  setSummary: (summary) => set({ summary })
}))
