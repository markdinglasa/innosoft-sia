import { create } from 'zustand'

interface ItemHubState {
  selectedItemId: number | null
  setSelectedItemId: (id: number | null) => void
  isFormOpen: boolean
  setIsFormOpen: (isOpen: boolean) => void
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
}

export const useItemHubStore = create<ItemHubState>((set) => ({
  selectedItemId: null,
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  isFormOpen: false,
  setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword })
}))

