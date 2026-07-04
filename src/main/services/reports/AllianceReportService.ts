import { Error, Success } from '@shared/messages'
import {
  AllianceSalesEOD,
  AllianceSalesProduct,
  AllianceSalesTrx,
  AllianceSalesTrxline,
  AllianceType,
  Response
} from '@shared/types'
import { format } from 'date-fns'
import fs from 'fs'
import paths from 'path'
import { MstItemEntity } from '../../entities/masterfiles/MstItem.entity'
import { TrnCollectionEntity } from '../../entities/transactions/TrnCollection.entity'
import { TrnPaxTableEntity } from '../../entities/transactions/TrnPaxTable.entity'
import { TrnSalesEntity } from '../../entities/transactions/TrnSales.entity'
import { TrnSalesLineEntity } from '../../entities/transactions/TrnSalesLine.entity'
import {
  formatDateDash,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDHHMMSS,
  generateAllianceFilename
} from '../../functions'
import { AppDataSource } from '../../typeORM/configurations'
import { DbCapabilities, isReturnedExpr } from '../../typeORM/db-capabilities'
import { formatNumber } from '../../utils/format'

export class AllianceReportService {
  /**
   * Get Control Number (Z-Counter) for Alliance
   */
  static async getControlNumber(terminalId: number, dates: string): Promise<number> {
    const formattedDate = format(new Date(dates), 'yyyy-MM-dd')
    const qb = AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .select('CAST(collection.collectionDate AS DATE)', 'SalesDate')
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) <= :dates', { dates: formattedDate })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('collection.amount > 0')
      .groupBy('CAST(collection.collectionDate AS DATE)')

    if (DbCapabilities.hasIsReturned) {
      qb.andWhere('(collection.isReturned IS NULL OR collection.isReturned = 0)')
    }

    const collections = await qb.getRawMany()

    return collections.length
  }

  /**
   * Get Previous Amounts for Alliance
   */
  static async getPreviousAmounts(terminalId: number, dates: string) {
    const formattedDate = format(new Date(dates), 'yyyy-MM-dd')
    const result = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoin('collection.sales', 'sales')
      .leftJoin('sales.salesLines', 'salesLine')
      .leftJoin('salesLine.discount', 'discount')
      .select(
        `SUM(ROUND(CASE WHEN collection.isCancelled = 0 AND COALESCE(${isReturnedExpr()}, 0) = 0 THEN salesLine.amount ELSE 0 END, 2))`,
        'PreviousReading'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN salesLine.taxRate > 0 AND COALESCE(${isReturnedExpr()}, 0) = 0 AND sales.isCancelled = 0 AND collection.isCancelled = 0 THEN salesLine.taxAmount ELSE 0 END, 2))`,
        'previoustax'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN COALESCE(${isReturnedExpr()}, 0) = 0 AND sales.isCancelled = 0 AND collection.isCancelled = 0 AND salesLine.taxAmount > 0 THEN salesLine.amount - salesLine.taxAmount ELSE 0 END, 2))`,
        'previoustaxsale'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN COALESCE(${isReturnedExpr()}, 0) = 0 AND sales.isCancelled = 0 AND collection.isCancelled = 0 AND salesLine.taxAmount < 1 AND discount.id <> 4 AND discount.id <> 3 THEN salesLine.amount ELSE 0 END, 2))`,
        'previousnotaxsale'
      )
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) < :dates', { dates: formattedDate })
      .getRawOne()

    return {
      PreviousReading: Number(result?.PreviousReading || 0),
      previoustax: Number(result?.previoustax || 0),
      previoustaxsale: Number(result?.previoustaxsale || 0),
      previousnotaxsale: Number(result?.previousnotaxsale || 0)
    }
  }

  /**
   * Get Master Products list
   */
  static async getMasterProducts(
    terminalId: number,
    dates: string
  ): Promise<AllianceSalesProduct[]> {
    const formattedDate = format(new Date(dates), 'yyyy-MM-dd')
    const result = await AppDataSource.getRepository(TrnSalesEntity)
      .createQueryBuilder('sales')
      .leftJoin('sales.salesLines', 'salesLine')
      .innerJoin(MstItemEntity, 'item', 'item.id = salesLine.itemId AND salesLine.itemId <> 1')
      .select("COALESCE(item.barCode, 'NA')", 'sku')
      .addSelect("COALESCE(item.alias, 'NA')", 'name')
      .addSelect('CASE WHEN COALESCE(item.isInventory, 0) = 0 THEN 0 ELSE 1 END', 'inventory')
      .addSelect('COALESCE(item.price, 0)', 'price')
      .addSelect("'01'", 'category')
      .where('sales.terminalId = :terminalId', { terminalId })
      .andWhere('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('sales.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('sales.isReturn IS NULL OR sales.isReturn = 0')
      .andWhere('CAST(sales.salesDate AS DATE) = :dates', { dates: formattedDate })
      .groupBy('item.id')
      .addGroupBy('item.alias')
      .addGroupBy('item.barCode')
      .addGroupBy('item.isInventory')
      .addGroupBy('item.price')
      .getRawMany()

    return result.map((row) => ({
      sku: row.sku,
      name: row.name,
      inventory: Number(row.inventory),
      price: Number(row.price),
      category: row.category
    }))
  }

  /**
   * Get Sales EOD Summary
   */
  static async getSalesEODSummary(
    terminalId: number,
    dates: string,
    prevReading: any,
    controlNumber: number
  ): Promise<AllianceSalesEOD | null> {
    const formattedDate = format(new Date(dates), 'yyyy-MM-dd')

    // Fetch aggregates
    const result = await AppDataSource.getRepository(TrnSalesEntity)
      .createQueryBuilder('sales')
      .leftJoin('sales.salesLines', 'salesLine')
      .leftJoin('sales.collections', 'collection')
      .leftJoin('salesLine.discount', 'discount')
      .leftJoin('salesLine.tax', 'tax')
      .select(
        "MIN(REPLACE(CONVERT(varchar, sales.salesDate, 23), '-', '') + REPLACE(CONVERT(varchar, salesLine.salesLineTimeStamp, 8), ':', ''))",
        'date'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN collection.isCancelled = 0 AND COALESCE(${isReturnedExpr()}, 0) = 0 THEN salesLine.amount ELSE 0 END, 2))`,
        'gross'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN salesLine.taxRate > 0 AND COALESCE(${isReturnedExpr()}, 0) = 0 AND sales.isCancelled = 0 THEN salesLine.taxAmount ELSE 0 END, 2))`,
        'vat'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN salesLine.taxRate > 0 AND COALESCE(${isReturnedExpr()}, 0) = 0 AND sales.isCancelled = 0 AND tax.tax = 'LOCAL TAX' THEN salesLine.taxAmount ELSE 0 END, 2))`,
        'localtax'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN salesLine.taxRate > 0 AND COALESCE(${isReturnedExpr()}, 0) = 0 AND sales.isCancelled = 0 AND tax.tax = 'AMUSEMENT TAX' THEN salesLine.taxAmount ELSE 0 END, 2))`,
        'amusement'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN COALESCE(${isReturnedExpr()}, 0) = 0 AND sales.isCancelled = 0 AND discount.discount <> 'Senior Citizen Discount' AND discount.discount <> 'PWD' AND COALESCE(salesLine.taxAmount, 0) > 0 THEN salesLine.amount ELSE 0 END, 2))`,
        'taxsale'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN COALESCE(${isReturnedExpr()}, 0) = 0 AND sales.isCancelled = 0 AND COALESCE(salesLine.taxAmount, 0) < 1 AND salesLine.itemId <> 1 THEN salesLine.amount ELSE 0 END, 2))`,
        'notaxsale'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN salesLine.price2 > 0 AND COALESCE(${isReturnedExpr()}, 0) = 0 AND sales.isCancelled = 0 THEN salesLine.quantity * (salesLine.price2LessTax - (salesLine.price2LessTax * (salesLine.discountRate / 100))) ELSE CASE WHEN salesLine.taxId = 5 THEN salesLine.amount ELSE 0 END END, 2))`,
        'vatexempt'
      )
      .addSelect(
        'SUM(ROUND(CASE WHEN sales.isCancelled = 1 THEN salesLine.amount ELSE 0 END, 3))',
        'void'
      )
      .addSelect(
        'COUNT(DISTINCT CASE WHEN sales.isCancelled = 1 THEN salesLine.amount ELSE null END)',
        'voidcnt'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND COALESCE(salesLine.discountAmount, 0) > 0 AND discount.discount NOT IN ('Senior Citizen Discount', 'PWD') THEN salesLine.discountAmount * salesLine.quantity ELSE 0 END)`,
        'disc'
      )
      .addSelect(
        `COUNT(DISTINCT CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND salesLine.discountAmount > 0 AND discount.discount NOT IN ('Senior Citizen Discount', 'PWD') THEN sales.id ELSE null END)`,
        'disccnt'
      )
      .addSelect(
        `SUM(ROUND(CASE WHEN sales.isCancelled = 0 AND COALESCE(${isReturnedExpr()}, 0) = 2 THEN salesLine.amount ELSE 0 END, 2))`,
        'refund'
      )
      .addSelect(
        `COUNT(CASE WHEN sales.isCancelled = 0 AND COALESCE(${isReturnedExpr()}, 0) = 2 THEN salesLine.amount ELSE null END)`,
        'refundcnt'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount = 'Senior Citizen Discount' THEN salesLine.discountAmount * salesLine.quantity ELSE 0 END)`,
        'senior'
      )
      .addSelect(
        `COUNT(DISTINCT CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount = 'Senior Citizen Discount' THEN sales.id ELSE null END)`,
        'seniorcnt'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount = 'PWD' THEN salesLine.discountAmount * salesLine.quantity ELSE 0 END)`,
        'pwd'
      )
      .addSelect(
        `COUNT(DISTINCT CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount = 'PWD' THEN sales.id ELSE null END)`,
        'pwdcnt'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount = 'Diplomat Discount' THEN salesLine.discountAmount * salesLine.quantity ELSE 0 END)`,
        'diplomat'
      )
      .addSelect(
        `COUNT(CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount = 'Diplomat Discount' THEN sales.id ELSE null END)`,
        'diplomatcnt'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND (discount.discount LIKE '%National Athlete%' OR discount.discount LIKE '%Coach%') THEN ROUND(salesLine.discountAmount * salesLine.quantity, 2) ELSE 0 END)`,
        'nac'
      )
      .addSelect(
        `COUNT(DISTINCT CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND (discount.discount LIKE '%National Athlete%' OR discount.discount LIKE '%Coach%') THEN sales.id ELSE null END)`,
        'naccnt'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount LIKE '%Solo Parent%' THEN ROUND(salesLine.discountAmount * salesLine.quantity, 2) ELSE 0 END)`,
        'spd'
      )
      .addSelect(
        `COUNT(DISTINCT CASE WHEN (COALESCE(${isReturnedExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount LIKE '%Solo Parent%' THEN sales.id ELSE null END)`,
        'spdcnt'
      )
      .addSelect("MIN(REPLACE(collection.collectionNumber, '-', ''))", 'receiptstart')
      .addSelect("MAX(REPLACE(collection.collectionNumber, '-', ''))", 'receiptend')
      .addSelect('COUNT(DISTINCT sales.id)', 'trxcnt')
      .addSelect('MIN(collection.collectionDate)', 'opentime')
      .addSelect('MAX(collection.collectionDate)', 'closetime')
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    if (!result?.trxcnt) return null

    // Get payment aggregates
    const payments = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoin('collection.collectionLines', 'collectionLine')
      .leftJoin('collectionLine.payType', 'payType')
      .select(
        "SUM(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType = 'Cash') THEN CASE WHEN collectionLine.amount > collection.amount THEN collection.amount ELSE collectionLine.amount END ELSE 0 END)",
        'cash'
      )
      .addSelect(
        "COUNT(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType = 'Cash') THEN CASE WHEN collectionLine.amount > collection.amount THEN collection.amount ELSE collectionLine.amount END ELSE null END)",
        'cashcnt'
      )
      .addSelect(
        "SUM(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType = 'Credit Card') THEN collectionLine.amount ELSE 0 END)",
        'credit'
      )
      .addSelect(
        "COUNT(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType = 'Credit Card') THEN collectionLine.amount ELSE null END)",
        'creditcnt'
      )
      .addSelect(
        "SUM(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType = 'Charge') THEN collectionLine.amount ELSE 0 END)",
        'charge'
      )
      .addSelect(
        "COUNT(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType = 'Charge') THEN collectionLine.amount ELSE null END)",
        'chargecnt'
      )
      .addSelect(
        "SUM(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType = 'Gift Certificate') THEN collectionLine.amount ELSE 0 END)",
        'giftcheck'
      )
      .addSelect(
        "COUNT(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType = 'Gift Certificate') THEN collectionLine.amount ELSE null END)",
        'giftcheckcnt'
      )
      .addSelect(
        "SUM(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType NOT IN ('Credit Card', 'Cash', 'Gift Certificate', 'Charge')) THEN collectionLine.amount ELSE 0 END)",
        'othertender'
      )
      .addSelect(
        "COUNT(CASE WHEN collection.isCancelled = 0 AND (collectionLine.payTypeId = payType.id AND payType.payType NOT IN ('Credit Card', 'Cash', 'Gift Certificate', 'Charge')) THEN collectionLine.amount ELSE null END)",
        'othertendercnt'
      )
      .where('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    // Get service charge
    const service = await AppDataSource.getRepository(TrnSalesLineEntity)
      .createQueryBuilder('salesLine')
      .leftJoin('salesLine.sales', 'sales')
      .leftJoin('sales.collections', 'collection')
      .select('SUM(salesLine.amount)', 'ServiceCharge')
      .addSelect('COUNT(salesLine.amount)', 'ServiceChargeCount')
      .where('salesLine.itemId = 1')
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    const grossVal = Number(result?.gross || 0)
    const vatVal = Number(result?.vat || 0)
    const localtaxVal = Number(result?.localtax || 0)
    const amusementVal = Number(result?.amusement || 0)
    const taxsaleVal = Number(result?.taxsale || 0)
    const notaxsaleVal = Number(result?.notaxsale || 0)
    const voidVal = Number(result?.void || 0)
    const refundVal = Number(result?.refund || 0)
    const seniorVal = Number(result?.senior || 0)
    const pwdVal = Number(result?.pwd || 0)
    const diplomatVal = Number(result?.diplomat || 0)
    const nacVal = Number(result?.nac || 0)
    const spdVal = Number(result?.spd || 0)
    const discVal = Number(result?.disc || 0)
    const vatexemptVal = Number(result?.vatexempt || 0)

    const previousnrgt = prevReading.PreviousReading
    const nrgt = previousnrgt + grossVal

    return {
      date: result?.date || '',
      zcounter: String(controlNumber),
      previousnrgt: previousnrgt,
      nrgt: nrgt,
      previoustax: prevReading.previoustax,
      newtax: prevReading.previoustax + vatVal,
      previoustaxsale: prevReading.previoustaxsale,
      newtaxsale: prevReading.previoustaxsale + taxsaleVal,
      previousnotaxsale: prevReading.previousnotaxsale,
      newnotaxsale: prevReading.previousnotaxsale + notaxsaleVal,
      opentime: result?.opentime || '',
      closetime: result?.closetime || '',
      gross: grossVal,
      vat: vatVal,
      localtax: localtaxVal,
      amusement: amusementVal,
      ewt: 0,
      taxsale: taxsaleVal,
      notaxsale: notaxsaleVal,
      zerosale: 0,
      vatexempt: vatexemptVal,
      void: voidVal,
      voidcnt: Number(result?.voidcnt || 0),
      disc: discVal,
      disccnt: Number(result?.disccnt || 0),
      refund: refundVal,
      refundcnt: Number(result?.refundcnt || 0),
      senior: seniorVal,
      seniorcnt: Number(result?.seniorcnt || 0),
      pwd: pwdVal,
      pwdcnt: Number(result?.pwdcnt || 0),
      diplomat: diplomatVal,
      diplomatcnt: Number(result?.diplomatcnt || 0),
      nac: nacVal,
      naccnt: Number(result?.naccnt || 0),
      spd: spdVal,
      spdcnt: Number(result?.spdcnt || 0),
      service: Number(service?.ServiceCharge || 0),
      servicecnt: Number(service?.ServiceChargeCount || 0),
      receiptstart: result?.receiptstart || 'NA',
      receiptend: result?.receiptend || 'NA',
      trxcnt: Number(result?.trxcnt || 0),
      cash: Number(payments?.cash || 0),
      cashcnt: Number(payments?.cashcnt || 0),
      credit: Number(payments?.credit || 0),
      creditcnt: Number(payments?.creditcnt || 0),
      charge: Number(payments?.charge || 0),
      chargecnt: Number(payments?.chargecnt || 0),
      giftcheck: Number(payments?.giftcheck || 0),
      giftcheckcnt: Number(payments?.giftcheckcnt || 0),
      othertender: Number(payments?.othertender || 0),
      othertendercnt: Number(payments?.othertendercnt || 0)
    } as any
  }

  /**
   * Get Transactions (List of sales in EOD)
   */

  // SONARQUBE ISSUE: Refactor this function to reduce its Cognitive Complexity from 113 to the 15 allowed.
  static async getTransactionList(terminalId: number, dates: string): Promise<AllianceSalesTrx[]> {
    const formattedDate = format(new Date(dates), 'yyyy-MM-dd')

    // Find locked sales on this terminal for date
    const sales = await AppDataSource.getRepository(TrnSalesEntity)
      .createQueryBuilder('sales')
      .leftJoinAndSelect('sales.salesLines', 'salesLine')
      .leftJoinAndSelect('salesLine.item', 'item')
      .leftJoinAndSelect('salesLine.discount', 'discount')
      .leftJoinAndSelect('salesLine.tax', 'tax')
      .leftJoinAndSelect('sales.collections', 'collection')
      .leftJoinAndSelect('collection.collectionLines', 'collectionLine')
      .leftJoinAndSelect('collectionLine.payType', 'payType')
      .leftJoinAndSelect('sales.customer', 'customer')
      .where('sales.terminalId = :terminalId', { terminalId })
      .andWhere('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('CAST(sales.salesDate AS DATE) = :dates', { dates: formattedDate })
      .getMany()

    const list: AllianceSalesTrx[] = []

    for (const s of sales) {
      // Loop over collections since a receipt corresponds to a collection
      for (const c of s.collections || []) {
        const receiptno = (c.collectionNumber || '').replaceAll('-', '')

        // Sum payment types
        let cash = 0
        let credit = 0
        let charge = 0
        let giftcheck = 0
        let othertender = 0

        for (const cl of c.collectionLines || []) {
          const payType = cl.payType?.payType || ''
          const amt = Number(cl.amount || 0)
          if (!c.isCancelled && (c.isReturned ?? 0) === 0) {
            if (payType === 'Cash') {
              cash += Math.min(amt, Number(c.amount))
            } else if (payType === 'Credit Card') {
              credit += amt
            } else if (payType === 'Charge') {
              charge += amt
            } else if (payType === 'Gift Certificate') {
              giftcheck += amt
            } else {
              othertender += amt
            }
          }
        }

        // Sum lines details
        let voidAmt = s.isCancelled ? Number(s.amount || 0) : 0
        let subtotal = 0

        // Sum VAT details
        let vat = 0
        let localtax = 0
        let amusement = 0
        let taxsale = 0
        let notaxsale = 0
        let taxincsale = 0
        let vatexempt = 0
        let totalQty = 0

        // Sum discount details
        let linesenior = 0
        let linepwd = 0
        let linediplomat = 0
        let linenac = 0
        let linespd = 0
        let totalDiscount = 0

        // Service charge
        let service = 0

        // Map items for XML output inside this loop to guarantee they match the exact calculations
        const trxLines: any[] = []

        for (const sl of s.salesLines || []) {
          totalQty += Number(sl.quantity || 0)

          if (sl.itemId === 1) {
            service += Number(sl.amount || 0)
            continue
          }

          let lineTaxAmount = Number(sl.taxAmount || 0)

          if (!c.isCancelled && (c.isReturned ?? 0) === 0) {
            if (sl.taxRate > 0) {
              vat += lineTaxAmount
              if (sl.tax?.tax === 'LOCAL TAX') {
                localtax += lineTaxAmount
              } else if (sl.tax?.tax === 'AMUSEMENT TAX') {
                amusement += lineTaxAmount
              }
            }

            if (lineTaxAmount > 0) {
              taxsale += Number(sl.amount || 0)
              if (!c.isCancelled) {
                taxincsale += Number(sl.amount || 0)
              }
            } else if (sl.itemId !== 1) {
              // no tax
              notaxsale += Number(sl.amount || 0)
            }

            if (sl.price2 > 0 && !s.isCancelled) {
              vatexempt +=
                Number(sl.quantity) *
                (Number(sl.price2LessTax) -
                  Number(sl.price2LessTax) * (Number(sl.discountRate) / 100))
            } else if (sl.taxId === 5) {
              vatexempt += Number(sl.amount || 0)
            }

            // Discount computation
            const discName = sl.discount?.discount || ''
            const discAmt = Number(sl.discountAmount || 0) * Number(sl.quantity || 0)
            if (discAmt > 0) {
              if (discName === 'Senior Citizen Discount') {
                linesenior += discAmt
              } else if (discName === 'PWD') {
                linepwd += discAmt
              } else if (discName === 'Diplomat Discount') {
                linediplomat += discAmt
              } else if (discName.includes('National Athlete') || discName.includes('Coach')) {
                linenac += discAmt
              } else if (discName.includes('Solo Parent')) {
                linespd += discAmt
              }
              if (discName !== 'Senior Citizen Discount' && discName !== 'PWD') {
                totalDiscount += discAmt
              }
            }
            
            // Add to subtotal (excluding service charge which is itemId === 1)
            if (sl.itemId !== 1) {
              subtotal += Number(sl.amount || 0)
            }
          }

          // Generate lines for XML
          const qty = Number(sl.quantity || 0)
          const discAmt = Number(sl.discountAmount || 0) * qty
          
          let senior = 0
          let pwd = 0
          let diplomat = 0
          let nac = 0
          let spd = 0

          const discName = sl.discount?.discount || ''
          if (discAmt > 0) {
            if (discName === 'Senior Citizen Discount') {
              senior = discAmt
            } else if (discName === 'PWD') {
              pwd = discAmt
            } else if (discName === 'Diplomat Discount') {
              diplomat = discAmt
            } else if (discName.includes('National Athlete') || discName.includes('Coach')) {
              nac = discAmt
            } else if (discName.includes('Solo Parent')) {
              spd = discAmt
            }
          }

          trxLines.push({
            sku: (sl.item?.barCode || 'NA').replaceAll('&', ' '),
            qty,
            unitprice: Number(sl.price || 0),
            disc: discAmt,
            senior,
            pwd,
            diplomat,
            nac,
            spd,
            taxtype: lineTaxAmount > 0 ? '0' : '2',
            tax: lineTaxAmount,
            memo: s.remarks || 'NA',
            total: Number(sl.amount || 0)
          })
        }

        // Get total pax
        const paxResult = await AppDataSource.getRepository(TrnPaxTableEntity)
          .createQueryBuilder('pax')
          .select('MAX(pax.totalPax)', 'TotalPax')
          .where('pax.saleId = :saleId', { saleId: s.id })
          .getRawOne()
        const customercnt = Number(paxResult?.TotalPax || 1)

        // Gross calculation
        let gross = 0
        if (!s.isCancelled && (s.isReturn === null || s.isReturn === 0)) {
          gross = Number(c.amount || 0)
        }

        // Refund
        let refund = s.isReturn === 2 ? Number(s.amount || 0) : 0

        // Tax rate
        let taxrate = 0
        for (const sl of s.salesLines || []) {
          if (
            !c.isCancelled &&
            (c.isReturned ?? 0) === 0 &&
            sl.discount?.discount !== 'Senior Citizen Discount' &&
            sl.discount?.discount !== 'PWD'
          ) {
            if (sl.taxRate > taxrate) {
              taxrate = Number(sl.taxRate)
            }
          }
        }

        // Posted timestamp
        let posted = format(new Date(s.salesDate), 'yyyyMMdd')
        if (s.salesLines && s.salesLines.length > 0) {
          posted += format(new Date(s.salesLines[0].salesLineTimeStamp), 'HHmmss')
        } else {
          posted += '000000'
        }

        list.push({
          receiptno,
          void: voidAmt,
          cash,
          credit,
          charge,
          giftcheck,
          othertender,
          evat: 0,
          subtotal,
          vat,
          exvat: 0,
          incvat: vat,
          localtax,
          amusement,
          nac: linenac,
          spd: linespd,
          ewt: 0,
          service,
          taxsale,
          notaxsale,
          taxexsale: 0,
          taxincsale,
          zerosale: 0,
          vatexempt,
          customercnt,
          gross,
          refund,
          taxrate,
          posted,
          qty: totalQty,
          created: 1,
          memo: s.remarks || 'NA',
          linedisc: totalDiscount,
          linesenior,
          linepwd,
          linediplomat,
          lines: trxLines
        } as any)
      }
    }

    return list
  }

  /**
   * Get Product lines for a single transaction (receiptno)
   */
  static async getProductLines(
    terminalId: number,
    dates: string,
    receiptNo: string
  ): Promise<AllianceSalesTrxline[]> {
    const formattedDate = format(new Date(dates), 'yyyy-MM-dd')

    // Find the sale and collection
    const collection = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.sales', 'sales')
      .leftJoinAndSelect('sales.salesLines', 'salesLine')
      .leftJoinAndSelect('salesLine.item', 'item')
      .leftJoinAndSelect('salesLine.discount', 'discount')
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('sales.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('sales.isReturn IS NULL OR sales.isReturn = 0')
      .andWhere("REPLACE(collection.collectionNumber, '-', '') = :receiptNo", { receiptNo })
      .andWhere('CAST(sales.salesDate AS DATE) = :dates', { dates: formattedDate })
      .getOne()

    if (!collection?.sales?.salesLines) return []

    const list: AllianceSalesTrxline[] = []

    for (const sl of collection.sales.salesLines) {
      if (sl.itemId === 1) continue // Skip service charge line item

      const sku = (sl.item?.barCode || 'NA').replaceAll('&', ' ')
      const qty = Number(sl.quantity || 0)
      const unitprice = Number(sl.price || 0)
      const discAmt = Number(sl.discountAmount || 0) * qty

      let senior = 0
      let pwd = 0
      let diplomat = 0
      let nac = 0
      let spd = 0

      const discName = sl.discount?.discount || ''
      if (discAmt > 0) {
        if (discName === 'Senior Citizen Discount') {
          senior = discAmt
        } else if (discName === 'PWD') {
          pwd = discAmt
        } else if (discName === 'Diplomat Discount') {
          diplomat = discAmt
        } else if (discName.includes('National Athlete') || discName.includes('Coach')) {
          nac = discAmt
        } else if (discName.includes('Solo Parent')) {
          spd = discAmt
        }
      }

      const tax = Number(sl.taxAmount || 0)
      const total = Number(sl.amount || 0)

      list.push({
        sku,
        qty,
        unitprice,
        disc: discAmt,
        senior,
        pwd,
        diplomat,
        nac,
        spd,
        taxtype: tax > 0 ? '0' : '2',
        tax,
        memo: collection.sales.remarks || 'NA',
        total
      })
    }

    return list
  }

  /**
   * Main orchestrator to generate Sales EOD XML Report
   */
  static async generateSalesEOD(
    path: string,
    dates: string,
    category: string,
    data: { Terminal: number; TenantCode: string; POSKey: string }
  ): Promise<Response> {
    try {
      const Terminal = data?.Terminal ?? 0
      const Dates = formatDateDash(new Date(dates ?? new Date()))

      // 1. Get Control Number
      const controlNumber = await this.getControlNumber(Terminal, Dates)

      // 2. Get Previous Amounts
      const prevReading = await this.getPreviousAmounts(Terminal, Dates)

      // 3. Get Sales EOD Summary
      const summary = await this.getSalesEODSummary(Terminal, Dates, prevReading, controlNumber)

      // 4. Get Master Products
      const products = await this.getMasterProducts(Terminal, Dates)

      // 5. Get Transaction list
      const transactions = await this.getTransactionList(Terminal, Dates)

      const fileName = generateAllianceFilename(
        AllianceType.salesEOD,
        data.TenantCode,
        data.Terminal,
        controlNumber,
        dates
      )
      const filePath = paths.join(path, `${fileName}`)

      // Format identity tags
      const SalesId = `
      <id>
        <tenantid>${data.TenantCode ?? 'NA'}</tenantid>
        <key>${data.POSKey ?? 'NA'}</key>
        <tmid>${data.Terminal.toString().padStart(4, '0') ?? 1}</tmid>
        <doc>SALES_EOD</doc>
      </id>
      `

      // Format Master Products list
      const Master = products
        .map((item) => {
          return [
            `<product>
              <sku>${item?.sku ?? 0}</sku>
              <name>${item?.name ?? 'NA'}</name>
              <inventory>${item?.inventory ?? 0}</inventory>
              <price>${Number(item?.price ?? 0).toFixed(2)}</price>
              <category>${category ?? '01'}</category>
            </product>`
          ].join('\n')
        })
        .join('\n')

      let salesXml = ''
      if (summary) {
        salesXml = [
          `<date>${formatDateYYYYMMDD(new Date(dates)) ?? ''}</date>`,
          `<zcounter>${summary.zcounter ?? '0'}</zcounter>`,
          `<previousnrgt>${formatNumber(summary.previousnrgt)}</previousnrgt>`,
          `<nrgt>${formatNumber(summary.nrgt)}</nrgt>`,
          `<previoustax>${formatNumber(summary.previoustax)}</previoustax>`,
          `<newtax>${formatNumber(summary.newtax)}</newtax>`,
          `<previoustaxsale>${formatNumber(summary.previoustaxsale)}</previoustaxsale>`,
          `<newtaxsale>${formatNumber(summary.newtaxsale)}</newtaxsale>`,
          `<previousnotaxsale>${formatNumber(summary.previousnotaxsale)}</previousnotaxsale>`,
          `<newnotaxsale>${formatNumber(summary.newnotaxsale)}</newnotaxsale>`,
          `<opentime>${formatDateYYYYMMDDHHMMSS(new Date(summary.opentime))}</opentime>`,
          `<closetime>${formatDateYYYYMMDDHHMMSS(new Date(summary.closetime))}</closetime>`,
          `<gross>${formatNumber(summary.gross)}</gross>`,
          `<vat>${formatNumber(summary.vat)}</vat>`,
          `<localtax>${formatNumber(summary.localtax)}</localtax>`,
          `<amusement>${formatNumber(summary.amusement)}</amusement>`,
          `<ewt>${formatNumber(summary.ewt)}</ewt>`,
          `<taxsale>${formatNumber(summary.taxsale)}</taxsale>`,
          `<notaxsale>${formatNumber(summary.notaxsale)}</notaxsale>`,
          `<zerosale>${formatNumber(summary.zerosale)}</zerosale>`,
          `<void>${formatNumber(summary.void)}</void>`,
          `<voidcnt>${Number(summary.voidcnt)}</voidcnt>`,
          `<disc>${formatNumber(summary.disc)}</disc>`,
          `<disccnt>${Number(summary.disccnt)}</disccnt>`,
          `<refund>${formatNumber(summary.refund)}</refund>`,
          `<refundcnt>${Number(summary.refundcnt)}</refundcnt>`,
          `<senior>${formatNumber(summary.senior)}</senior>`,
          `<seniorcnt>${Number(summary.seniorcnt)}</seniorcnt>`,
          `<pwd>${formatNumber(summary.pwd)}</pwd>`,
          `<pwdcnt>${Number(summary.pwdcnt)}</pwdcnt>`,
          `<diplomat>${formatNumber(summary.diplomat)}</diplomat>`,
          `<diplomatcnt>${Number(summary.diplomatcnt)}</diplomatcnt>`,
          `<nac>${formatNumber(summary.nac ?? 0)}</nac>`,
          `<naccnt>${Number(summary.naccnt ?? 0)}</naccnt>`,
          `<spd>${formatNumber(summary.spd ?? 0)}</spd>`,
          `<spdcnt>${Number(summary.spdcnt ?? 0)}</spdcnt>`,
          `<service>${formatNumber(summary.service)}</service>`,
          `<servicecnt>${Number(summary.servicecnt)}</servicecnt>`,
          `<receiptstart>${summary.receiptstart ?? 'NA'}</receiptstart>`,
          `<receiptend>${summary.receiptend ?? 'NA'}</receiptend>`,
          `<trxcnt>${Number(summary.trxcnt)}</trxcnt>`,
          `<cash>${formatNumber(summary.cash)}</cash>`,
          `<cashcnt>${Number(summary.cashcnt)}</cashcnt>`,
          `<credit>${formatNumber(summary.credit)}</credit>`,
          `<creditcnt>${Number(summary.creditcnt)}</creditcnt>`,
          `<charge>${formatNumber(summary.charge)}</charge>`,
          `<chargecnt>${Number(summary.chargecnt)}</chargecnt>`,
          `<giftcheck>${formatNumber(summary.giftcheck)}</giftcheck>`,
          `<giftcheckcnt>${Number(summary.giftcheckcnt)}</giftcheckcnt>`,
          `<othertender>${formatNumber(summary.othertender)}</othertender>`,
          `<othertendercnt>${Number(summary.othertendercnt)}</othertendercnt>`
        ].join('\n')
      } else {
        // No Sales fallback
        salesXml = [
          `<date>${formatDateYYYYMMDD(new Date(Dates))}</date>`,
          `<zcounter>${controlNumber}</zcounter>`,
          `<previousnrgt>${Number(prevReading.PreviousReading).toFixed(2) ?? '0.00'}</previousnrgt>`,
          `<nrgt>${Number(prevReading.PreviousReading).toFixed(2) ?? '0.00'}</nrgt>`,
          `<previoustax>${Number(prevReading.previoustax).toFixed(2) ?? '0.00'}</previoustax>`,
          `<newtax>${Number(prevReading.previoustax).toFixed(2) ?? '0.00'}</newtax>`,
          `<previoustaxsale>${Number(prevReading.previoustaxsale).toFixed(2) ?? '0.00'}</previoustaxsale>`,
          `<newtaxsale>${Number(prevReading.previoustaxsale).toFixed(2) ?? '0.00'}</newtaxsale>`,
          `<previousnotaxsale>${Number(prevReading.previousnotaxsale).toFixed(2) ?? '0.00'}</previousnotaxsale>`,
          `<newnotaxsale>${Number(prevReading.previousnotaxsale).toFixed(2) ?? '0.00'}</newnotaxsale>`,
          `<opentime>${formatDateYYYYMMDDHHMMSS(new Date(Dates))}</opentime>`,
          `<closetime>${formatDateYYYYMMDDHHMMSS(new Date(Dates))}</closetime>`,
          `<gross>${Number(0).toFixed(2) ?? '0.00'}</gross>`,
          `<vat>${Number(0).toFixed(2) ?? '0.00'}</vat>`,
          `<localtax>${Number(0).toFixed(2) ?? '0.00'}</localtax>`,
          `<amusement>${Number(0).toFixed(2) ?? '0.00'}</amusement>`,
          `<ewt>${Number(0).toFixed(2) ?? '0.00'}</ewt>`,
          `<taxsale>${Number(0).toFixed(2) ?? '0.00'}</taxsale>`,
          `<notaxsale>${Number(0).toFixed(2) ?? '0.00'}</notaxsale>`,
          `<zerosale>${Number(0).toFixed(2) ?? '0.00'}</zerosale>`,
          `<void>${Number(0).toFixed(2) ?? '0.00'}</void>`,
          `<voidcnt>${Number(0)}</voidcnt>`,
          `<disc>${Number(0).toFixed(2) ?? '0.00'}</disc>`,
          `<disccnt>${Number(0)}</disccnt>`,
          `<refund>${Number(0).toFixed(2) ?? '0.00'}</refund>`,
          `<refundcnt>${Number(0)}</refundcnt>`,
          `<senior>${Number(0).toFixed(2) ?? '0.00'}</senior>`,
          `<seniorcnt>${Number(0)}</seniorcnt>`,
          `<pwd>${Number(0).toFixed(2) ?? '0.00'}</pwd>`,
          `<pwdcnt>${Number(0)}</pwdcnt>`,
          `<diplomat>${Number(0).toFixed(2) ?? '0.00'}</diplomat>`,
          `<diplomatcnt>${Number(0)}</diplomatcnt>`,
          `<nac>${Number(0).toFixed(2)}</nac>`,
          `<naccnt>${Number(0)}</naccnt>`,
          `<spd>${Number(0).toFixed(2)}</spd>`,
          `<spdcnt>${Number(0)}</spdcnt>`,
          `<service>${Number(0).toFixed(2) ?? '0.00'}</service>`,
          `<servicecnt>${Number(0)}</servicecnt>`,
          `<receiptstart>${'0'}</receiptstart>`,
          `<receiptend>${'0'}</receiptend>`,
          `<trxcnt>${Number(0)}</trxcnt>`,
          `<cash>${Number(0).toFixed(2) ?? '0.00'}</cash>`,
          `<cashcnt>${Number(0)}</cashcnt>`,
          `<credit>${Number(0).toFixed(2) ?? '0.00'}</credit>`,
          `<creditcnt>${Number(0)}</creditcnt>`,
          `<charge>${Number(0).toFixed(2) ?? '0.00'}</charge>`,
          `<chargecnt>${Number(0)}</chargecnt>`,
          `<giftcheck>${Number(0).toFixed(2) ?? '0.00'}</giftcheck>`,
          `<giftcheckcnt>${Number(0)}</giftcheckcnt>`,
          `<othertender>${Number(0).toFixed(2) ?? '0.00'}</othertender>`,
          `<othertendercnt>${Number(0)}</othertendercnt>`
        ].join('\n')
      }

      // Format transaction items
      // Format transaction items
      const trxListXml: string[] = []
      for (const item of transactions) {
        const lines = item.lines || []
        const salesLineXml = lines
          .map((lineItem: any) => {
            return `
              <line>
                <sku>${lineItem.sku ?? 'NA'}</sku>
                <qty>${lineItem.qty ?? 0}</qty>
                <unitprice>${formatNumber(lineItem.unitprice)}</unitprice>
                <disc>${formatNumber(lineItem.disc)}</disc>
                <senior>${formatNumber(lineItem.senior)}</senior>
                <pwd>${formatNumber(lineItem.pwd)}</pwd>
                <diplomat>${formatNumber(lineItem.diplomat)}</diplomat>
                <nac>${formatNumber(lineItem.nac ?? 0)}</nac>
                <spd>${formatNumber(lineItem.spd ?? 0)}</spd>
                <taxtype>${lineItem.taxtype ?? 'NA'}</taxtype>
                <tax>${formatNumber(lineItem.tax)}</tax>
                <memo>${lineItem.memo ?? 'NA'}</memo>
                <total>${formatNumber(lineItem.total)}</total>
                <choicetype></choicetype>
              </line>`
          })
          .join('\n')

        trxListXml.push(`
          <trx>
            <receiptno>${item.receiptno}</receiptno>
            <void>${formatNumber(item.void)}</void>
            <cash>${formatNumber(item.cash)}</cash>
            <credit>${formatNumber(item.credit)}</credit>
            <charge>${formatNumber(item.charge)}</charge>
            <giftcheck>${formatNumber(item.giftcheck)}</giftcheck>
            <othertender>${formatNumber(item.othertender)}</othertender>
            <linedisc>${formatNumber(item.linedisc)}</linedisc>
            <linesenior>${formatNumber(item.linesenior)}</linesenior>
            <evat>${formatNumber(item.evat)}</evat>
            <linepwd>${formatNumber(item.linepwd)}</linepwd>
            <linediplomat>${formatNumber(item.linediplomat)}</linediplomat>
            <nac>${formatNumber(item.nac ?? 0)}</nac>
            <spd>${formatNumber(item.spd ?? 0)}</spd>
            <subtotal>${formatNumber(item.subtotal)}</subtotal>
            <disc>${formatNumber(item.disc)}</disc>
            <senior>${formatNumber(item.senior)}</senior>
            <pwd>${formatNumber(item.pwd)}</pwd>
            <diplomat>${formatNumber(item.diplomat)}</diplomat>
            <vat>${formatNumber(item.vat)}</vat>
            <exvat>${formatNumber(item.exvat)}</exvat>
            <incvat>${formatNumber(item.incvat)}</incvat>
            <localtax>${formatNumber(item.localtax)}</localtax>
            <amusement>${formatNumber(item.amusement)}</amusement>
            <service>${formatNumber(item.service)}</service>
            <taxsale>${formatNumber(item.taxsale)}</taxsale>
            <notaxsale>${formatNumber(item.notaxsale)}</notaxsale>
            <taxexsale>${formatNumber(item.taxexsale)}</taxexsale>
            <taxincsale>${formatNumber(item.taxincsale)}</taxincsale>
            <zerosale>${formatNumber(item.zerosale)}</zerosale>
            <customercount>${item.customercnt ?? 1}</customercount>
            <gross>${formatNumber(item.gross)}</gross>
            <refund>${formatNumber(item.refund)}</refund>
            <taxrate>${formatNumber(item.taxrate)}</taxrate>
            <posted>${item.posted ?? 'NA'}</posted>
            <qty>${item.qty ?? 0}</qty>
            <created>${formatNumber(item.created ?? 0)}</created>
            <memo>${item.memo && item.memo !== 'NA' ? item.memo : ''}</memo>
            ${salesLineXml}
          </trx>`)
      }

      const content = `
      <root>
        ${SalesId}
        <sales>
        ${salesXml}
        ${trxListXml.join('\n') ?? ''}
        </sales>
        <master>
        ${Master}
        </master>
      </root>
      `

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      fs.writeFileSync(filePath, content, 'utf8')

      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error generating Alliance salesEOD report:', error)
      return { IsSomething: false, Message: error.message || Error.e00x02 }
    }
  }

  /**
   * Main orchestrator to generate Alliance Online Sales PRE-EOD XML Report
   */
  static async generateOnlineSalesPREEOD(
    path: string,
    dates: string,
    category: string,
    data: { Terminal: number; TenantCode: string; POSKey: string }
  ): Promise<Response> {
    try {
      const Terminal = data?.Terminal ?? 0
      const Dates = formatDateDash(new Date(dates ?? new Date()))

      // 1. Get Control Number
      const controlNumber = await this.getControlNumber(Terminal, Dates)

      // 2. Get Master Products
      const products = await this.getMasterProducts(Terminal, Dates)

      // 3. Get Transaction list
      const transactions = await this.getTransactionList(Terminal, Dates)

      const fileName = generateAllianceFilename(
        AllianceType.onlineSalesPREEOD,
        data.TenantCode,
        data.Terminal,
        controlNumber,
        dates
      )
      const filePath = paths.join(path, `${fileName}`)

      // Format identity tags
      const SalesId = `
      <id>
        <tenantid>${data.TenantCode ?? 'NA'}</tenantid>
        <key>${data.POSKey ?? 'NA'}</key>
        <tmid>${data.Terminal.toString().padStart(4, '0') ?? 1}</tmid>
        <doc>SALES_PREEOD</doc>
      </id>
      `

      // Format Master Products list
      const Master = products
        .map((item) => {
          return [
            `<product>
              <sku>${item?.sku ?? 0}</sku>
              <name>${item?.name ?? 'NA'}</name>
              <inventory>${item?.inventory ?? 0}</inventory>
              <price>${Number(item?.price ?? 0).toFixed(2)}</price>
              <category>${category ?? '01'}</category>
            </product>`
          ].join('\n')
        })
        .join('\n')

      // Format transaction items
      const trxListXml: string[] = []
      for (const item of transactions) {
        const lines = item.lines || []
        const salesLineXml = lines
          .map((lineItem: any) => {
            return `
              <line>
                <sku>${lineItem.sku ?? 'NA'}</sku>
                <qty>${lineItem.qty ?? 0}</qty>
                <unitprice>${formatNumber(lineItem.unitprice)}</unitprice>
                <disc>${formatNumber(lineItem.disc)}</disc>
                <senior>${formatNumber(lineItem.senior)}</senior>
                <pwd>${formatNumber(lineItem.pwd)}</pwd>
                <diplomat>${formatNumber(lineItem.diplomat)}</diplomat>
                <taxtype>${lineItem.taxtype ?? 'NA'}</taxtype>
                <tax>${formatNumber(lineItem.tax)}</tax>
                <memo>NA</memo>
                <total>${formatNumber(lineItem.total)}</total>
              </line>`
          })
          .join('\n')

        trxListXml.push(`
          <trx>
            <receiptno>${item.receiptno}</receiptno>
            <void>${formatNumber(item.void)}</void>
            <cash>${formatNumber(item.cash)}</cash>
            <credit>${formatNumber(item.credit)}</credit>
            <charge>${formatNumber(item.charge)}</charge>
            <giftcheck>${formatNumber(item.giftcheck)}</giftcheck>
            <othertender>${formatNumber(item.othertender)}</othertender>
            <linedisc>${formatNumber(item.linedisc)}</linedisc>
            <linesenior>${formatNumber(item.linesenior)}</linesenior>
            <evat>${formatNumber(item.evat)}</evat>
            <linepwd>${formatNumber(item.linepwd)}</linepwd>
            <linediplomat>${formatNumber(item.linediplomat)}</linediplomat>
            <subtotal>${formatNumber(item.subtotal)}</subtotal>
            <disc>${formatNumber(item.disc)}</disc>
            <senior>${formatNumber(item.senior)}</senior>
            <pwd>${formatNumber(item.pwd)}</pwd>
            <diplomat>${formatNumber(item.diplomat)}</diplomat>
            <vat>${formatNumber(item.vat)}</vat>
            <exvat>${formatNumber(item.exvat)}</exvat>
            <incvat>${formatNumber(item.vat)}</incvat>
            <localtax>${formatNumber(item.localtax)}</localtax>
            <amusement>${formatNumber(item.amusement)}</amusement>
            <service>${formatNumber(item.service)}</service>
            <taxsale>${formatNumber(item.taxsale)}</taxsale>
            <notaxsale>${formatNumber(item.notaxsale)}</notaxsale>
            <taxexsale>${formatNumber(item.taxexsale)}</taxexsale>
            <taxincsale>${formatNumber(item.taxsale)}</taxincsale>
            <zerosale>${formatNumber(item.zerosale)}</zerosale>
            <vatexempt>${formatNumber(item.vatexempt)}</vatexempt>
            <customercount>${item.customercnt ?? 0}</customercount>
            <gross>${formatNumber(item.gross)}</gross>
            <refund>${formatNumber(item.refund)}</refund>
            <taxrate>${formatNumber(item.taxrate)}</taxrate>
            <posted>${item.posted ?? 'NA'}</posted>
            <memo>NA</memo>
            ${salesLineXml}
          </trx>`)
      }

      const content = `
      <root>
        ${SalesId}
        <sales>
        <date>${formatDateYYYYMMDD(new Date(dates))}</date>
        ${trxListXml.join('\n') ?? ''}
        </sales>
        <master>
        ${Master}
        </master>
      </root>
      `

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      fs.writeFileSync(filePath, content, 'utf8')

      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error generating Alliance onlineSalesPREEOD report:', error)
      return { IsSomething: false, Message: error.message || Error.e00x02 }
    }
  }
}
