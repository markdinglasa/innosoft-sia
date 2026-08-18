import { format } from 'date-fns'
import { MstDiscountEntity } from '../../entities/masterfiles/MstDiscount.entity'
import { TrnCollectionEntity } from '../../entities/transactions/TrnCollection.entity'
import { TrnSalesLineEntity } from '../../entities/transactions/TrnSalesLine.entity'
import { AppDataSource } from '../../typeORM/configurations'
import { DbCapabilities, isReturnExpr } from '../../typeORM/db-capabilities'

export class ZReadingReportService {
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

    // 2. Control Number (Cumulative count of days with locked collections, amount > 0, not cancelled/returned)
    const qb2 = AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .select('CAST(collection.collectionDate AS DATE)', 'SalesDate')
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) <= :dates', { dates: formattedDate })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('collection.amount > 0')
      .groupBy('CAST(collection.collectionDate AS DATE)')

    if (DbCapabilities.hasIsReturn) {
      qb2.andWhere('(collection.isReturn IS NULL OR collection.isReturn = 0)')
    }

    const controlNumberResult = await qb2.getRawMany()
    const controlNumber = controlNumberResult.length
    console.log(
      `getZReadingData: Cumulative ControlNumber up to ${formattedDate} = ${controlNumber}`
    )

    // 3. Discounts
    const mandatedDiscounts = MstDiscountEntity.mandatedDiscounts

    const discounts = await AppDataSource.getRepository(TrnSalesLineEntity)
      .createQueryBuilder('salesLine')
      .innerJoin('salesLine.sales', 'sales')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.salesId = salesLine.salesId')
      .innerJoin('salesLine.discount', 'discount')
      .select('discount.discount', 'Discount')
      .addSelect(
        `CASE WHEN discount.discount IN (:...mandated) THEN 1 ELSE 0 END`,
        'IsGovernmentMandated'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(${isReturnExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount IN (:...mandated) THEN COALESCE(salesLine.discountAmount * salesLine.quantity, 0) ELSE 0 END)`,
        'GovDiscountAmount'
      )
      .addSelect(
        `SUM(CASE WHEN (COALESCE(${isReturnExpr()}, 0) = 0 OR sales.isCancelled = 1) AND discount.discount NOT IN (:...mandated) THEN COALESCE(salesLine.discountAmount * salesLine.quantity, 0) ELSE 0 END)`,
        'NonGovDiscountAmount'
      )
      .addSelect(
        `SUM(CASE WHEN discount.discount IN ('Senior Citizen Discount', 'PWD') THEN (salesLine.price2LessTax - (salesLine.price2LessTax * (salesLine.discountRate / 100))) * salesLine.quantity ELSE 0 END)`,
        'VATExempt'
      )
      .setParameter('mandated', mandatedDiscounts)
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .groupBy('discount.discount')
      .getRawMany()

    // 4. Previous Reading
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

    // 5. Trx/Gross
    const trxAndGross = await AppDataSource.getRepository(TrnSalesLineEntity)
      .createQueryBuilder('salesLine')
      .innerJoin('salesLine.sales', 'sales')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.salesId = salesLine.salesId')
      .select(
        `SUM(CASE WHEN collection.isCancelled = 0 AND COALESCE(${isReturnExpr()}, 0) = 0 THEN salesLine.amount ELSE 0 END)`,
        'NetSales'
      )
      .addSelect('COUNT(DISTINCT collection.id)', 'TotalTrx')
      .addSelect('COUNT(DISTINCT salesLine.id)', 'TotalSKU')
      .addSelect('SUM(salesLine.quantity)', 'TotalQuantity')
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) = :dates', { dates: formattedDate })
      .getRawOne()

    // 6. VAT Analysis
    const vatAnalysis = await AppDataSource.getRepository(TrnSalesLineEntity)
      .createQueryBuilder('salesLine')
      .innerJoin('salesLine.sales', 'sales')
      .leftJoin(TrnCollectionEntity, 'collection', 'collection.salesId = salesLine.salesId')
      .leftJoin('salesLine.tax', 'tax')
      .leftJoin('salesLine.discount', 'discount')
      .leftJoin('salesLine.item', 'item')
      .select(
        `SUM(CASE WHEN (tax.tax = 'NON-VAT' OR item.itemDescription = 'SERVICE CHARGE') AND COALESCE(discount.discount, '') NOT IN ('PWD', 'Senior Citizen Discount') THEN salesLine.amount ELSE 0 END)`,
        'NONVat'
      )
      .addSelect(
        `SUM(CASE WHEN tax.tax = 'VAT' AND item.itemDescription != 'SERVICE CHARGE' AND COALESCE(discount.discount, '') NOT IN ('PWD', 'Senior Citizen Discount') THEN (salesLine.amount - salesLine.taxAmount) ELSE 0 END)`,
        'VATSales'
      )
      .addSelect(
        `SUM(CASE WHEN tax.tax IN ('VAT EXEMPT', 'VAT EXEMPT SALES') OR discount.discount IN ('PWD', 'Senior Citizen Discount') THEN salesLine.amount ELSE 0 END)`,
        'VATExempt'
      )
      .addSelect(
        `SUM(CASE WHEN tax.tax = 'ZERO RATED' AND item.itemDescription != 'SERVICE CHARGE' AND COALESCE(discount.discount, '') NOT IN ('PWD', 'Senior Citizen Discount') THEN salesLine.amount ELSE 0 END)`,
        'zerosale'
      )
      .addSelect(
        `SUM(CASE WHEN tax.tax = 'VAT' AND item.itemDescription != 'SERVICE CHARGE' AND COALESCE(discount.discount, '') NOT IN ('PWD', 'Senior Citizen Discount') THEN salesLine.taxAmount ELSE 0 END)`,
        'VATAmount'
      )
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .andWhere('collection.isCancelled = :isCancelled', { isCancelled: false })
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
