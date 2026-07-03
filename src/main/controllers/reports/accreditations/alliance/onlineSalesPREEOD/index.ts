import { Error, Success } from '@shared/messages'
import {
  AllianceProductLineQuery,
  AllianceProductsQuery,
  AllianceTransactionDiscountsQuery,
  AllianceTransactionOtherQuery,
  AllianceTransactionVATQuery,
  ZControlNumber,
  AllianceSalesEODQuery,
  AllianceTenderTotalQuery,
  ControlNumberQuery,
  PreviousAmountsQuery,
  ServiceChargeQuery
} from '@shared/query'
import {
  AllianceSalesProduct,
  AllianceSalesTrx,
  AllianceSalesTrxline,
  AllianceType,
  Response,
  SqlChannel
} from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'node:fs'
import paths from 'node:path'
import {
  formatDateDash,
  formatDateYYYYMMDD,
  generateAllianceFilename
} from '../../../../../functions'
import { recordByQuery } from '../../../../../model'

ipcMain.handle(
  SqlChannel.getAllianceOnlineSales,
  async (
    _event: any,
    data: any,
    path: string,
    dates: string,
    category: string
  ): Promise<Response> => {
    try {
      const Terminal = data?.Terminal ?? 0
      const Dates = formatDateDash(new Date(dates ?? ''))

      // 1. Fetch Tender totals
      const TenderQ = AllianceTenderTotalQuery({ Terminal, Dates })
      const TenderResponse = await recordByQuery(TenderQ)
      const TenderData = TenderResponse?.List?.[0] ?? {}

      // 2. Fetch Service Charge
      const ServiceChargeQ: string = ServiceChargeQuery({ Dates, Terminal })
      const ServiceChargeResponse = await recordByQuery(ServiceChargeQ)
      const ServiceChargeData = ServiceChargeResponse?.List?.[0] ?? {}

      // 3. Fetch Control Number
      const ControlNoQuery = ControlNumberQuery({ Terminal, Dates })
      const ControlNoResponse = await recordByQuery(ControlNoQuery)
      const ControlNoData = ControlNoResponse?.List?.[0] ?? {}

      // 4. Fetch Previous Amounts
      const PreviousAmountsQ = PreviousAmountsQuery({ Terminal, Dates })
      const PreviousAmountR = await recordByQuery(PreviousAmountsQ)
      const PreviousAmountData = PreviousAmountR?.List?.[0] ?? {}

      // Extract variables for salesQ
      const CashSales = TenderData.CashSales ?? 0
      const CashSalesCount = TenderData.CashSalesCount ?? 0
      const CreditSales = TenderData.CreditSales ?? 0
      const CreditSalesCount = TenderData.CreditSalesCount ?? 0
      const ChargeSales = TenderData.ChargeSales ?? 0
      const ChargeSalesCount = TenderData.ChargeSalesCount ?? 0
      const GiftCertificateSales = TenderData.GiftCertificateSales ?? 0
      const GiftCertificateSalesCount = TenderData.GiftCertificateSalesCount ?? 0
      const OtherTenderSales = TenderData.OtherTenderSales ?? 0
      const OtherTenderSalesCount = TenderData.OtherTenderSalesCount ?? 0
      const EWT = 0
      const ZeroRated = 0
      const ServiceCharge = ServiceChargeData.ServiceCharge ?? 0
      const ServiceChargeCount = ServiceChargeData.ServiceChargeCount ?? 0
      const ControlNumber = ControlNoData.ControlNumber ?? 0
      
      const PreviousTax = PreviousAmountData.previoustax ?? 0
      const PreviousReading = PreviousAmountData.PreviousReading ?? 0
      const PreviousTaxSales = PreviousAmountData.previoustaxsale ?? 0
      const PreviousNonTaxSales = PreviousAmountData.previousnotaxsale ?? 0

      const salesQ = AllianceSalesEODQuery({
        Terminal,
        Dates,
        PreviousReading,
        PreviousTax,
        PreviousTaxSales,
        PreviousNonTaxSales,
        ControlNumber,
        ServiceCharge,
        ServiceChargeCount,
        CashSales,
        CashSalesCount,
        CreditSales,
        CreditSalesCount,
        ChargeSales,
        ChargeSalesCount,
        GiftCertificateSales,
        GiftCertificateSalesCount,
        OtherTenderSales,
        OtherTenderSalesCount,
        EWT,
        ZeroRated
      })

      // Fetch records based on the provided query
      const salesResponse = await recordByQuery(salesQ)
      
      const ControlNumberZ = await recordByQuery(ZControlNumber({ Dates, Terminal }))
      const controlNumber = ControlNumberZ?.List?.[0]?.ControlNumber ?? 0
      //const trxQuery = AllianceTransactionQuery({ Terminal, Dates })
      //const trnResponse = await recordByQuery(trxQuery)
      const trxDiscQ = AllianceTransactionDiscountsQuery({ Terminal, Dates })
      const trxVATQ = AllianceTransactionVATQuery({ Terminal, Dates })
      const trxOthrQ = AllianceTransactionOtherQuery({ Terminal, Dates })

      const trxDiscR = await recordByQuery(trxDiscQ)
      const trxVATR = await recordByQuery(trxVATQ)
      //console.log('VATS:', trxVATR)
      const trxOthrR = await recordByQuery(trxOthrQ)

      // join all trx by receiptno
      const merge1 = (trxDiscR.List || []).map((disc: any) => {
        const vats = (trxVATR.List ?? []).find((vat: any) => vat.receiptno === disc.receiptno) || {}
        return { ...disc, ...vats }
      })
      const merge2 = merge1.map((item: any) => {
        const other =
          (trxOthrR.List ?? []).find((oth: any) => oth.receiptno === item.receiptno) || {}
        return { ...item, ...other }
      })
      //console.log('trnResponse:', trnResponse)
      // Handle case when response does not have a 'List'
      if (!salesResponse.List || !merge2) {
        return { IsSomething: false, Message: salesResponse.Message }
      }

      // Generate the file name and path
      const fileName = generateAllianceFilename(
        AllianceType.onlineSalesPREEOD,
        data.TenantCode,
        data.Terminal,
        controlNumber,
        dates
      )
      const filePath = paths.join(path, `${fileName}`)

      // Remove existing file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      // Format the sales data
      const SalesId = `
       <id>
          <tenantid>${data.TenantCode ?? 'NA'}</tenantid>
          <key>${data.POSKey ?? 'NA'}</key>
          <tmid>${data.Terminal.toString().padStart(4, '0') ?? 1}</tmid>
          <doc>${'SALES_PREEOD'}</doc>
        </id>
      `
      const products = AllianceProductsQuery({ Terminal, Dates })
      const productsResponse = await recordByQuery(products)

      const Master = (productsResponse?.List || [])
        .map((item: AllianceSalesProduct) => {
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

      const formatNumber = (value: number | undefined, defaultValue = 0): string =>
        Number(value ?? defaultValue).toFixed(2)

      const trx = await Promise.all(
        merge2.map(async (item: AllianceSalesTrx) => {
          const ReceiptNumber = item?.receiptno
          const trxline = AllianceProductLineQuery({ Terminal, Dates, ReceiptNumber })
          const trxlineResponse = await recordByQuery(trxline)

          // Generate SalesLine XML
          const SalesLine = (trxlineResponse?.List || [])
            .map((lineItem: AllianceSalesTrxline) => {
              return `
              <line>
                <sku>${lineItem?.sku ?? 0}</sku>
                <qty>${lineItem?.qty ?? 0}</qty>
                <unitprice>${formatNumber(lineItem?.unitprice)}</unitprice>
                <disc>${formatNumber(lineItem?.disc)}</disc>
                <senior>${formatNumber(lineItem?.senior)}</senior>
                <pwd>${formatNumber(lineItem?.pwd)}</pwd>
                <diplomat>${formatNumber(lineItem?.diplomat)}</diplomat>
                <taxtype>${lineItem?.taxtype ?? 'NA'}</taxtype>
                <tax>${formatNumber(lineItem?.tax)}</tax>
                <memo>NA</memo>
                <total>${formatNumber(lineItem?.total)}</total>
              </line>`
            })
            .join('\n')
          return `
            <trx>
              <receiptno>${item?.receiptno}</receiptno>
              <void>${formatNumber(item?.void)}</void>
              <cash>${formatNumber(item?.cash)}</cash>
              <credit>${formatNumber(item?.credit)}</credit>
              <charge>${formatNumber(item?.charge)}</charge>
              <giftcheck>${formatNumber(item?.giftcheck)}</giftcheck>
              <othertender>${formatNumber(item?.othertender)}</othertender>
              <linedisc>${formatNumber(item?.linedisc)}</linedisc>
              <linesenior>${formatNumber(item?.linesenior)}</linesenior>
              <evat>${formatNumber(item?.evat)}</evat>
              <linepwd>${formatNumber(item?.linepwd)}</linepwd>
              <linediplomat>${formatNumber(item?.linediplomat)}</linediplomat>
              <subtotal>${formatNumber(item?.subtotal)}</subtotal>
              <disc>${formatNumber(item?.disc)}</disc>
              <senior>${formatNumber(item?.senior)}</senior>
              <pwd>${formatNumber(item?.pwd)}</pwd>
              <diplomat>${formatNumber(item?.diplomat)}</diplomat>
              <vat>${formatNumber(item?.vat)}</vat>
              <exvat>${formatNumber(item?.exvat)}</exvat>
              <incvat>${formatNumber(item?.vat)}</incvat>
              <localtax>${formatNumber(item?.localtax)}</localtax>
              <amusement>${formatNumber(item?.amusement)}</amusement>
              <service>${formatNumber(item?.service)}</service>
              <taxsale>${formatNumber(item?.taxsale)}</taxsale>
              <notaxsale>${formatNumber(item?.notaxsale)}</notaxsale>
              <taxexsale>${formatNumber(item?.taxexsale)}</taxexsale>
              <taxincsale>${formatNumber(item?.taxsale)}</taxincsale>
              <zerosale>${formatNumber(item?.zerosale)}</zerosale>
              <vatexempt>${formatNumber(item?.vatexempt)}</vatexempt>
              <customercount>${item?.customercnt ?? 0}</customercount>
              <gross>${formatNumber(item?.gross)}</gross>
              <refund>${formatNumber(item?.refund)}</refund>
              <taxrate>${formatNumber(item?.taxrate)}</taxrate>
              <posted>${item?.posted ?? 'NA'}</posted>
              <memo>NA</memo>
              ${SalesLine}
            </trx>`
        })
      )

      const SalesEOD = `
      <root>
        ${SalesId}
        <sales>
        <date>${formatDateYYYYMMDD(new Date(dates))}</date>
        ${trx}
        </sales>
        <master>
        ${Master}
        </master>
      </root>
      `

      // Write the data to the file
      fs.writeFileSync(filePath, SalesEOD, 'utf8')

      // Return a success response
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
