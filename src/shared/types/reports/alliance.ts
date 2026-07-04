export interface AllianceId {
  tenantid: number
  key: string
  tmid: number
  doc: string
}

export interface AllianceSalesEOD {
  date: number
  zcounter: number
  previousnrgt: number
  nrgt: number // natural gas revenue tax = NRGT
  previoustax: number
  newtax: number
  previoustaxsale: number //
  newtaxsale: number //
  previousnotaxsale: number //
  newnotaxsale: number
  opentime: number //date without special char (YYYYMMDDHHMMSS)
  closetime: number // date w/o spcecial char
  gross: number //total gross sales
  vat: number // value added tax
  localtax: number // local tax
  amusement: number // amusement tax
  ewt: number //expanded withholding tax
  taxsale: number // total taxable sales
  notaxsale: number // non taxable sales
  zerosale: number // zero rated sales
  vatexempt: number // Value added tax exemption
  void: number // total voided amount
  voidcnt: number // number of voids COUNT(void)
  disc: number // total discount amount
  disccnt: number // number of discounts COUNT(discount)
  refund: number // total refund
  refundcnt: number // COUNT(refund)
  senior: number // total senior discount amount
  seniorcnt: number // COUNT(senior)
  pwd: number // total PWD discount amount
  pwdcnt: number // COUNT(pwd)
  diplomat: number // total diplomat discount amount
  diplomatcnt: number // COUNT(diplomat)
  nac: number      // total NAC discount amount
  naccnt: number   // count of NAC transactions
  spd: number      // total SPD discount amount
  spdcnt: number   // count of SPD transactions
  service: number // total service charge amount
  servicecnt: number // COUNT(service)
  receiptstart: number // receipt's starting number
  receiptend: number // receipt's ending number
  trxcnt: number // COUNT(transactions)
  cash: number // total cash amount
  cashcnt: number // COUNT(cash)
  credit: number // total credit amount
  creditcnt: number // COUNT(credit)
  charge: number // total charge amount
  chargecnt: number // COUNT(charge)
  giftcheck: number // total gift check amount
  giftcheckcnt: number // COUNT(giftcheck)
  othertender: number // total other type amount //all other pay type
  othertendercnt: number // CONUNT(othertender)
}
export interface AllianceSalesTrxline {
  sku: string // barcode
  qty: number
  unitprice: number
  disc: number
  senior: number
  pwd: number
  diplomat: number
  nac: number    // National Athletes/Coaches discount amount
  spd: number    // Solo Parent discount amount
  taxtype: string
  tax: number
  memo: string // MstItem.Remarks
  total: number // qty * unitprice
}
export interface AllianceSalesTrx {
  receiptno: number
  void: number // 1 voided 0 not-voided
  cash: number
  credit: number
  charge: number
  giftcheck: number
  othertender: number
  linedisc: number // total trx discount amount
  linesenior: number // total trx senior discount amount
  evat: number // expanded value added tax
  linepwd: number //
  linediplomat: number
  subtotal: number // total of all line discounts
  disc: number
  senior: number
  pwd: number
  diplomat: number
  nac: number    // transaction-level NAC total discount
  spd: number    // transaction-level SPD total discount
  vat: number
  exvat: number
  incvat: number
  localtax: number
  amusement: number
  ewt: number
  service: number
  taxsale: number
  notaxsale: number
  taxexsale: number //exclusive tax sales
  taxincsale: number // inclusive tax sales
  zerosale: number // zero rated sales
  vatexempt: number
  customercnt: number
  gross: number
  refund: number
  taxrate: number
  posted: number // YYYYMMDDHHMMSS
  qty: number
  created: number // default = 1
  memo: string // set as remarks ON TrnSales.Remarks
  line: AllianceSalesTrxline
  lines: AllianceSalesTrxline[]
  choicetype: string // leave as blank
}
export interface AllianceSalesProduct {
  sku: string // barcode
  name: string // item description
  inventory: number
  price: number
  category: string
}
export interface XMLData {
  id: AllianceId
  sales: AllianceSalesEOD
  master: AllianceSalesProduct
}
export enum AllianceType {
  salesEOD = 'sales',
  onlineSalesPREEOD = 'sales_preeod'
}
