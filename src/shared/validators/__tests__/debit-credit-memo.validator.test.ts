import { describe, it, expect } from 'vitest'
import { debitCreditMemoSchema } from '../debit-credit-memo.validator'

describe('debitCreditMemoSchema', () => {
  it('should validate a valid memo', () => {
    const data = {
      dcMemoDate: new Date(),
      dcMemoNumber: 'MEMO-001',
      memoType: 'DEBIT',
      amount: 50.25,
      particulars: 'Test memo particulars'
    }
    const result = debitCreditMemoSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should fail if amount has more than 2 decimal places', () => {
    const data = {
      dcMemoDate: new Date(),
      dcMemoNumber: 'MEMO-002',
      memoType: 'CREDIT',
      amount: 50.255,
      particulars: 'Invalid amount'
    }
    const result = debitCreditMemoSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('decimal places')
    }
  })

  it('should fail if amount is negative', () => {
    const data = {
      dcMemoDate: new Date(),
      dcMemoNumber: 'MEMO-003',
      memoType: 'DEBIT',
      amount: -10,
      particulars: 'Negative amount'
    }
    const result = debitCreditMemoSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should fail if date is in the future', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    const data = {
      dcMemoDate: futureDate,
      dcMemoNumber: 'MEMO-004',
      memoType: 'DEBIT',
      amount: 10,
      particulars: 'Future date'
    }
    const result = debitCreditMemoSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('future')
    }
  })

  it('should fail if particulars contain invalid characters', () => {
    const data = {
      dcMemoDate: new Date(),
      dcMemoNumber: 'MEMO-005',
      memoType: 'DEBIT',
      amount: 10,
      particulars: 'Invalid <script>'
    }
    const result = debitCreditMemoSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('alphanumeric')
    }
  })
})
