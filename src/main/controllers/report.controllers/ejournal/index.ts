import { Error as err, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { formatDateDash, formatDateYYYYMMDDHHMMSS, formatNumber } from '../../../functions'
import { recordByQuery } from '../../../model'
import { CancelReceipt } from './cancel-receipt'
import { ReturnSlip } from './return-slip'
import { SalesInvoice } from './sales-invoice'

// Escape single quotes for SQL safety
const escapeSingleQuote = (str: string) => str.replace(/'/g, "''")

export interface Sale {
  CollectionNumber: string
  ItemDescription: string
  Amount: number
  ItemDetails: string
  IsReturn: boolean
}
interface CollectionMethod {
  CollectionNumber: string
  PayType: string
  Amount: number
}
export interface VATAnalysis {
  CollectionNumber: string
  GrossSales: number
  DiscountAmount: number
  ChangeAmount: number
  TaxAmount: number
  VATSales: number
  ServiceCharge: number
  VATExempt: number
  NetSales: number
  ZeroRated: number //
  Tax: string
  Discount: string
}
export interface Details {
  CollectionNumber: string
  TransactionNumber: string // order-number
  ReturnNumber?: string
  SeniorCitizenId: string
  SeniorCitizenName: string
  SeniorCitizenAge: string
  SeniorCitizenChildName: string
  SeniorCitizenTINNumber: string
  SeniorCitizenChildBirthdate: string
  PaxNumber: string
  Terminal: string
  Customer: string
  CustomerTIN: string
  CustomerAddress: string
  IsReward: boolean
  PreparedBy: string
  ServedBy: string
  UpdatedBy?: string
  DateCreated: string
  TableCode: string
  BusinessStyle?: string
  Signature?: string
  IsReturn?: boolean
  IsCancelled?: boolean
  Terms?: string
}
ipcMain.handle(
  SqlChannel.E_JOURNAL,
  async (
    _event: any,
    {
      dateStart,
      dateEnd,
      targetDir,
      header,
      footer
    }: { dateStart: string; dateEnd: string; targetDir: string; header?: string; footer?: string }
  ): Promise<Response> => {
    const filePath = paths.join(targetDir, `e-journal_${formatDateYYYYMMDDHHMMSS(new Date())}.csv`)

    const stream = fs.createWriteStream(filePath, { encoding: 'utf8' })
    let hasRecords = false

    try {
      // Validation
      if (!dateStart || !dateEnd || !targetDir) {
        return { IsSomething: false, Message: 'Missing required parameters' }
      }

      // Get all collection numbers in the date range
      const collectionResult = await recordByQuery(`
        SELECT [CollectionNumber] 
        FROM [TrnCollection] 
        WHERE 
          ISNULL(IsLocked,0) = 1
          AND CAST([CollectionDate] AS DATE) 
            BETWEEN '${formatDateDash(new Date(dateStart))}' 
            AND '${formatDateDash(new Date(dateEnd))}'
      `)

      const collectionNumbers =
        (collectionResult?.List?.map((cn) => cn?.CollectionNumber).filter(Boolean) as string[]) ||
        []

      if (collectionNumbers.length === 0) {
        stream.write('NO RECORDS')
        return { IsSomething: false, Message: 'No records were found' }
      }
      if (collectionNumbers.length > 1000) {
        stream.write('CONTENT TOO LARGE')
        return { IsSomething: false, Message: 'Content were to large.' }
      }

      // Process in batches
      const BATCH_SIZE = 250
      for (let i = 0; i < collectionNumbers.length; i += BATCH_SIZE) {
        const batch = collectionNumbers.slice(i, i + BATCH_SIZE)
        const inClause = batch.map((cn) => `'${escapeSingleQuote(cn)}'`).join(',')

        // Fetch all data needed for the current batch

        const [salesData, paymentData, vaData, detailData] = await Promise.all([
          recordByQuery(` 
            SELECT 
            c.CollectionNumber,
            i.ItemCode,
            i.ItemDescription,
            STR(ROUND(ISNULL((si.Amount), 0), 2), 10, 2) AS Amount,
            CASE WHEN (stil.ItemId = i.Id ) THEN 1 ELSE 0 END AS IsReturn,
            STR(ISNULL((si.Quantity), 0))
            + ' ' +
            u.Unit + ' @ ' +
            STR(ROUND(ISNULL((si.Price), 0), 2), 4, 2)+ ' - ' +
            CASE WHEN d.IsVatExempt = 1
              THEN ('Less P' + STR(CAST((((si.Price-(si.Amount + si.DiscountAmount))+si.DiscountAmount)) AS VARCHAR),4,2))
              ELSE '' END + ' ' +
           CASE WHEN t.Tax NOT IN ('NON-VAT','VAT EXEMPT') THEN CAST(t.TAX AS VARCHAR) ELSE '' END
               AS ItemDetails
            FROM TrnCollection AS c
            LEFT JOIN TrnOrder AS s ON s.Id = c.OrderId 
            LEFT JOIN TrnOrderLine AS si ON si.OrderId = s.Id
            LEFT JOIN MstDiscount AS d ON d.Id = si.DiscountId
            LEFT JOIN MstUnit AS u ON u.Id = si.UnitId
            INNER JOIN MstItem AS i ON i.Id = si.ItemId
            LEFT JOIN MstTax AS t ON t.Id = si.TaxId
            LEFT JOIN TrnStockIn AS sti ON sti.CollectionId = c.Id
            LEFT JOIn TrnOrderLine AS stil ON stil.OrderId = sti.OrderId
            WHERE c.CollectionNumber IN (${inClause})
          `),
          recordByQuery(`
            SELECT 
              c.CollectionNumber,
              p.PayType,
              SUM(cm.Amount) AS Amount
            FROM TrnCollection AS c
            LEFT JOIN TrnCollectionLine AS cm ON cm.CollectionId = c.Id
            LEFT JOIN MstPayType AS p ON p.Id = cm.PayTypeId
            WHERE 
              c.CollectionNumber IN (${inClause})
              AND cm.Amount > 0
            GROUP BY 
              c.CollectionNumber,
              cm.PayTypeId,
              p.PayType
          `),

          recordByQuery(`
            SELECT 
              c.CollectionNumber,
              s.Amount + SUM(si.DiscountAmount) AS GrossSales,
              s.Amount AS NetSales,
              SUM(si.DiscountAmount) AS DiscountAmount,
              c.ChangeAmount,
              SUM(CASE
                WHEN si.TaxRate > 0 AND d.Discount NOT IN ('Senior Citizen Discount', 'PWD') 
                  THEN si.TaxAmount
                ELSE 0
              END) AS TaxAmount,
				t.Tax AS Tax,
              CASE WHEN t.Tax = 'VAT' AND d.IsVatExempt = 0 THEN (SUM(si.Amount)-SUM(si.TaxAmount)) ELSE 0 END AS VATSales,
              SUM(CASE WHEN (i.ItemDescription = 'SERVICE CHARGE') THEN si.Amount ELSE 0 END) AS ServiceCharge,
              d.Discount AS Discount,
              SUM(CASE
                WHEN d.IsVatExempt = 1
                  THEN si.Amount 
                ELSE 0
              END) + SUM(si.DiscountAmount) AS VATExempt
            FROM TrnCollection AS c
            LEFT JOIN TrnOrder AS s ON s.Id = c.OrderId 
            LEFT JOIN TrnOrderLine AS si ON si.OrderId = s.Id
            LEFT JOIN MstDiscount AS d ON d.Id = si.DiscountId
            LEFT JOIN MstItem AS i ON i.Id = si.ItemId
            LEFT JOIN MstTax AS t ON t.Id = si.TaxId
			      WHERE c.CollectionNumber IN (${inClause})
            GROUP BY 
              c.CollectionNumber,
              s.Amount,
              c.ChangeAmount,
              t.Tax,
              d.Discount,
              d.IsVatExempt
            `),

          recordByQuery(`
            SELECT 
              c.[CollectionNumber],
              'Return Number:' + sti.StockInNumber AS ReturnNumber,
              ISNULL(s.IsReturn,0) AS [IsReturn],
              ISNULL(s.IsCancelled,0) AS [IsCancelled],
              ISNULL(s.[OrderNumber],'NA') AS [TransactionNumber], 
              ISNULL(s.[SeniorCitizenId],'NA') AS [SeniorCitizenId], 
              ISNULL(s.[SeniorCitizenName],'NA') AS [SeniorCitizenName], 
              ISNULL(CAST(s.[SeniorCitizenAge] AS VARCHAR),'NA') AS [SeniorCitizenAge],
              ISNULL(CAST(s.[ChildName] AS VARCHAR),'NA') AS [SeniorCitizenChildName],
              ISNULL(CAST(s.[DateOfBirth] AS VARCHAR),'NA') AS [SeniorCitizenBirthdate],
			        ISNULL(CAST(s.[TINNumber] AS VARCHAR),'NA') AS [SeniorCitizenTINNumber],
              ISNULL(CAST(s.[Pax] AS VARCHAR),'NA') AS [PaxNumber],
              tr.[Terminal],
              ct.[Customer],
              ct.[TIN] AS [CustomerTIN],
              ct.[Address] AS [CustomerAddress],
              CASE WHEN (ISNULL(ct.WithReward,0) = 1) THEN 'WITH REWARD' ELSE 'NO REWARD' END AS IsReward,
              pb.FullName AS PreparedBy,
              sb.FullName AS ServedBy,
              upb.Fullname AS UpdatedBy,
              ISNULL(c.UpdateDateTime, c.EntryDateTime) AS DateCreated,
              tb.TableCode
            FROM TrnCollection AS c
            LEFT JOIN TrnOrder AS s ON s.Id = c.OrderId 
            LEFT JOIN TrnOrderLine AS si ON si.OrderId = s.Id
            LEFT JOIN MstDiscount AS d ON d.Id = si.DiscountId
            LEFT JOIN MstTerminal AS tr ON tr.Id = s.TerminalId
            LEFT JOIN MstCustomer AS ct ON ct.Id = s.CustomerId
            LEFT JOIN MstUser AS sb ON sb.Id = s.SalesAgent
            LEFT JOIN MstUser AS pb ON pb.Id = s.PreparedBy
            LEFT JOIN MstUser AS upb ON upb.Id = s.[UpdateUserId]
            LEFT JOIN MstTable AS tb ON tb.Id = s.TableId
            LEFT JOIN TrnStockIn AS sti ON sti.CollectionId = c.Id
            WHERE c.CollectionNumber IN (${inClause})
            GROUP BY 
              c.CollectionNumber,
              s.SeniorCitizenId,
              s.SeniorCitizenName,
              s.SeniorCitizenAge,
              s.[OrderNumber],
              s.[Pax],
              s.[ChildName],
              s.[DateOfBirth],
              s.[TINNumber],
              tr.Terminal,
              ct.Customer,
              ct.WithReward,
              ct.[TIN],
              ct.[Address],
              pb.FullName,
              sb.FullName,
              c.UpdateDateTime,
              c.EntryDateTime,
              tb.TableCode,
              upb.Fullname,
              ISNULL(s.IsReturn,0),
              ISNULL(s.IsCancelled,0),
              sti.StockInNumber
              
          `)
        ])

        //console.log('VAT Analysis-Data', vaData)

        // Create lookup maps
        const salesMap = new Map<string, Sale[]>()
        const paymentsMap = new Map<string, CollectionMethod[]>()
        const vaMap = new Map<string, any>() // VAT Analysis
        const detailsMap = new Map<string, any>()

        salesData?.List?.forEach((item: Sale) => {
          if (!item.CollectionNumber) return
          const items = salesMap.get(item.CollectionNumber) || []
          items.push(item)
          salesMap.set(item.CollectionNumber, items)
        })
        //console.log('salesMap:', salesMap)
        paymentData?.List?.forEach((item: CollectionMethod) => {
          if (!item.CollectionNumber) return
          const items = paymentsMap.get(item.CollectionNumber) || []
          items.push(item)
          paymentsMap.set(item.CollectionNumber, items)
        })

        vaData?.List?.forEach((item: VATAnalysis) => {
          if (!item.CollectionNumber) return
          const items = vaMap.get(item.CollectionNumber) || []
          items.push(item)
          vaMap.set(item.CollectionNumber, items)
        })

        detailData?.List?.forEach((item: Details) => {
          if (item.CollectionNumber) {
            detailsMap.set(item.CollectionNumber, item)
          }
        })
        // console.log('details:', detailData)

        // Generate receipts for the batch
        for (const cn of batch) {
          const saleItems = salesMap.get(cn) || []
          const totalItem = saleItems.length || 0
          const paymentMethods = paymentsMap.get(cn) || []
          const details = detailsMap.get(cn) || {}
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
            saleItems: saleItems,
            payments: paymentsContent,
            details: details,
            VATAnalysis: va,
            totalItem: totalItem
          })

          const cancelReceipt = CancelReceipt({
            title: 'Cancelled Sales Receipt',
            collectionNumber: cn,
            saleItems: saleItems,
            details: details,
            VATAnalysis: va,
            totalItem: totalItem
          })

          const returnSlip = ReturnSlip({
            title: 'RETURN SLIP',
            saleItems: saleItems,
            details: details,
            grossSales: va?.GrossSales
          })

          const receiptContent = Boolean(details?.IsCancelled ?? false)
            ? cancelReceipt
            : String(details?.ReturnNumber ?? '').length > 0
              ? returnSlip
              : salesInvoice

          const fullReceipt = `${header}${receiptContent}${footer}\n\n`
          if (!stream.write(fullReceipt)) {
            await new Promise((resolve) => stream.once('drain', () => resolve(undefined)))
          }
          hasRecords = true
        }
      }

      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: unknown) {
      console.error('Error processing file:', (error as Error).message)
      return { IsSomething: false, Message: err.e00x02 }
    } finally {
      if (!hasRecords) {
        stream.write('NO RECORDS')
      }
      stream.end()
    }
  }
)
