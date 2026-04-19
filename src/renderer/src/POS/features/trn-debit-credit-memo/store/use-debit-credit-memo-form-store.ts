import { DebitCreditMemoType } from '@shared/types/debit-credit-memo.types'
import { DebitCreditMemoSchema } from '@shared/validators/debit-credit-memo.validator'
import { create } from 'zustand'

interface DebitCreditMemoFormState {
  formData: DebitCreditMemoSchema
  isDirty: boolean
  activeStep: number

  // Actions
  setFormData: (data: Partial<DebitCreditMemoSchema>) => void
  setLineItems: (items: DebitCreditMemoSchema['lineItems']) => void
  addLineItem: (item: NonNullable<DebitCreditMemoSchema['lineItems']>[0]) => void
  removeLineItem: (index: number) => void
  updateLineItem: (
    index: number,
    item: Partial<NonNullable<DebitCreditMemoSchema['lineItems']>[0]>
  ) => void
  setActiveStep: (step: number) => void
  resetForm: () => void
}

const initialFormData: DebitCreditMemoSchema = {
  dcMemoDate: new Date(),
  dcMemoNumber: '',
  memoType: DebitCreditMemoType.DEBIT,
  amount: 0,
  particulars: '',
  terminalId: null,
  cardType: null,
  authorizationCode: null,
  lineItems: []
}

export const useDebitCreditMemoFormStore = create<DebitCreditMemoFormState>((set) => ({
  formData: initialFormData,
  isDirty: false,
  activeStep: 0,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
      isDirty: true
    })),

  setLineItems: (items) =>
    set((state) => ({
      formData: { ...state.formData, lineItems: items },
      isDirty: true
    })),

  addLineItem: (item) =>
    set((state) => ({
      formData: {
        ...state.formData,
        lineItems: [...(state.formData.lineItems || []), item]
      },
      isDirty: true
    })),

  removeLineItem: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        lineItems: (state.formData.lineItems || []).filter((_, i) => i !== index)
      },
      isDirty: true
    })),

  updateLineItem: (index, item) =>
    set((state) => ({
      formData: {
        ...state.formData,
        lineItems: (state.formData.lineItems || []).map((l, i) =>
          i === index ? { ...l, ...item } : l
        )
      },
      isDirty: true
    })),

  setActiveStep: (step) => set({ activeStep: step }),

  resetForm: () =>
    set({
      formData: { ...initialFormData, dcMemoDate: new Date() },
      isDirty: false,
      activeStep: 0
    })
}))

