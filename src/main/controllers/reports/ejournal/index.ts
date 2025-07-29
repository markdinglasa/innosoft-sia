import { Error, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { formatDateDash, formatDateFD, formatDateYYYYMMDDHHMMSS } from '../../../functions'
import { recordByQuery } from '../../../model'

const formatNumber = (value: number | undefined, defaultValue = 0): string =>
  (Math.round((value ?? defaultValue) * 100) / 100).toFixed(2)

// Escape single quotes for SQL safety
const escapeSingleQuote = (str: string) => str.replace(/'/g, "''")

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
          ISNULL(IsCancelled,0) = 0
          AND ISNULL(IsLocked,0) = 1
          AND CAST([CollectionDate] AS DATE) 
            BETWEEN '${formatDateDash(new Date(dateStart))}' 
            AND '${formatDateDash(new Date(dateEnd))}'
      `)

      const collectionNumbers =
        (collectionResult?.List?.map((cn) => cn?.CollectionNumber).filter(Boolean) as string[]) ||
        []

      if (collectionNumbers.length === 0) {
        stream.write('NO RECORDS')
        return { IsSomething: true, Message: Success.s00x00 }
      }

      // Process in batches
      const BATCH_SIZE = 1000
      for (let i = 0; i < collectionNumbers.length; i += BATCH_SIZE) {
        const batch = collectionNumbers.slice(i, i + BATCH_SIZE)
        const inClause = batch.map((cn) => `'${escapeSingleQuote(cn)}'`).join(',')

        // Fetch all data needed for the current batch
        const [salesData, paymentData, detailData] = await Promise.all([
          recordByQuery(`
            SELECT 
              c.CollectionNumber,
              i.ItemDescription,
              STR(ROUND(ISNULL((si.Amount), 0), 2), 10, 2) AS Amount,
              CONCAT(
                STR(ROUND(ISNULL((si.Quantity), 0), 2), 4, 0), ' ',
                u.Unit, ' @ ',
                STR(ROUND(ISNULL((si.Price), 0), 2), 4, 2), ' - ',
                CASE WHEN d.Discount = 'Senior Citizen Discount' OR d.Discount = 'PWD' 
                  THEN CONCAT('Less P', STR(CAST((((si.Price-(si.Amount + si.DiscountAmount))+si.DiscountAmount)) AS VARCHAR),4,2)) 
                  ELSE '' END, ' ',
                CAST(t.TAX AS VARCHAR)
              ) AS ItemDetails
            FROM TrnCollection AS c
            LEFT JOIN TrnSales AS s ON s.Id = c.SalesId 
            LEFT JOIN TrnSalesLine AS si ON si.SalesId = s.Id
            LEFT JOIN MstDiscount AS d ON d.Id = si.DiscountId
            LEFT JOIN MstUnit AS u ON u.Id = si.UnitId
            LEFT JOIN MstItem AS i ON i.Id = si.ItemId
            LEFT JOIN MstTax AS t ON t.Id = si.TaxId
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
              (SUM(si.Amount)-SUM(si.TaxAmount)) AS VATSales,
              ISNULL(s.SeniorCitizenId,'NA') AS SeniorCitizenId, 
              ISNULL(s.SeniorCitizenName,'NA') AS SeniorCitizenName, 
              ISNULL(CAST(s.SeniorCitizenAge AS VARCHAR),'NA') AS SeniorCitizenAge,
              tr.Terminal,
              ct.Customer,
              CASE WHEN (ISNULL(ct.WithReward,0) = 1) THEN 'WITH REWARD' ELSE 'NO REWARD' END AS IsReward,
              pb.FullName AS PreparedBy,
              sb.FullName AS ServedBy,
              ISNULL(c.UpdateDateTime, c.EntryDateTime) AS DateCreated,
              tb.TableCode,
              SUM(CASE WHEN (si.ItemId = 1) THEN si.Amount ELSE 0 END) AS ServiceCharge,
              SUM(CASE
                WHEN d.Discount IN ('Senior Citizen Discount', 'PWD') 
                  THEN si.Amount 
                ELSE 0
              END) + SUM(si.DiscountAmount) AS VATExempt
            FROM TrnCollection AS c
            LEFT JOIN TrnSales AS s ON s.Id = c.SalesId 
            LEFT JOIN TrnSalesLine AS si ON si.SalesId = s.Id
            LEFT JOIN MstDiscount AS d ON d.Id = si.DiscountId
            LEFT JOIN MstTerminal AS tr ON tr.Id = s.TerminalId
            LEFT JOIN MstCustomer AS ct ON ct.Id = s.CustomerId
            LEFT JOIN MstUser AS sb ON sb.Id = s.SalesAgent
            LEFT JOIN MstUser AS pb ON pb.Id = s.PreparedBy
            LEFT JOIN MstTable AS tb ON tb.Id = s.TableId
            WHERE c.CollectionNumber IN (${inClause})
            GROUP BY 
              c.CollectionNumber,
              s.Amount,
              c.ChangeAmount,
              s.SeniorCitizenId,
              s.SeniorCitizenName,
              s.SeniorCitizenAge,
              tr.Terminal,
              ct.Customer,
              ct.WithReward,
              pb.FullName,
              sb.FullName,
              c.UpdateDateTime,
              c.EntryDateTime,
              tb.TableCode
          `)
        ])

        // Create lookup maps
        const salesMap = new Map<string, any[]>()
        const paymentsMap = new Map<string, any[]>()
        const detailsMap = new Map<string, any>()

        salesData?.List?.forEach((item: any) => {
          if (!item.CollectionNumber) return
          const items = salesMap.get(item.CollectionNumber) || []
          items.push(item)
          salesMap.set(item.CollectionNumber, items)
        })

        paymentData?.List?.forEach((item: any) => {
          if (!item.CollectionNumber) return
          const items = paymentsMap.get(item.CollectionNumber) || []
          items.push(item)
          paymentsMap.set(item.CollectionNumber, items)
        })

        detailData?.List?.forEach((item: any) => {
          if (item.CollectionNumber) {
            detailsMap.set(item.CollectionNumber, item)
          }
        })

        // Generate receipts for the batch
        for (const cn of batch) {
          const salesItems = salesMap.get(cn) || []
          const paymentMethods = paymentsMap.get(cn) || []
          const details = detailsMap.get(cn) || {}

          const itemsContent = salesItems
            .map(
              (item) =>
                `${item?.ItemDescription ?? ''}                            ${formatNumber(item?.Amount)}\n${item?.ItemDetails ?? ''}`
            )
            .join('\n')

          const paymentsContent = paymentMethods
            .map(
              (pm) =>
                `${pm?.PayType ?? ''}                              ${formatNumber(pm?.Amount)}`
            )
            .join('\n')

          const receiptContent = `

                SALES INVOICE
              ${cn}
            ${formatDateFD(new Date(details?.DateCreated))}
--------------------------------------------
Item                                  Amount
${itemsContent}
TOTAL SALES:                          ${formatNumber(details?.NetSales)}
TOTAL DISCOUNT                        ${formatNumber(details?.DiscountAmount)}
--------------------------------------------
${paymentsContent}           
--------------------------------------------
CHANGE                                ${formatNumber(details?.ChangeAmount)}
GROSS SALES                           ${formatNumber(details?.GrossSales)}
--------------------------------------------
                VAT ANAYLYSIS
--------------------------------------------
                                      AMOUNT
VAT EXEMPT                            ${formatNumber(details?.VATExempt) ?? 0}
SERVICE CHARGE                        ${formatNumber(details?.ServiceCharge) ?? 0}
VAT                                   ${formatNumber(details?.TaxAmount) ?? 0}
--------------------------------------------
        SENIOR CITIZEN's INFORMATION
--------------------------------------------
ID NO.                         ${details?.SeniorCitizenId ?? ''}
NAME                           ${details?.SeniorCitizenName ?? ''}
AGE                            ${details?.SeniorCitizenAge ?? ''}
--------------------------------------------
PREPARED BY                    ${details?.PreparedBy ?? ''}
TERMINAL                       ${details?.Terminal ?? ''}
CUSTOMER                       ${details?.Customer ?? ''}
REWARD                         ${details?.IsReward ?? ''}
SERVED BY                      ${details?.ServedBy ?? ''}
TABLE NO.                      ${details?.TableCode ?? ''}`

          const fullReceipt = `${header}${receiptContent}${footer}\n\n`

          if (!stream.write(fullReceipt)) {
            // Handle backpressure
            await new Promise((resolve) => stream.once('drain', resolve))
          }

          hasRecords = true
        }
      }

      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error processing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    } finally {
      if (!hasRecords) {
        stream.write('NO RECORDS')
      }
      stream.end()
    }
  }
)
