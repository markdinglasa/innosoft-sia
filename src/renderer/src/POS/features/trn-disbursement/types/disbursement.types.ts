export enum DisbursementType {
  PETTY_CASH = 'Petty Cash',
  SUPPLIER_PAYMENT = 'Supplier Payment',
  EMPLOYEE_ADVANCE = 'Employee Advance',
  REFUND = 'Refund',
  OTHER = 'Other'
}

export interface CashDenominations {
  amount1000: number
  amount500: number
  amount200: number
  amount100: number
  amount50: number
  amount20: number
  amount10: number
  amount5: number
  amount1: number
  amount025: number
  amount010: number
  amount005: number
  amount001: number
}

export interface DisbursementFormData extends Partial<CashDenominations> {
  disbursementDate: string
  disbursementNumber: string
  disbursementType: DisbursementType
  amount: number
  payee: string
  remarks?: string
  accountId: number | string
  payTypeId: number | string
  preparedBy: number | string
  checkedBy: number | string
  approvedBy: number | string
  branchId?: number
  periodId?: number
  terminalId?: number
  isReturn: boolean
  stockInId?: number
}

