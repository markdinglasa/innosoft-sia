export interface RLCSalesEOD {
  TenantId: string
  Terminal: string
  GrossSales: number
  VATAmount: number
  VoidAmount: number
  VoidCount: number
  DiscountAmount: number
  DiscountCount: number
  RefundAmount: number
  RefundCount: number
  Adjustments: number // Senior Citizen Discount
  AdjustmentsCount: number
  ServiceCharge: number
  PreviousEOD: number
  PreviousReading: number
  CurrentEOD: number
  CurrentReading: number
  TransactionDate: string
  Novelty: number
  Misc: number
  LocalTax: number
  CreditSales: number
  CreditTax: number
  NonVATSales: number
  PharmaSales: number
  DisabilityDiscount: number // PWD
  GrossSalesFixed: number
  ReprintedAmount: number
  ReprintedCount: number
}
