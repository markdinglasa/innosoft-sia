/**
 * Deterministic Calculation Engine for Transactional Integrity (FEAT-TRX-002).
 * Shared between Main (Final Commit) and Renderer (Real-time UI).
 * 
 * Rules:
 * - Internal precision: 5 decimals (to prevent rounding drift).
 * - Display precision: 2 decimals.
 * - Tax order: Item Discount -> Tax -> Transaction Discount? 
 *   (Spec says item-level discount applies before transaction-level).
 */

export interface LineItemCalculation {
  price: number
  quantity: number
  discountAmount: number // Total discount for this line (fixed)
  taxRate: number // e.g., 0.12 for 12%
  isTaxInclusive: boolean
}

export interface CalculationResult {
  baseAmount: number      // Price * Qty
  discountAmount: number  // Total applied discount
  taxableAmount: number   // Amount on which tax is calculated (Net of inclusive tax)
  taxAmount: number       // Calculated tax
  netTotal: number        // Final payable for this line (Amount)
}

export interface OrderCalculationSummary {
  totalAmount: number     // Sum of all line netTotals
  totalTax: number        // Sum of all line taxAmounts
  totalDiscount: number   // Sum of all line discountAmounts
  subtotal: number        // Sum of all line taxableAmounts
}

/**
 * Calculates a single line item deterministically.
 */
export const calculateLineItem = (line: LineItemCalculation): CalculationResult => {
  const { price, quantity, discountAmount, taxRate, isTaxInclusive } = line

  // 1. Calculate Base Amount (Gross)
  const baseAmount = round(price * quantity, 5)

  // 2. Subtract Line Discount
  const afterDiscount = round(baseAmount - discountAmount, 5)

  let taxableAmount = 0
  let taxAmount = 0
  let netTotal = 0

  if (isTaxInclusive) {
    // Inclusive: The price already includes the tax.
    // Base amount after discount is the final payable for this line.
    netTotal = afterDiscount
    // Derive taxable (net of tax)
    taxableAmount = round(netTotal / (1 + taxRate), 5)
    taxAmount = round(netTotal - taxableAmount, 5)
  } else {
    // Exclusive: Tax is added on top.
    taxableAmount = afterDiscount
    taxAmount = round(taxableAmount * taxRate, 5)
    netTotal = round(taxableAmount + taxAmount, 5)
  }

  return {
    baseAmount,
    discountAmount,
    taxableAmount,
    taxAmount,
    netTotal
  }
}

/**
 * Calculates summaries for a whole order.
 * @param lines Array of line item calculations.
 */
export const calculateOrderSummary = (lines: CalculationResult[]): OrderCalculationSummary => {
  return lines.reduce(
    (acc, curr) => ({
      totalAmount: round(acc.totalAmount + curr.netTotal, 5),
      totalTax: round(acc.totalTax + curr.taxAmount, 5),
      totalDiscount: round(acc.totalDiscount + curr.discountAmount, 5),
      subtotal: round(acc.subtotal + curr.taxableAmount, 5)
    }),
    { totalAmount: 0, totalTax: 0, totalDiscount: 0, subtotal: 0 }
  )
}

/**
 * Rounds a number to a specific precision.
 */
export const round = (value: number, precision: number): number => {
  const multiplier = Math.pow(10, precision)
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier
}

/**
 * Formats a number for display (2 decimal places).
 */
export const formatDisplay = (value: number): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
