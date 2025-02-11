export interface SIATransaction {
  OrderNumber: string
  BusinessDay: string
  CheckOpen: string
  CheckClose: string
  SalesType: string
  TransactionType: string
  Void: number
  VoidAmount: number
  Refund: number
  RefundAmount: number
  GuestCount: number
  GuestCountSenior: number
  GuestCountPWD: number
  GrossSalesAmount: number
  NetSalesAmount: number
  TotalTax: number
  OtherLocalTax: number
  TotalServiceCharge: number
  TotalTip: number
  TotalDiscount: number
  LessTaxAmount: number
  TotalExemptSales: number
  RegularOtherDiscountName: string
  RegularOtherDiscountAmount: number
  EmployeeDiscountAmount: number
  SeniorCitizenDiscountAmount: number
  VIPDiscountAmount: number
  PWDDiscountAmount: number
  NationalCoachAthleteMedalofValorDiscountamount: number
  SMACDiscountAmount: number
  OnlineDealsDiscountName: number
  OnlineDealsDiscountAmount: number
  DiscountField1Name: string
  DiscountField2Name: string
  DiscountField3Name: string
  DiscountField4Name: string
  DiscountField5Name: string
  DiscountField6Name: string
  DiscountField1Amount: number
  DiscountField2Amount: number
  DiscountField3Amount: number
  DiscountField4Amount: number
  DiscountField5Amount: number
  DiscountField6Amount: number
  PaymentType1: string
  PaymentAmount1: number
  PaymentType2: string
  PaymentAmount2: number
  PaymentType3: string
  PaymentAmount3: number
  TotalCashSalesAmount: number
  TotalGiftCertificateSalesAmount: number
  TotalDebitCardSalesAmount: number
  TotalEwalletOnlineSalesAmount: number
  TotalOtherTenderAmount: number
  TotalMastercardSalesAmount: number
  TotalVisaSalesAmount: number
  TotalAmericanExpressSalesAmount: number
  TotalDinersSalesAmount: number
  TotalJCBSalesAmount: number
  TotalCreditCardSalesAmount: number
  TerminalNumber: number
  SMPOSSerialNumber: string
}

export type SIATransactions = SIATransaction[]

export interface SIATransactionDetail {
  OrderNumber: string
  ItemId: string
  ItemName: string
  ItemParentCategory: string
  ItemCategory: string
  ItemSubCategory: string
  ItemQuantity: number
  TransactionItemPrice: number
  MenuItemPrice: number
  DiscountCode: string
  DiscountAmount: number
  Modifier1Name: string
  Modifier1Quantity: number
  Modifier2Name: string
  Modifier2Quantity: number
  Void: number
  VoidAmount: number
  Refund: number
  RefundAmount: number
}

export type SIATransactionDetails = SIATransactionDetail[]
