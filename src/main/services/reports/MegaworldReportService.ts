import { DailyHourlySale } from '@shared/types'
import { format } from 'date-fns'
import { MstDiscountEntity } from '../../entities/masterfiles/MstDiscount.entity'
import { TrnCollectionEntity } from '../../entities/transactions/TrnCollection.entity'
import { TrnSalesEntity } from '../../entities/transactions/TrnSales.entity'
import { TrnSalesLineEntity } from '../../entities/transactions/TrnSalesLine.entity'
import { AppDataSource } from '../../typeORM/configurations'
import { isReturnExpr } from '../../typeORM/db-capabilities'

export class MegaworldReportService {
  /**
   * Get Daily Sales Data for Megaworld Report
   */
  static async getDailySalesData(terminalId: number, tenantCode: string, dates: Date) {
    const formattedDate = format(dates, 'yyyy-MM-dd')

    // 1. Control Number (Cumulative count of days with locked collections)
    const controlNumberResult = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .select('DISTINCT CAST(collection.collectionDate AS DATE)', 'SalesDate')
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('CAST(collection.collectionDate AS DATE) <= :dates', { dates: formattedDate })
      .getRawMany()

    const controlNumber = controlNumberResult.length
    console.log(
      `getDailySalesData: Cumulative ControlNumber up to ${formattedDate} = ${controlNumber}`
    )

    // 2. Old Accumulated Total (Previous Reading)
    const previousReadingResult = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoin('collection.sales', 'sales')
      .leftJoin('sales.salesLines', 'salesLine')
      .select(
        `SUM(CASE WHEN collection.isCancelled = 0 AND COALESCE(${isReturnExpr()}, 0) = 0 THEN salesLine.amount ELSE 0 END)`,
        'PreviousReading'
      )
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) < :dates', { dates: formattedDate })
      .getRawOne()

    const oldAccumulatedTotal =
      Math.round(Number(previousReadingResult?.PreviousReading || 0) * 100) / 100

    // 3. Current Day Aggregations
    const dayAggResult = await AppDataSource.getRepository(TrnSalesLineEntity)
      .createQueryBuilder('salesLine')
      .innerJoin('salesLine.sales', 'sales')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.salesId = salesLine.salesId')
      .select(
        `SUM(CASE WHEN collection.isCancelled = 0 AND COALESCE(${isReturnExpr()}, 0) = 0 THEN salesLine.amount ELSE 0 END)`,
        'NetSales'
      )
      .addSelect(
        'SUM(CASE WHEN sales.isCancelled = 1 THEN salesLine.amount ELSE 0 END)',
        'VoidAmount'
      )
      .addSelect(
        `SUM(CASE WHEN sales.isCancelled = 0 AND COALESCE(${isReturnExpr()}, 0) = 2 THEN salesLine.amount ELSE 0 END)`,
        'RefundAmount'
      )
      .addSelect(
        `SUM(CASE WHEN salesLine.price2 > 0 AND collection.isCancelled = 0 AND COALESCE(${isReturnExpr()}, 0) = 0 
          THEN (salesLine.quantity * (salesLine.price2LessTax - (salesLine.price2LessTax * (salesLine.discountRate / 100)))) 
          ELSE CASE WHEN salesLine.taxId = 5 THEN salesLine.amount ELSE 0 END END)`,
        'VATExempt'
      )
      .addSelect(
        `SUM(CASE WHEN salesLine.taxRate > 0 AND collection.isCancelled = 0 AND COALESCE(${isReturnExpr()}, 0) = 0 THEN salesLine.taxAmount ELSE 0 END)`,
        'VATAmount'
      )
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    // 4. Payments
    const paymentResult = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoin('collection.collectionLines', 'cl')
      .leftJoin('cl.payType', 'pt')
      .select(
        "SUM(CASE WHEN collection.isCancelled = 0 AND cl.amount > 0 AND pt.payType = 'Cash' THEN (CASE WHEN cl.amount > collection.amount THEN collection.amount ELSE cl.amount END) ELSE 0 END)",
        'CashSales'
      )
      .addSelect(
        "SUM(CASE WHEN collection.isCancelled = 0 AND cl.amount > 0 AND (pt.payType = 'Credit Card' OR pt.payType = 'Debit') THEN cl.amount ELSE 0 END)",
        'CreditDebitsales'
      )
      .addSelect(
        "SUM(CASE WHEN collection.isCancelled = 0 AND cl.amount > 0 AND pt.payType NOT IN ('Credit Card', 'Cash', 'Debit') THEN cl.amount ELSE 0 END)",
        'OtherPaymentSales'
      )
      .where('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    // 5. Discount Calculations
    const mandatedDiscounts = MstDiscountEntity.mandatedDiscounts

    const discCountResult = await AppDataSource.getRepository(TrnSalesLineEntity)
      .createQueryBuilder('salesLine')
      .innerJoin('salesLine.sales', 'sales')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.salesId = salesLine.salesId')
      .innerJoin('salesLine.discount', 'discount')
      .select(
        `SUM(CASE WHEN (COALESCE(${isReturnExpr()}, 0) = 0 OR sales.isCancelled = 1) 
          AND discount.discount IN (:...mandated)
          THEN COALESCE(salesLine.discountAmount * salesLine.quantity, 0) ELSE 0 END)`,
        'GovMandatedDiscount'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(${isReturnExpr()}, 0) = 0 OR sales.isCancelled = 1) 
          AND discount.discount NOT IN (:...mandated)
          THEN COALESCE(salesLine.discountAmount * salesLine.quantity, 0) ELSE 0 END)`,
        'OtherDiscount'
      )
      .setParameter('mandated', mandatedDiscounts)
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    // 6. Counts
    const countResult = await AppDataSource.getRepository(TrnSalesEntity)
      .createQueryBuilder('sales')
      .leftJoin('sales.collections', 'collection')
      .leftJoin('sales.customer', 'customer')
      .select(
        `COUNT(DISTINCT CASE WHEN customer.customer = 'Walk In' THEN sales.id ELSE NULL END) + 
         COUNT(DISTINCT CASE WHEN customer.customer <> 'Walk In' THEN sales.customerId ELSE NULL END)`,
        'CustomerCount'
      )
      .addSelect('COUNT(DISTINCT sales.id)', 'NoSalesTransaction')
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    const netSalesAmount = Math.round(Number(dayAggResult?.NetSales || 0) * 100) / 100
    const govMandatedDiscount =
      Math.round(Number(discCountResult?.GovMandatedDiscount || 0) * 100) / 100
    const otherDiscount = Math.round(Number(discCountResult?.OtherDiscount || 0) * 100) / 100
    const grossSalesAmount =
      Math.round((netSalesAmount + govMandatedDiscount + otherDiscount) * 100) / 100

    return {
      MallPartnerCodeId: tenantCode || 'NA',
      Terminal: String(terminalId).padStart(2, '0'),
      Date: format(dates, 'yyyy-MM-dd'),
      OldAccumulatedTotal: oldAccumulatedTotal,
      NewAccumulatedTotal: Math.round((oldAccumulatedTotal + netSalesAmount) * 100) / 100,
      GrossSalesAmount: grossSalesAmount,
      NonTaxSalesAmount: Math.round(Number(dayAggResult?.VATExempt || 0) * 100) / 100,
      GovMandatedDiscount: govMandatedDiscount,
      OtherDiscount: otherDiscount,
      RefundAmount: Math.round(Number(dayAggResult?.RefundAmount || 0) * 100) / 100,
      TaxAmount: Math.round(Number(dayAggResult?.VATAmount || 0) * 100) / 100,
      ServiceChargeAmount: Math.round(Number(dayAggResult?.VATExempt || 0) * 100) / 100,
      NetSalesAmount: netSalesAmount,
      CashSales: Math.round(Number(paymentResult?.CashSales || 0) * 100) / 100,
      CreditDebitsales: Math.round(Number(paymentResult?.CreditDebitsales || 0) * 100) / 100,
      OtherPaymentSales: Math.round(Number(paymentResult?.OtherPaymentSales || 0) * 100) / 100,
      VoidAmount: Math.round(Number(dayAggResult?.VoidAmount || 0) * 100) / 100,
      CustomerCount: Number(countResult?.CustomerCount || 0),
      ControlNumber: controlNumber,
      NoSalesTransaction: Number(countResult?.NoSalesTransaction || 0),
      SalesType: 0 as any,
      NetSalesAmountPerSalesType: 0
    }
  }

  /**
   * Get Sales Type Data
   */
  static async getSalesTypeData(terminalId: number, dates: Date) {
    const formattedDate = format(dates, 'yyyy-MM-dd')
    return await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .select("'01'", 'SalesType')
      .addSelect('SUM(collection.amount)', 'NetSalesAmount')
      .where('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('collection.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .groupBy('collection.terminalId')
      .getRawMany()
  }

  /**
   * Get Daily Discounts Data
   */
  static async getDailyDiscountsData(terminalId: number, dates: Date) {
    const formattedDate = format(dates, 'yyyy-MM-dd')
    return await AppDataSource.getRepository(TrnSalesLineEntity)
      .createQueryBuilder('salesLine')
      .innerJoin('salesLine.sales', 'sales')
      .innerJoin('salesLine.discount', 'discount')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.salesId = salesLine.salesId')
      .select('collection.terminalId', 'TerminalId')
      .addSelect(
        "CASE WHEN discount.discount <> 'Zero Discount' THEN discount.discount ELSE 'NA' END",
        'DiscountCode'
      )
      .addSelect(
        "CASE WHEN discount.discount <> 'Zero Discount' THEN discount.discount ELSE 'NA' END",
        'DiscountDescription'
      )
      .addSelect(
        `SUM(CASE WHEN salesLine.discountAmount > 0 AND COALESCE(${isReturnExpr()}, 0) = 0 THEN salesLine.discountAmount * salesLine.quantity ELSE 0 END)`,
        'DiscountAmount'
      )
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('collection.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .groupBy('collection.terminalId')
      .addGroupBy('discount.discount')
      .getRawMany()
  }

  /**
   * Get Hourly Sales Data
   */
  static async getHourlySalesData(terminalId: number, tenantCode: string, dates: Date) {
    const formattedDate = format(dates, 'yyyy-MM-dd')

    const dayResponse = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoin('collection.customer', 'customer')
      .select(`:mallPartnerCodeId`, 'MallPartnerCodeId')
      .addSelect('collection.terminalId', 'Terminal')
      .addSelect(':dates', 'Date')
      .addSelect(
        `SUM(CASE WHEN collection.isCancelled = 0 AND COALESCE(${isReturnExpr()}, 0) = 0 THEN collection.amount ELSE 0 END)`,
        'NetSalesAmountDay'
      )
      .addSelect('COUNT(DISTINCT collection.id)', 'NoSalesTransactionDay')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN customer.customer = 'Walk In' THEN collection.id ELSE NULL END) + 
         COUNT(DISTINCT CASE WHEN customer.customer <> 'Walk In' THEN collection.customerId ELSE NULL END)`,
        'CustomerCountDay'
      )
      .setParameters({
        mallPartnerCodeId: tenantCode || 'NA',
        dates: formattedDate
      })
      .where('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('collection.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .groupBy('collection.terminalId')
      .getRawMany()

    const hourlyResponse = await AppDataSource.getRepository(TrnSalesLineEntity)
      .createQueryBuilder('salesLine')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.salesId = salesLine.salesId')
      .leftJoin('collection.customer', 'customer')
      .select(
        `CASE WHEN DATEPART(HOUR, collection.entryDateTime) = 0 THEN '24' ELSE RIGHT('0' + CAST(DATEPART(HOUR, collection.entryDateTime) AS VARCHAR), 2) END`,
        'HourCode'
      )
      .addSelect(
        `SUM(CASE WHEN COALESCE(${isReturnExpr()}, 0) = 2 THEN 0 ELSE COALESCE(salesLine.amount, 0) END)`,
        'NetSalesAmountHour'
      )
      .addSelect('COUNT(DISTINCT collection.id)', 'NoSalesTransactionHour')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN customer.customer = 'Walk In' THEN collection.id ELSE NULL END) + 
         COUNT(DISTINCT CASE WHEN customer.customer <> 'Walk In' THEN collection.customerId ELSE NULL END)`,
        'CustomerCountHour'
      )
      .where('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('collection.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .groupBy('collection.terminalId')
      .addGroupBy('collection.collectionDate')
      .addGroupBy(
        `CASE WHEN DATEPART(HOUR, collection.entryDateTime) = 0 THEN '24' ELSE RIGHT('0' + CAST(DATEPART(HOUR, collection.entryDateTime) AS VARCHAR), 2) END`
      )
      .getRawMany()

    return {
      day: dayResponse as DailyHourlySale[],
      hourly: hourlyResponse as DailyHourlySale[]
    }
  }
}
