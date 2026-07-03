import { format } from 'date-fns'
import fs from 'node:fs'
import paths from 'node:path'
import { TrnCollectionEntity } from '../../entities/transactions/TrnCollection.entity'
import { TrnCollectionLineEntity } from '../../entities/transactions/TrnCollectionLine.entity'
import { TrnStockInEntity } from '../../entities/transactions/TrnStockIn.entity'
import { TrnStockInLineEntity } from '../../entities/transactions/TrnStockInLine.entity'
import { formatNumber } from '../../functions'
import { AppDataSource } from '../../typeORM/configurations'
import { CancelReceipt } from './templates/ejournal/cancel-receipt'
import { ReturnSlip } from './templates/ejournal/return-slip'
import { SalesInvoice } from './templates/ejournal/sales-invoice'
import { CollectionMethod, Details, Sale, VATAnalysis } from './templates/ejournal/types'

export const InvoiceFooter = `
--------------------------------------------
    Cebu Innosoft Solutions Services Inc.
    V. Rama Ave. Cebu City, Philippines
          TIN: 261-481-387-000
      ACCR: 082-261481387-000375-24583
        ACCR Date: August 20, 2020
        Date Issued: January 01, 2026
        PTU:FP032024-074-0438792-00000
--------------------------------------------`

export class EJournalReportService {
  static async generateEJournal(
    dateStart: string,
    dateEnd: string,
    targetDir: string,
    settings: any
  ): Promise<void> {
    const timestamp = format(new Date(), 'yyyyMMddHHmmss')
    const filePath = paths.join(targetDir, `e-journal_${timestamp}.csv`)
    const stream = fs.createWriteStream(filePath, { encoding: 'utf8' })
    let hasRecords = false

    const header = `
      ${settings?.Name ?? ''}
--------------------------------------------
${settings?.Name ?? ''}
${settings?.Address ?? ''}
Operated By: ${settings?.Operator ?? ''}
TIN: ${settings?.TIN ?? ''}
S/N : ${settings?.SerialNumber ?? ''}
MIN : ${settings?.MachineNumber ?? ''}`

    const footer = settings?.InvoiceFooter ?? InvoiceFooter

    const dateFrom = format(new Date(dateStart), 'yyyy-MM-dd')
    const dateTo = format(new Date(dateEnd), 'yyyy-MM-dd')

    try {
      // ── 1. Fetch all locked collection numbers within the date range ──────────
      const collectionRows = await AppDataSource.getRepository(TrnCollectionEntity)
        .createQueryBuilder('c')
        .select('c.collectionNumber', 'CollectionNumber')
        .where('ISNULL(c.isLocked, 0) = 1')
        .andWhere('CAST(c.collectionDate AS DATE) BETWEEN :dateFrom AND :dateTo', {
          dateFrom,
          dateTo
        })
        .getRawMany<{ CollectionNumber: string }>()

      const collectionNumbers = collectionRows.map((r) => r.CollectionNumber).filter(Boolean)

      if (collectionNumbers.length === 0) {
        stream.write('NO RECORDS')
        return
      }

      if (collectionNumbers.length > 1000) {
        stream.write('CONTENT TOO LARGE')
        throw new Error('Content is too large.')
      }

      // ── Process in batches of 250 ─────────────────────────────────────────────
      const BATCH_SIZE = 250
      for (let i = 0; i < collectionNumbers.length; i += BATCH_SIZE) {
        const batch = collectionNumbers.slice(i, i + BATCH_SIZE)

        // ── 2. Sales Items ──────────────────────────────────────────────────────
        const salesData = await AppDataSource.getRepository(TrnCollectionEntity)
          .createQueryBuilder('c')
          .innerJoin('c.sales', 's')
          .innerJoin('s.salesLines', 'si')
          .innerJoin('si.item', 'i')
          .leftJoin('si.unit', 'u')
          .leftJoin('si.discount', 'd')
          .leftJoin('si.tax', 't')
          .leftJoin(TrnStockInEntity, 'sti', 'sti.collectionId = c.id')
          .leftJoin(TrnStockInLineEntity, 'stil', 'stil.stockInId = sti.id')
          .select('c.collectionNumber', 'CollectionNumber')
          .addSelect('i.itemDescription', 'ItemDescription')
          .addSelect('STR(ROUND(ISNULL(si.amount, 0), 2), 10, 2)', 'Amount')
          .addSelect('CASE WHEN stil.itemId = i.id THEN 1 ELSE 0 END', 'IsReturn')
          .addSelect(
            `STR(ISNULL(si.quantity, 0)) + ' ' + u.unit + ' @ ' + STR(ROUND(ISNULL(si.price, 0), 2), 4, 2) + ' - ' + ` +
              `CASE WHEN d.isVatExempt = 1 THEN ('Less P' + STR(CAST((((si.price-(si.amount + si.discountAmount))+si.discountAmount)) AS VARCHAR), 4, 2)) ELSE '' END + ' ' + ` +
              `CASE WHEN t.tax NOT IN ('NON-VAT','VAT EXEMPT') THEN CAST(t.tax AS VARCHAR) ELSE '' END`,
            'ItemDetails'
          )
          .where('c.collectionNumber IN (:...batch)', { batch })
          .getRawMany<Sale>()

        // ── 3. Payment Methods ──────────────────────────────────────────────────
        const paymentData = await AppDataSource.getRepository(TrnCollectionEntity)
          .createQueryBuilder('c')
          .innerJoin(TrnCollectionLineEntity, 'cm', 'cm.collectionId = c.id AND cm.amount > 0')
          .leftJoin('cm.payType', 'p')
          .select('c.collectionNumber', 'CollectionNumber')
          .addSelect('p.payType', 'PayType')
          .addSelect('SUM(cm.amount)', 'Amount')
          .where('c.collectionNumber IN (:...batch)', { batch })
          .groupBy('c.collectionNumber')
          .addGroupBy('cm.payTypeId')
          .addGroupBy('p.payType')
          .getRawMany<CollectionMethod>()

        // ── 4. VAT Analysis ─────────────────────────────────────────────────────
        const vaData = await AppDataSource.getRepository(TrnCollectionEntity)
          .createQueryBuilder('c')
          .innerJoin('c.sales', 's')
          .innerJoin('s.salesLines', 'si')
          .leftJoin('si.discount', 'd')
          .leftJoin('si.item', 'i')
          .leftJoin('si.tax', 't')
          .select('c.collectionNumber', 'CollectionNumber')
          .addSelect('s.amount + SUM(si.discountAmount)', 'GrossSales')
          .addSelect('s.amount', 'NetSales')
          .addSelect('SUM(si.discountAmount)', 'DiscountAmount')
          .addSelect('c.changeAmount', 'ChangeAmount')
          .addSelect(
            `SUM(CASE WHEN si.taxRate > 0 AND d.discount NOT IN ('Senior Citizen Discount','PWD') THEN si.taxAmount ELSE 0 END)`,
            'TaxAmount'
          )
          .addSelect('t.tax', 'Tax')
          .addSelect(
            `CASE WHEN t.tax = 'VAT' AND d.isVatExempt = 0 THEN (SUM(si.amount) - SUM(si.taxAmount)) ELSE 0 END`,
            'VATSales'
          )
          .addSelect(
            `SUM(CASE WHEN i.itemDescription = 'SERVICE CHARGE' THEN si.amount ELSE 0 END)`,
            'ServiceCharge'
          )
          .addSelect('d.discount', 'Discount')
          .addSelect(
            `SUM(CASE WHEN d.isVatExempt = 1 THEN si.amount ELSE 0 END) + SUM(si.discountAmount)`,
            'VATExempt'
          )
          .where('c.collectionNumber IN (:...batch)', { batch })
          .groupBy('c.collectionNumber')
          .addGroupBy('s.amount')
          .addGroupBy('c.changeAmount')
          .addGroupBy('t.tax')
          .addGroupBy('d.discount')
          .addGroupBy('d.isVatExempt')
          .getRawMany<VATAnalysis>()

        // ── 5. Transaction Details ──────────────────────────────────────────────
        const detailData = await AppDataSource.getRepository(TrnCollectionEntity)
          .createQueryBuilder('c')
          .innerJoin('c.sales', 's')
          .leftJoin('s.salesLines', 'si')
          .leftJoin('si.discount', 'd')
          .leftJoin('s.terminal', 'tr')
          .leftJoin('s.customer', 'ct')
          .leftJoin('s.salesAgentUser' as any, 'sb')
          .leftJoin('s.preparedByUser', 'pb')
          .leftJoin('s.updateUser', 'upb')
          .leftJoin('s.table', 'tb')
          .leftJoin(TrnStockInEntity, 'sti', 'sti.collectionId = c.id')
          .select('c.collectionNumber', 'CollectionNumber')
          .addSelect(`'Return Number:' + ISNULL(sti.stockInNumber, '')`, 'ReturnNumber')
          .addSelect('ISNULL(s.isReturn, 0)', 'IsReturn')
          .addSelect('ISNULL(s.isCancelled, 0)', 'IsCancelled')
          .addSelect(`ISNULL(s.salesNumber, 'NA')`, 'TransactionNumber')
          .addSelect(`ISNULL(s.seniorCitizenId, 'NA')`, 'SeniorCitizenId')
          .addSelect(`ISNULL(s.seniorCitizenName, 'NA')`, 'SeniorCitizenName')
          .addSelect(`ISNULL(CAST(s.seniorCitizenAge AS VARCHAR), 'NA')`, 'SeniorCitizenAge')
          .addSelect(`ISNULL(CAST(s.childName AS VARCHAR), 'NA')`, 'SeniorCitizenChildName')
          .addSelect(`ISNULL(CAST(s.dateOfBirth AS VARCHAR), 'NA')`, 'SeniorCitizenChildBirthdate')
          .addSelect(`ISNULL(CAST(s.tinNumber AS VARCHAR), 'NA')`, 'SeniorCitizenTINNumber')
          .addSelect(`ISNULL(CAST(s.pax AS VARCHAR), 'NA')`, 'PaxNumber')
          .addSelect('tr.terminal', 'Terminal')
          .addSelect('ct.customer', 'Customer')
          .addSelect('ct.tin', 'CustomerTIN')
          .addSelect('ct.address', 'CustomerAddress')
          .addSelect(
            `CASE WHEN ISNULL(ct.withReward, 0) = 1 THEN 'WITH REWARD' ELSE 'NO REWARD' END`,
            'IsReward'
          )
          .addSelect('pb.fullName', 'PreparedBy')
          .addSelect('sb.fullName', 'ServedBy')
          .addSelect('upb.fullName', 'UpdatedBy')
          .addSelect('ISNULL(c.updateDateTime, c.entryDateTime)', 'DateCreated')
          .addSelect('tb.tableCode', 'TableCode')
          .where('c.collectionNumber IN (:...batch)', { batch })
          .groupBy('c.collectionNumber')
          .addGroupBy('s.seniorCitizenId')
          .addGroupBy('s.seniorCitizenName')
          .addGroupBy('s.seniorCitizenAge')
          .addGroupBy('s.salesNumber')
          .addGroupBy('s.pax')
          .addGroupBy('s.childName')
          .addGroupBy('s.dateOfBirth')
          .addGroupBy('s.tinNumber')
          .addGroupBy('tr.terminal')
          .addGroupBy('ct.customer')
          .addGroupBy('ct.withReward')
          .addGroupBy('ct.tin')
          .addGroupBy('ct.address')
          .addGroupBy('pb.fullName')
          .addGroupBy('sb.fullName')
          .addGroupBy('c.updateDateTime')
          .addGroupBy('c.entryDateTime')
          .addGroupBy('tb.tableCode')
          .addGroupBy('upb.fullName')
          .addGroupBy('s.isReturn')
          .addGroupBy('s.isCancelled')
          .addGroupBy('sti.stockInNumber')
          .getRawMany<Details>()

        // ── Build lookup maps ───────────────────────────────────────────────────
        const { salesMap, paymentsMap, vaMap, detailsMap } = this.buildLookupMaps(
          salesData,
          paymentData,
          vaData,
          detailData
        )

        // ── Generate receipts for the batch ────────────────────────────────────
        const batchHasRecords = await this.writeBatchReceipts({
          stream,
          batch,
          salesMap,
          paymentsMap,
          vaMap,
          detailsMap,
          header,
          footer
        })
        if (batchHasRecords) {
          hasRecords = true
        }
      }
    } catch (error: unknown) {
      console.error('Error generating E-Journal:', (error as Error).message)
      throw error
    } finally {
      if (!hasRecords) {
        stream.write('NO RECORDS')
      }
      stream.end()
    }
  }

  private static buildLookupMaps(
    salesData: Sale[],
    paymentData: CollectionMethod[],
    vaData: VATAnalysis[],
    detailData: Details[]
  ): {
    salesMap: Map<string, Sale[]>
    paymentsMap: Map<string, CollectionMethod[]>
    vaMap: Map<string, VATAnalysis[]>
    detailsMap: Map<string, Details>
  } {
    const salesMap = new Map<string, Sale[]>()
    const paymentsMap = new Map<string, CollectionMethod[]>()
    const vaMap = new Map<string, VATAnalysis[]>()
    const detailsMap = new Map<string, Details>()

    salesData.forEach((item) => {
      if (!item.CollectionNumber) return
      const items = salesMap.get(item.CollectionNumber) || []
      items.push(item)
      salesMap.set(item.CollectionNumber, items)
    })

    paymentData.forEach((item) => {
      if (!item.CollectionNumber) return
      const items = paymentsMap.get(item.CollectionNumber) || []
      items.push(item)
      paymentsMap.set(item.CollectionNumber, items)
    })

    vaData.forEach((item) => {
      if (!item.CollectionNumber) return
      const items = vaMap.get(item.CollectionNumber) || []
      items.push(item)
      vaMap.set(item.CollectionNumber, items)
    })

    detailData.forEach((item) => {
      if (item.CollectionNumber) {
        detailsMap.set(item.CollectionNumber, item)
      }
    })

    return { salesMap, paymentsMap, vaMap, detailsMap }
  }

  private static async writeBatchReceipts(params: {
    stream: fs.WriteStream
    batch: string[]
    salesMap: Map<string, Sale[]>
    paymentsMap: Map<string, CollectionMethod[]>
    vaMap: Map<string, VATAnalysis[]>
    detailsMap: Map<string, Details>
    header: string
    footer: string
  }): Promise<boolean> {
    const {
      stream,
      batch,
      salesMap,
      paymentsMap,
      vaMap,
      detailsMap,
      header,
      footer
    } = params
    let hasRecords = false
    for (const cn of batch) {
      const saleItems = salesMap.get(cn) || []
      const totalItem = saleItems.length || 0
      const paymentMethods = paymentsMap.get(cn) || []
      const details = detailsMap.get(cn) || ({} as Details)
      const va: VATAnalysis = vaMap.get(cn)?.[0] || ({} as VATAnalysis)

      const paymentsContent: string = paymentMethods
        .map(
          (pm) =>
            `${pm?.PayType ?? ''}                              ${formatNumber(pm?.Amount)}`
        )
        .join('\n')

      const salesInvoice = SalesInvoice({
        title: 'SALES INVOICE',
        collectionNumber: cn,
        saleItems,
        payments: paymentsContent,
        details,
        VATAnalysis: va,
        totalItem
      })

      const cancelReceipt = CancelReceipt({
        title: 'Cancelled Sales Receipt',
        collectionNumber: cn,
        saleItems,
        details,
        VATAnalysis: va,
        totalItem
      })

      const returnSlip = ReturnSlip({
        title: 'RETURN SLIP',
        saleItems,
        details,
        grossSales: va?.GrossSales
      })

      const isReturnSlip =
        String(details?.ReturnNumber ?? '').length > 0 ? returnSlip : salesInvoice
      const receiptContent = (details?.IsCancelled ?? false) ? cancelReceipt : isReturnSlip

      const fullReceipt = `${header}${receiptContent}${footer}\n\n`
      if (!stream.write(fullReceipt)) {
        await new Promise((resolve) => stream.once('drain', () => resolve(undefined)))
      }
      hasRecords = true
    }
    return hasRecords
  }
}
