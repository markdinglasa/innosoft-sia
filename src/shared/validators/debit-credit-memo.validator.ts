import { DebitCreditMemoType } from '@shared/types/debit-credit-memo.types'
import { z } from 'zod'

/**
 * Zod schema for Debit/Credit Memo Line Item
 */
export const debitCreditMemoLineSchema = z.object({
  id: z.number().optional(),
  orderId: z.number().nullable().optional(),
  accountId: z.number({ error: 'Account is required' }),
  particulars: z.string().max(255).nullable().optional(),
  debitAmount: z.number().min(0).default(0),
  creditAmount: z.number().min(0).default(0)
})

/**
 * Zod schema for Create/Update Debit/Credit Memo
 */
export const debitCreditMemoSchema = z.object({
  dcMemoDate: z.date({ error: 'Date is required' }).refine((date) => date <= new Date(), {
    message: 'Memo date cannot be in the future'
  }),
  dcMemoNumber: z.string().min(1, 'Memo Number is required').max(50),
  memoType: z.enum(DebitCreditMemoType),
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than zero')
    .max(10000, 'Amount cannot exceed $10,000')
    .refine(
      (val) => {
        const parts = val.toString().split('.')
        return parts.length <= 1 || parts[1].length <= 2
      },
      {
        message: 'Amount cannot have more than two decimal places'
      }
    ),
  particulars: z
    .string()
    .min(1, 'Particulars are required')
    .max(500, 'Particulars cannot exceed 500 characters')
    .regex(/^[a-zA-Z0-9\s.,-]+$/, 'Particulars must be alphanumeric'),
  terminalId: z.string().max(50).nullable().optional(),
  cardType: z.string().max(50).nullable().optional(),
  authorizationCode: z.string().max(100).nullable().optional(),
  lineItems: z.array(debitCreditMemoLineSchema).optional().nullable()
})

export type DebitCreditMemoSchema = z.infer<typeof debitCreditMemoSchema>
export type DebitCreditMemoLineSchema = z.infer<typeof debitCreditMemoLineSchema>

