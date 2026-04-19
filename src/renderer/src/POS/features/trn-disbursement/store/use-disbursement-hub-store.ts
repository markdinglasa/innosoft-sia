import { create } from 'zustand'
import { CashDenominations, DisbursementFormData } from '../types/disbursement.types'

interface HubState {
  selectedId: number | null
  setSelectedId: (id: number | null) => void
  isFormOpen: boolean
  setIsFormOpen: (isOpen: boolean) => void
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
  // Extended state
  denominations: CashDenominations
  setDenominations: (denominations: CashDenominations) => void
  denominationTotal: number
  setDenominationTotal: (total: number) => void
  draftData: Partial<DisbursementFormData> | null
  setDraftData: (data: Partial<DisbursementFormData> | null) => void
}

const initialDenominations: CashDenominations = {
  amount1000: 0,
  amount500: 0,
  amount200: 0,
  amount100: 0,
  amount50: 0,
  amount20: 0,
  amount10: 0,
  amount5: 0,
  amount1: 0,
  amount025: 0,
  amount010: 0,
  amount005: 0,
  amount001: 0
}

export const useDisbursementHubStore = create<HubState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
  isFormOpen: false,
  setIsFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  // Initial extended state
  denominations: initialDenominations,
  setDenominations: (denominations) => set({ denominations }),
  denominationTotal: 0,
  setDenominationTotal: (total) => set({ denominationTotal: total }),
  draftData: null,
  setDraftData: (data) => set({ draftData: data })
}))

