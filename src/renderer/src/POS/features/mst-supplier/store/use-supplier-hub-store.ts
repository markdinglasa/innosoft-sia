import { create } from 'zustand'

interface SupplierHubState {
  selectedSupplierId: number | null
  setSelectedSupplierId: (id: number | null) => void
  isFormOpen: boolean
  setIsFormOpen: (isOpen: boolean) => void
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
}

export const useSupplierHubStore = create<SupplierHubState>((set) => ({
  selectedSupplierId: null,
  setSelectedSupplierId: (id) => set({ selectedSupplierId: id }),
  isFormOpen: false,
  setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}))
