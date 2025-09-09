import { Error as err, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import {
  calculateAge,
  formatDateDash,
  formatDateFD,
  formatDateSlash,
  formatDateYYYYMMDDHHMMSS
} from '../../../functions'
import { recordByQuery } from '../../../model'

const formatNumber = (value: number | undefined, defaultValue = 0): string =>
  (Math.round((value ?? defaultValue) * 100) / 100).toFixed(2)

// Escape single quotes for SQL safety
const escapeSingleQuote = (str: string) => str.replace(/'/g, "''")

interface Sale {
  CollectionNumber: string
  ItemDescription: string
  Amount: number
  ItemDetails: string
}
interface CollectionMethod {
  CollectionNumber: string
  PayType: string
  Amount: number
}
interface VATAnalysis {
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
}
interface Details {
  CollectionNumber: string
  TransactionNumber: string
  SeniorCitizenId: string
  SeniorCitizenName: string
  SeniorCitizenAge: string
  SeniorCitizenChildName: string
  SeniorCitizenTINNumber: string
  SeniorCitizenBirthdate: string
  PaxNumber: string
  Terminal: string
  Customer: string
  CustomerTIN: string
  CustomerAddress: string
  IsReward: boolean
  PreparedBy: string
  ServedBy: string
  DateCreated: string
  TableCode: string
  BusinessStyle?: string
  Signature?: string
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
            i.ItemDescription,
            STR(ROUND(ISNULL((si.Amount), 0), 2), 10, 2) AS Amount,
            STR(ROUND(ISNULL((si.Quantity), 0), 2), 4, 0)
            + ' ' +
            u.Unit + ' @ ' +
            STR(ROUND(ISNULL((si.Price), 0), 2), 4, 2)+ ' - ' +
            CASE WHEN d.Discount = 'Senior Citizen Discount' OR d.Discount = 'PWD' 
              THEN ('Less P' + STR(CAST((((si.Price-(si.Amount + si.DiscountAmount))+si.DiscountAmount)) AS VARCHAR),4,2))
              ELSE '' END + ' ' +
            CAST(t.TAX AS VARCHAR)
               AS ItemDetails
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
              SUM(CASE WHEN (i.ItemDescription = 'SERVICE CHARGE') THEN si.Amount ELSE 0 END) AS ServiceCharge,
              SUM(CASE
                WHEN d.Discount IN ('Senior Citizen Discount', 'PWD') 
                  THEN si.Amount 
                ELSE 0
              END) + SUM(si.DiscountAmount) AS VATExempt
            FROM TrnCollection AS c
            LEFT JOIN TrnSales AS s ON s.Id = c.SalesId 
            LEFT JOIN TrnSalesLine AS si ON si.SalesId = s.Id
            LEFT JOIN MstDiscount AS d ON d.Id = si.DiscountId
            LEFT JOIN MstItem AS i ON i.Id = si.ItemId
            WHERE c.CollectionNumber IN (${inClause})
            GROUP BY 
              c.CollectionNumber,
              s.Amount,
              c.ChangeAmount
              
            `),

          recordByQuery(`
           SELECT 
              c.[CollectionNumber],
              ISNULL(s.[SalesNumber],'NA') AS [TransactionNumber], 
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
              ISNULL(c.UpdateDateTime, c.EntryDateTime) AS DateCreated,
              tb.TableCode
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
              s.SeniorCitizenId,
              s.SeniorCitizenName,
              s.SeniorCitizenAge,
              s.[SalesNumber],
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
              tb.TableCode
              
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
          const salesItems = salesMap.get(cn) || []
          const totalItem = salesItems?.length ?? 0
          const paymentMethods = paymentsMap.get(cn) || []
          const details = detailsMap.get(cn) || {}
          const va: VATAnalysis = vaMap.get(cn)[0] || []

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
ITEM                                  AMOUNT
${itemsContent}
TOTAL SALES                           ${formatNumber(va?.NetSales ?? '0')}
TOTAL DISCOUNT                        ${formatNumber(va?.DiscountAmount ?? '0')}
--------------------------------------------
${paymentsContent}   
# OF ITEMS                             ${totalItem}        
--------------------------------------------
CHANGE                                ${formatNumber(va?.ChangeAmount ?? '0')}
GROSS SALES                           ${formatNumber(va?.GrossSales ?? '0')}
--------------------------------------------
VAT ANALYSIS
VAT EXEMPT                            ${formatNumber(va?.VATExempt) ?? 0}
SERVICE CHARGE                        ${formatNumber(va?.ServiceCharge) ?? 0}
VAT SALES                             ${formatNumber(va?.VATSales) ?? 0}
VAT                                   ${formatNumber(va?.TaxAmount) ?? 0}
Zero-Rated Sales                      ${formatNumber(va?.ZeroRated ?? 0)}
--------------------------------------------
SENIOR / PWD / NAAC / SP INFORMATION
--------------------------------------------
TIN NO.                         ${details?.SeniorCitizenTINNumber ?? ''}
ID NO.                          ${details?.SeniorCitizenId ?? ''}
NAME                            ${details?.SeniorCitizenName ?? ''}
CHILD NAME                      ${details?.SeniorCitizenChildName ?? ''}
CHILD AGE                       ${details?.SeniorCitizenChildBirthdate ? calculateAge(details?.SeniorCitizenChildBirthdate ?? '') : ''}
BIRTHDATE                       ${details?.SeniorCitizenChildBirthdate ? formatDateSlash(details?.SeniorCitizenChildBirthdate ?? '') : ''}
--------------------------------------------
TRN. NO.                       ${details?.TransactionNumber ?? ''}
CASHIER                        ${details?.PreparedBy ?? ''}
TERMINAL                       ${details?.Terminal ?? ''}
SERVED BY                      ${details?.ServedBy ?? ''}
TABLE                          ${details?.TableCode ?? ''}
NO. PAX                        ${details?.PaxNumber ?? ''}
REWARD                         ${details?.IsReward ?? ''}
NAME                           ${details?.Customer ?? '________________________'}
ADDRESS                        ${details?.CustomerAddress ?? '________________________'}
                               ________________________
TIN                            ${details?.CustomerTIN ?? '________________________'}
TIME                           ${formatDateFD(new Date(details?.DateCreated))}
BUSINESS STYLE                 ${details?.BusinessStyle ?? '________________________'}
SIGNATURE                      ${'________________________'}
`

          const fullReceipt = `${header}${receiptContent}${footer}\n\n`
          if (!stream.write(fullReceipt)) {
            await new Promise((resolve) => stream.once('drain', resolve))
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
