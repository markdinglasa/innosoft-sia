import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CashDenominationCalculator } from '../cash-denomination-calculator'

describe('CashDenominationCalculator', () => {
  const mockOnDenominationChange = vi.fn()
  const initialDenominations = {
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

  it('calculates total correctly for multiple denominations', () => {
    const denominations = {
      ...initialDenominations,
      amount1000: 2, // 2000
      amount500: 1, // 500
      amount100: 5 // 500
    } // Total: 3000

    render(
      <CashDenominationCalculator
        totalAmount={3000}
        denominations={denominations}
        onDenominationChange={mockOnDenominationChange}
      />
    )

    expect(screen.getByText('₱3,000.00')).toBeInTheDocument()
    expect(screen.queryByText(/Mismatch/)).not.toBeInTheDocument()
  })

  it('displays mismatch warning when totals do not match', () => {
    const denominations = {
      ...initialDenominations,
      amount1000: 1 // 1000
    }

    render(
      <CashDenominationCalculator
        totalAmount={1500}
        denominations={denominations}
        onDenominationChange={mockOnDenominationChange}
      />
    )

    expect(screen.getByText(/Mismatch:.*500\.00/i)).toBeInTheDocument()
  })

  it('calls onDenominationChange when an input changes', () => {
    render(
      <CashDenominationCalculator
        totalAmount={1000}
        denominations={initialDenominations}
        onDenominationChange={mockOnDenominationChange}
      />
    )

    const input = screen.getByLabelText('₱1,000')
    fireEvent.change(input, { target: { value: '2' } })

    expect(mockOnDenominationChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amount1000: 2
      })
    )
  })

  it('handles decimal denominations correctly (0.25, 0.10, etc.)', () => {
    const denominations = {
      ...initialDenominations,
      amount025: 4, // 1.00
      amount010: 10, // 1.00
      amount005: 20, // 1.00
      amount001: 100 // 1.00
    } // Total: 4.00

    render(
      <CashDenominationCalculator
        totalAmount={4}
        denominations={denominations}
        onDenominationChange={mockOnDenominationChange}
      />
    )

    expect(screen.getByText('₱4.00')).toBeInTheDocument()
    expect(screen.queryByText(/Mismatch/)).not.toBeInTheDocument()
  })
})

