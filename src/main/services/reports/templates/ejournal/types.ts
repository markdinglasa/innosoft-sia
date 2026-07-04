export interface Sale {
  CollectionNumber: string
  ItemDescription: string
  Amount: number
  ItemDetails: string
  IsReturn: boolean
}

export interface CollectionMethod {
  CollectionNumber: string
  PayType: string
  Amount: number
}

export interface VATAnalysis {
  CollectionNumber: string
  GrossSales: number
  DiscountAmount: number
  ChangeAmount: number
  TaxAmount: number
  VATSales: number
  ServiceCharge: number
  VATExempt: number
  NetSales: number
  ZeroRated: number
  Tax: string
  Discount: string
}

export interface Details {
  CollectionNumber: string
  TransactionNumber: string
  ReturnNumber?: string
  SeniorCitizenId: string
  SeniorCitizenName: string
  SeniorCitizenAge: string
  SeniorCitizenChildName: string
  SeniorCitizenTINNumber: string
  SeniorCitizenChildBirthdate: string
  PaxNumber: string
  Terminal: string
  Customer: string
  CustomerTIN: string
  CustomerAddress: string
  IsReward: boolean
  PreparedBy: string
  ServedBy: string
  UpdatedBy?: string
  DateCreated: string
  TableCode: string
  BusinessStyle?: string
  Signature?: string
  IsReturn?: boolean
  IsCancelled?: boolean
  Terms?: string
}
