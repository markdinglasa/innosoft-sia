import { DailyDiscount, DailyHourlySale, DailySale } from '@shared/types'
import { format } from 'date-fns'
import { MstDiscountEntity } from '../../entities/masterfiles/MstDiscount.entity'
import { TrnCollectionEntity } from '../../entities/transactions/TrnCollection.entity'
import { TrnSalesEntity } from '../../entities/transactions/TrnSales.entity'
import { TrnSalesLineEntity } from '../../entities/transactions/TrnSalesLine.entity'
import { AppDataSource } from '../../typeORM/configurations'

export class MegaworldReportService {
  /**
   * Get Daily Sales Data for Megaworld Report
   */
  static async getDailySalesData(terminalId: number, tenantCode: string, dates: Date) {
    const formattedDate = format(dates, 'yyyy-MM-dd')

    // 1. Control Number (Days with sales)
    const controlNumberResult = await AppDataSource.getRepository(TrnSalesEntity)
      .createQueryBuilder('sales')
      .innerJoin('sales.salesLine', 'salesLine')
      .innerJoin('salesLine.discount', 'discount')
      .select('CAST(sales.salesDate AS DATE)', 'SalesDate')
      .addSelect(
        `SUM(ROUND(CASE WHEN discount.discount NOT IN ('Senior Citizen Discount', 'PWD') THEN salesLine.price ELSE (salesLine.price1 + salesLine.price2LessTax) END * salesLine.quantity, 2))`,
        'GrossSales'
      )
      .where('sales.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(sales.salesDate AS DATE) <= :dates', { dates: formattedDate })
      .groupBy('CAST(sales.salesDate AS DATE)')
      .getRawMany()

    const controlNumber = controlNumberResult.filter((r) => Number(r.GrossSales) > 0).length

    // 2. Old Accumulated Total (Previous Reading)
    const previousReadingResult = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoin('collection.sales', 'sales')
      .leftJoin('sales.salesLine', 'salesLine')
      .select(
        'SUM(CASE WHEN collection.isCancelled = false AND COALESCE(collection.isReturned, 0) = 0 THEN salesLine.amount ELSE 0 END)',
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
        'SUM(CASE WHEN collection.isCancelled = false AND COALESCE(collection.isReturned, 0) = 0 THEN salesLine.amount ELSE 0 END)',
        'NetSales'
      )
      .addSelect(
        'SUM(CASE WHEN sales.isCancelled = true THEN salesLine.amount ELSE 0 END)',
        'VoidAmount'
      )
      .addSelect(
        'SUM(CASE WHEN sales.isCancelled = false AND COALESCE(collection.isReturned, 0) = 2 THEN salesLine.amount ELSE 0 END)',
        'RefundAmount'
      )
      .addSelect(
        `SUM(CASE WHEN salesLine.price2 > 0 AND collection.isCancelled = false AND COALESCE(collection.isReturned, 0) = 0 
          THEN (salesLine.quantity * (salesLine.price2LessTax - (salesLine.price2LessTax * (salesLine.discountRate / 100)))) 
          ELSE CASE WHEN salesLine.taxId = 5 THEN salesLine.amount ELSE 0 END END)`,
        'VATExempt'
      )
      .addSelect(
        'SUM(CASE WHEN salesLine.taxRate > 0 AND collection.isCancelled = false AND COALESCE(collection.isReturned, 0) = 0 THEN salesLine.taxAmount ELSE 0 END)',
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
        "SUM(CASE WHEN collection.isCancelled = false AND cl.amount > 0 AND pt.payType = 'Cash' THEN (CASE WHEN cl.amount > collection.amount THEN collection.amount ELSE cl.amount END) ELSE 0 END)",
        'CashSales'
      )
      .addSelect(
        "SUM(CASE WHEN collection.isCancelled = false AND cl.amount > 0 AND (pt.payType = 'Credit Card' OR pt.payType = 'Debit') THEN cl.amount ELSE 0 END)",
        'CreditDebitsales'
      )
      .addSelect(
        "SUM(CASE WHEN collection.isCancelled = false AND cl.amount > 0 AND pt.payType NOT IN ('Credit Card', 'Cash', 'Debit') THEN cl.amount ELSE 0 END)",
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
        `SUM(CASE WHEN (COALESCE(collection.isReturned, 0) = 0 OR sales.isCancelled = true) 
          AND discount.discount IN (:...mandated)
          THEN COALESCE(salesLine.discountAmount * salesLine.quantity, 0) ELSE 0 END)`,
        'GovMandatedDiscount'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(collection.isReturned, 0) = 0 OR sales.isCancelled = true) 
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
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.salesId = sales.id')
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
    const govMandatedDiscount = Math.round(Number(discCountResult?.GovMandatedDiscount || 0) * 100) / 100
    const otherDiscount = Math.round(Number(discCountResult?.OtherDiscount || 0) * 100) / 100
    const grossSalesAmount = Math.round((netSalesAmount + govMandatedDiscount + otherDiscount) * 100) / 100

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
    } as DailySale
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
        "SUM(CASE WHEN salesLine.discountAmount > 0 AND COALESCE(collection.isReturned, 0) = 0 THEN salesLine.discountAmount * salesLine.quantity ELSE 0 END)",
        'DiscountAmount'
      )
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('collection.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .groupBy('collection.terminalId')
      .addGroupBy('discount.discount')
      .getRawMany() as DailyDiscount[]
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
        'SUM(CASE WHEN collection.isCancelled = false AND COALESCE(collection.isReturned, 0) = 0 THEN collection.amount ELSE 0 END)',
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
        'SUM(CASE WHEN COALESCE(collection.isReturned, 0) = 2 THEN 0 ELSE COALESCE(salesLine.amount, 0) END)',
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
