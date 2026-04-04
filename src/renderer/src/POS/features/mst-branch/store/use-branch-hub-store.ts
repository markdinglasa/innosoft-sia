import { create } from 'zustand'

interface BranchHubState {
  selectedBranchId: number | null
  setSelectedBranchId: (id: number | null) => void
  isFormOpen: boolean
  setIsFormOpen: (isOpen: boolean) => void
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
}

export const useBranchHubStore = create<BranchHubState>((set) => ({
  selectedBranchId: null,
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
  isFormOpen: false,
  setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}))
