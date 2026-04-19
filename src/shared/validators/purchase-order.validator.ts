import { z } from 'zod'
import { PurchaseOrderStatus } from '../types/purchase-order.types'

/**
 * Zod schema for Purchase Order Line Item
 */
export const purchaseOrderLineSchema = z.object({
  id: z.number().optional(),
  itemId: z.number({ error: 'Item is required' }), // Zod uses required_error, not error
  unitId: z.number({ error: 'Unit is required' }),
  quantity: z.number().min(0.00001, 'Quantity must be greater than zero'),
  unitCost: z.number().min(0, 'Cost cannot be negative'),
  taxRate: z.number().min(0).max(100).default(0),
  discountRate: z.number().min(0).max(100).default(0),
  description: z.string().max(500).nullable().optional(),
  notes: z.string().max(1000).nullable().optional()
})

/**
 * Zod schema for Create/Update Purchase Order
 */
export const purchaseOrderSchema = z.object({
  purchaseOrderDate: z.date({ error: 'Date is required' }),
  purchaseOrderNumber: z.string().min(1, 'PO Number is required').max(50),
  supplierId: z.number({ error: 'Supplier is required' }),
  expectedDeliveryDate: z.date().nullable().optional(),
  remarks: z.string().max(500).nullable().optional(),
  // Use z.nativeEnum for TypeScript enums to ensure proper type inference
  status: z.enum(PurchaseOrderStatus).default(PurchaseOrderStatus.DRAFT),
  shippingAmount: z.number().min(0).default(0),
  lineItems: z.array(purchaseOrderLineSchema).min(1, 'At least one line item is required')
})

export type PurchaseOrderSchema = z.infer<typeof purchaseOrderSchema>
export type PurchaseOrderLineSchema = z.infer<typeof purchaseOrderLineSchema>

