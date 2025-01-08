import { DailySale, SalesType } from '@shared/types'

export const MWDailySaleReportInitial = ({
  MallPartnerCodeId,
  Terminal,
  Date
}: {
  MallPartnerCodeId: string
  Terminal: number
  Date: string
}): DailySale => {
  return {
    MallPartnerCodeId: `${MallPartnerCodeId}`,
    Terminal: `${Terminal}`,
    Date: `${Date}`,
    OldAccumulatedTotal: 0,
    NewAccumulatedTotal: 0,
    GrossSalesAmount: 0,
    NonTaxSalesAmount: 0,
    GovMandatedDiscount: 0,
    OtherDiscount: 0,
    RefundAmount: 0,
    TaxAmount: 0,
    ServiceChargeAmount: 0,
    NetSalesAmount: 0,
    CashSales: 0,
    CreditDebitsales: 0,
    OtherPaymentSales: 0,
    VoidAmount: 0,
    CustomerCount: 0,
    ControlNumber: 0,
    NoSalesTransaction: 0,
    SalesType: SalesType.Food,
    NetSalesAmountPerSalesType: 0
  }
}
