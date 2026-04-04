import { create } from 'zustand'
interface HubState { selectedId: number | null; setSelectedId: (id: number | null) => void; isFormOpen: boolean; setIsFormOpen: (isOpen: boolean) => void; searchKeyword: string; setSearchKeyword: (keyword: string) => void }
export const useCollectionHubStore = create<HubState>((set) => ({ selectedId: null, setSelectedId: (id) => set({ selectedId: id }), isFormOpen: false, setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }), searchKeyword: '', setSearchKeyword: (keyword) => set({ searchKeyword: keyword }) }))
