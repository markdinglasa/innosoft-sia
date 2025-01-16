export enum SalesType {
  Food = '01',
  NonFood = '02',
  Groceries = '03',
  Medicines = '04',
  Other = '05'
}

export interface DailySale {
  MallPartnerCodeId: string //8 digits
  Terminal: string
  Date: string // MMDDYYYY
  OldAccumulatedTotal: number
  NewAccumulatedTotal: number
  GrossSalesAmount: number
  NonTaxSalesAmount: number
  GovMandatedDiscount: number //PWD, SCD, MOV, Athlete, Solo Parent, etc.
  OtherDiscount: number // variable, employee
  RefundAmount: number
  TaxAmount: number
  ServiceChargeAmount: number
  NetSalesAmount: number
  CashSales: number // total cash sales
  CreditDebitsales: number // total credit/debit sales
  OtherPaymentSales: number // other than CASH/CREDIT/DEBIT like gift checks, checks, credit memo, vouchers, online deals, rewards,
  VoidAmount: number
  CustomerCount: number
  ControlNumber: number
  NoSalesTransaction: number
  SalesType: SalesType
  NetSalesAmountPerSalesType: number
}
export type DailySales = DailySale[]

export interface DailyHourlySale {
  MallPartnerCodeId: string // 8 digits
  Terminal: string
  Date: string // MMDDYYYY
  HourCode: string
  NetSalesAmountHour: number // per hour
  NoSalesTransactionHour: number // per hour
  CustomerCountHour: number // per hour
  NetSalesAmountDay: number // EOD
  NoSalesTransactionDay: number // EOD
  CustomerCountDay: number // EOD
}
export type DailyHourlySales = DailyHourlySale[]

export interface DailyDiscount {
  DiscountCode: string
  DiscountDescription: string
  DiscountAmount: number // DiscountAmount =  DailySale.GovMandatedDiscount + DailySale.OtherDiscount
}

export enum MWFileType {
  DailySales = 'S',
  DailyHourlySales = 'H',
  DailyDiscount = 'D',
  ZReading = 'Z'
}
