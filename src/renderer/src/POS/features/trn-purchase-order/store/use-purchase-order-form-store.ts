import { PurchaseOrderStatus } from '@shared/types/purchase-order.types'
import { PurchaseOrderSchema } from '@shared/validators/purchase-order.validator'
import { create } from 'zustand'

interface PurchaseOrderFormState {
  formData: PurchaseOrderSchema
  isDirty: boolean
  activeStep: number

  // Actions
  setFormData: (data: Partial<PurchaseOrderSchema>) => void
  setLineItems: (items: PurchaseOrderSchema['lineItems']) => void
  addLineItem: (item: PurchaseOrderSchema['lineItems'][0]) => void
  removeLineItem: (index: number) => void
  updateLineItem: (index: number, item: Partial<PurchaseOrderSchema['lineItems'][0]>) => void
  setActiveStep: (step: number) => void
  resetForm: () => void
}

const initialFormData: PurchaseOrderSchema = {
  purchaseOrderDate: new Date(),
  purchaseOrderNumber: '',
  supplierId: 0,
  expectedDeliveryDate: null,
  remarks: '',
  status: PurchaseOrderStatus.DRAFT,
  shippingAmount: 0,
  lineItems: []
}

export const usePurchaseOrderFormStore = create<PurchaseOrderFormState>((set) => ({
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
        lineItems: [...state.formData.lineItems, item]
      },
      isDirty: true
    })),

  removeLineItem: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        lineItems: state.formData.lineItems.filter((_, i) => i !== index)
      },
      isDirty: true
    })),

  updateLineItem: (index, item) =>
    set((state) => ({
      formData: {
        ...state.formData,
        lineItems: state.formData.lineItems.map((l, i) => (i === index ? { ...l, ...item } : l))
      },
      isDirty: true
    })),

  setActiveStep: (step) => set({ activeStep: step }),

  resetForm: () =>
    set({
      formData: { ...initialFormData, purchaseOrderDate: new Date() },
      isDirty: false,
      activeStep: 0
    })
}))

