import { create } from 'zustand'

interface RoleHubState {
  selectedRoleId: number | null
  setSelectedRoleId: (id: number | null) => void
  isFormOpen: boolean
  setIsFormOpen: (isOpen: boolean) => void
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
}

export const useRoleHubStore = create<RoleHubState>((set) => ({
  selectedRoleId: null,
  setSelectedRoleId: (id) => set({ selectedRoleId: id }),
  isFormOpen: false,
  setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}))
