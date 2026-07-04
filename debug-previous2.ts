import { AppDataSource } from './src/main/typeORM/configurations'
import { detectDbCapabilities } from './src/main/typeORM/db-capabilities'
import { ZReadingReportService } from './src/main/services/reports/ZReadingReportService'
import { AllianceReportService } from './src/main/services/reports/AllianceReportService'

async function debugPreviousReading() {
  await AppDataSource.initialize()
  await detectDbCapabilities()

  const terminalId = 1
  const dates = '2024-11-20' // The date the user is testing

  console.log('--- Z-Reading ---')
  const zReadingResult = await ZReadingReportService.getZReadingData(terminalId, dates)
  console.log('Z-Reading Previous Reading:', zReadingResult.previousReading[PreviousReading)
  console.log('Z-Reading NetSales Today:', zReadingResult.trxAndGross[NetSales)
  
  console.log('\n--- Alliance ---')
  const alliancePrev = await AllianceReportService.getPreviousAmounts(terminalId, dates)
  console.log('Alliance Previous Reading:', alliancePrev.PreviousReading)
  
  const zcounter = await AllianceReportService.getControlNumber(terminalId, dates)
  const allianceEOD = await AllianceReportService.getSalesEODSummary(terminalId, dates, alliancePrev, zcounter)
  console.log('Alliance Gross Today:', allianceEOD?.gross)

  // Test ZReading SQL
  const zsql = await AppDataSource.getRepository('TrnCollection')
      .createQueryBuilder('collection')
      .leftJoin('collection.sales', 'sales')
      .leftJoin('sales.salesLines', 'salesLine')
      .select('SUM(CASE WHEN collection.isCancelled = 0 AND (collection.isReturned IS NULL OR collection.isReturned = 0) THEN salesLine.amount ELSE 0 END)', 'PreviousReading')
      .where('collection.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(collection.collectionDate AS DATE) < :dates', { dates })
      .getRawOne()
      
  console.log('\nRaw ZReading query:', zsql)

  // Test Alliance SQL
  const asql = await AppDataSource.getRepository('TrnSales')
      .createQueryBuilder('sales')
      .leftJoin('sales.salesLines', 'salesLine')
      .leftJoin('sales.collections', 'collection')
      .select('SUM(ROUND(CASE WHEN collection.isCancelled = 0 AND (collection.isReturned IS NULL OR collection.isReturned = 0) THEN salesLine.amount ELSE 0 END, 2))', 'PreviousReading')
      .where('sales.isLocked = :isLocked', { isLocked: true })
      .andWhere('sales.terminalId = :terminalId', { terminalId })
      .andWhere('CAST(sales.salesDate AS DATE) < :dates', { dates })
      .getRawOne()
      
  console.log('Raw Alliance query:', asql)

  process.exit(0)
}

debugPreviousReading().catch(console.error)
