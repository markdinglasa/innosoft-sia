import { create } from 'zustand'

interface ItemComponentHubState {
  // BOM form state
  selectedId: number | null
  setSelectedId: (id: number | null) => void
  isFormOpen: boolean
  setIsFormOpen: (isOpen: boolean) => void

  // Left panel: uninventoriable parent item picker
  selectedParentId: number | null
  selectedParentName: string
  setSelectedParent: (id: number | null, name: string) => void

  // Search for the parent item list
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void

  // Active tab (0 = Component, 1 = Package)
  activeTab: number
  setActiveTab: (tab: number) => void
}

export const useItemComponentHubStore = create<ItemComponentHubState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),

  isFormOpen: false,
  setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }),

  selectedParentId: null,
  selectedParentName: '',
  setSelectedParent: (id, name) => set({ selectedParentId: id, selectedParentName: name }),

  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  activeTab: 0,
  setActiveTab: (tab) => set({ activeTab: tab })
}))

