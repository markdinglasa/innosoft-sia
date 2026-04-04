import { create } from 'zustand'

interface UserHubState {
  selectedUserId: number | null
  setSelectedUserId: (id: number | null) => void
  isFormOpen: boolean
  setIsFormOpen: (isOpen: boolean) => void
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
}

export const useUserHubStore = create<UserHubState>((set) => ({
  selectedUserId: null,
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  isFormOpen: false,
  setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}))
