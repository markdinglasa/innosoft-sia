import { DailyDiscount, DailyHourlySale, DailySale } from '@shared/types'
import { format } from 'date-fns'
import { MstDiscountEntity } from '../../entities/masterfiles/MstDiscount.entity'
import { TrnCollectionEntity } from '../../entities/transactions/TrnCollection.entity'
import { TrnOrderEntity } from '../../entities/transactions/TrnOrder.entity'
import { TrnOrderLineEntity } from '../../entities/transactions/TrnOrderLine.entity'
import { AppDataSource } from '../../typeORM/configurations'

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
    console.log(`getDailySalesData: Cumulative ControlNumber up to ${formattedDate} = ${controlNumber}`)

    // 2. Old Accumulated Total (Previous Reading)
    const previousReadingResult = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoin('collection.order', 'order')
      .leftJoin('order.orderLines', 'orderLine')
      .select(
        'SUM(CASE WHEN collection.isCancelled = 0 AND COALESCE(collection.isReturned, 0) = 0 THEN orderLine.amount ELSE 0 END)',
        'PreviousReading'
      )
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) < :dates', { dates: formattedDate })
      .getRawOne()

    const oldAccumulatedTotal =
      Math.round(Number(previousReadingResult?.PreviousReading || 0) * 100) / 100

    // 3. Current Day Aggregations
    const dayAggResult = await AppDataSource.getRepository(TrnOrderLineEntity)
      .createQueryBuilder('orderLine')
      .innerJoin('orderLine.order', 'order')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.orderId = orderLine.orderId')
      .select(
        'SUM(CASE WHEN collection.isCancelled = 0 AND COALESCE(collection.isReturned, 0) = 0 THEN orderLine.amount ELSE 0 END)',
        'NetSales'
      )
      .addSelect(
        'SUM(CASE WHEN order.isCancelled = 1 THEN orderLine.amount ELSE 0 END)',
        'VoidAmount'
      )
      .addSelect(
        'SUM(CASE WHEN order.isCancelled = 0 AND COALESCE(collection.isReturned, 0) = 2 THEN orderLine.amount ELSE 0 END)',
        'RefundAmount'
      )
      .addSelect(
        `SUM(CASE WHEN orderLine.price2 > 0 AND collection.isCancelled = 0 AND COALESCE(collection.isReturned, 0) = 0 
          THEN (orderLine.quantity * (orderLine.price2LessTax - (orderLine.price2LessTax * (orderLine.discountRate / 100)))) 
          ELSE CASE WHEN orderLine.taxId = 5 THEN orderLine.amount ELSE 0 END END)`,
        'VATExempt'
      )
      .addSelect(
        'SUM(CASE WHEN orderLine.taxRate > 0 AND collection.isCancelled = 0 AND COALESCE(collection.isReturned, 0) = 0 THEN orderLine.taxAmount ELSE 0 END)',
        'VATAmount'
      )
      .where('order.isLocked = :isLocked', { isLocked: true })
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

    const discCountResult = await AppDataSource.getRepository(TrnOrderLineEntity)
      .createQueryBuilder('orderLine')
      .innerJoin('orderLine.order', 'order')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.orderId = orderLine.orderId')
      .innerJoin('orderLine.discount', 'discount')
      .select(
        `SUM(CASE WHEN (COALESCE(collection.isReturned, 0) = 0 OR order.isCancelled = 1) 
          AND discount.discount IN (:...mandated)
          THEN COALESCE(orderLine.discountAmount * orderLine.quantity, 0) ELSE 0 END)`,
        'GovMandatedDiscount'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(collection.isReturned, 0) = 0 OR order.isCancelled = 1) 
          AND discount.discount NOT IN (:...mandated)
          THEN COALESCE(orderLine.discountAmount * orderLine.quantity, 0) ELSE 0 END)`,
        'OtherDiscount'
      )
      .setParameter('mandated', mandatedDiscounts)
      .where('order.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    // 6. Counts
    const countResult = await AppDataSource.getRepository(TrnOrderEntity)
      .createQueryBuilder('order')
      .leftJoin('order.collections', 'collection')
      .leftJoin('order.customer', 'customer')
      .select(
        `COUNT(DISTINCT CASE WHEN customer.customer = 'Walk In' THEN order.id ELSE NULL END) + 
         COUNT(DISTINCT CASE WHEN customer.customer <> 'Walk In' THEN order.customerId ELSE NULL END)`,
        'CustomerCount'
      )
      .addSelect('COUNT(DISTINCT order.id)', 'NoSalesTransaction')
      .where('order.isLocked = :isLocked', { isLocked: true })
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
    return await AppDataSource.getRepository(TrnOrderLineEntity)
      .createQueryBuilder('orderLine')
      .innerJoin('orderLine.order', 'order')
      .innerJoin('orderLine.discount', 'discount')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.orderId = orderLine.orderId')
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
        "SUM(CASE WHEN orderLine.discountAmount > 0 AND COALESCE(collection.isReturned, 0) = 0 THEN orderLine.discountAmount * orderLine.quantity ELSE 0 END)",
        'DiscountAmount'
      )
      .where('order.isLocked = :isLocked', { isLocked: true })
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
        'SUM(CASE WHEN collection.isCancelled = 0 AND COALESCE(collection.isReturned, 0) = 0 THEN collection.amount ELSE 0 END)',
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

    const hourlyResponse = await AppDataSource.getRepository(TrnOrderLineEntity)
      .createQueryBuilder('orderLine')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.orderId = orderLine.orderId')
      .leftJoin('collection.customer', 'customer')
      .select(
        `CASE WHEN DATEPART(HOUR, collection.entryDateTime) = 0 THEN '24' ELSE RIGHT('0' + CAST(DATEPART(HOUR, collection.entryDateTime) AS VARCHAR), 2) END`,
        'HourCode'
      )
      .addSelect(
        'SUM(CASE WHEN COALESCE(collection.isReturned, 0) = 2 THEN 0 ELSE COALESCE(orderLine.amount, 0) END)',
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

  /**
   * Get Consolidated Z-Reading Data
   */
  static async getZReadingData(terminalId: number, dates: Date) {
    const formattedDate = format(dates, 'yyyy-MM-dd')

    // 1. PayTypes
    const paytypes = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoin('collection.collectionLines', 'cl')
      .leftJoin('cl.payType', 'pt')
      .select('pt.payType', 'PayType')
      .addSelect('SUM(cl.amount)', 'TotalAmount')
      .where('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .groupBy('pt.payType')
      .getRawMany()

    // 2. Control Number (Cumulative count of days with locked collections)
    const controlNumberResult = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .select('DISTINCT CAST(collection.collectionDate AS DATE)', 'SalesDate')
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('CAST(collection.collectionDate AS DATE) <= :dates', { dates: formattedDate })
      .getRawMany()
    const controlNumber = controlNumberResult.length
    console.log(`getZReadingData: Cumulative ControlNumber up to ${formattedDate} = ${controlNumber}`)

    // 3. Discounts
    const mandatedDiscounts = MstDiscountEntity.mandatedDiscounts

    const discounts = await AppDataSource.getRepository(TrnOrderLineEntity)
      .createQueryBuilder('orderLine')
      .innerJoin('orderLine.order', 'order')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.orderId = orderLine.orderId')
      .innerJoin('orderLine.discount', 'discount')
      .select('discount.discount', 'Discount')
      .addSelect(
        `CASE WHEN discount.discount IN (:...mandated) THEN 1 ELSE 0 END`,
        'IsGovernmentMandated'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(collection.isReturned, 0) = 0 OR order.isCancelled = 1) AND discount.discount IN (:...mandated) THEN COALESCE(orderLine.discountAmount * orderLine.quantity, 0) ELSE 0 END)`,
        'GovDiscountAmount'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(collection.isReturned, 0) = 0 OR order.isCancelled = 1) AND discount.discount NOT IN (:...mandated) THEN COALESCE(orderLine.discountAmount * orderLine.quantity, 0) ELSE 0 END)`,
        'NonGovDiscountAmount'
      )
      .addSelect(
        `SUM(CASE WHEN discount.discount IN ('Senior Citizen Discount', 'PWD') THEN (orderLine.price2LessTax - (orderLine.price2LessTax * (orderLine.discountRate / 100))) * orderLine.quantity ELSE 0 END)`,
        'VATExempt'
      )
      .setParameter('mandated', mandatedDiscounts)
      .where('order.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .groupBy('discount.discount')
      .getRawMany()

    // 4. Previous Reading
    const previousReadingResult = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .leftJoin('collection.order', 'order')
      .leftJoin('order.orderLines', 'orderLine')
      .select('SUM(CASE WHEN collection.isCancelled = 0 AND COALESCE(collection.isReturned, 0) = 0 THEN orderLine.amount ELSE 0 END)', 'PreviousReading')
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) < :dates', { dates: formattedDate })
      .getRawOne()

    // 5. Trx/Gross
    const trxAndGross = await AppDataSource.getRepository(TrnOrderLineEntity)
      .createQueryBuilder('orderLine')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.orderId = orderLine.orderId')
      .select('SUM(CASE WHEN collection.isCancelled = 0 AND COALESCE(collection.isReturned, 0) = 0 THEN orderLine.amount ELSE 0 END)', 'NetSales')
      .addSelect('COUNT(DISTINCT collection.id)', 'TotalTrx')
      .addSelect('COUNT(DISTINCT orderLine.id)', 'TotalSKU')
      .addSelect('SUM(orderLine.quantity)', 'TotalQuantity')
      .where('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    // 6. VAT Analysis
    const vatAnalysis = await AppDataSource.getRepository(TrnOrderLineEntity)
      .createQueryBuilder('orderLine')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.orderId = orderLine.orderId')
      .select('SUM(CASE WHEN orderLine.taxId = 4 THEN orderLine.amount ELSE 0 END)', 'NONVat')
      .addSelect('SUM(CASE WHEN orderLine.taxId = 1 THEN orderLine.amount ELSE 0 END)', 'VATSales')
      .addSelect('SUM(CASE WHEN orderLine.taxId = 5 THEN orderLine.amount ELSE 0 END)', 'VATExempt')
      .addSelect('SUM(CASE WHEN orderLine.taxId = 3 THEN orderLine.amount ELSE 0 END)', 'zerosale')
      .addSelect('SUM(orderLine.taxAmount)', 'VATAmount')
      .where('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    // 7. Void/Cancelled
    const cancelledTx = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .select('COUNT(collection.id)', 'CancelledTx')
      .addSelect('SUM(collection.amount)', 'CancelledAmount')
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('collection.isCancelled = :isCancelled', { isCancelled: true })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    // 8. Collection Counter
    const collectionCounter = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .select('MIN(collection.collectionNumber)', 'CounterStart')
      .addSelect('MAX(collection.collectionNumber)', 'CounterEnd')
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    return {
      paytypes,
      controlNumber: { ControlNumber: controlNumber },
      discounts,
      previousReading: previousReadingResult,
      trx: trxAndGross,
      gross: { NetSales: trxAndGross?.NetSales ?? 0 },
      VATAnalysis: vatAnalysis,
      CancelledTx: cancelledTx,
      collectionNumber: collectionCounter
    }
  }
}
