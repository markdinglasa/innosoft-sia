import { Error, Success } from '@shared/messages'
import {
  AllianceProductLineQuery,
  AllianceProductsQuery,
  AllianceTransactionOtherQuery,
  PreviousAmountsQuery,
  ZControlNumber
} from '@shared/query'
import {
  AllianceSalesEOD,
  AllianceSalesProduct,
  AllianceSalesTrx,
  AllianceSalesTrxline,
  AllianceType,
  Response,
  SqlChannel
} from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import {
  formatDateDash,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDHHMMSS,
  generateAllianceFilename
} from '../../../../../functions'
import { recordByQuery } from '../../../../../model'
import { formatNumber } from '../../../../../utils'

interface Data {
  Terminal: number
  TenantCode: string
  POSKey: string
}
ipcMain.handle(
  SqlChannel.getAllianceSalesEOD,
  async (
    _event: unknown,
    data: Data,
    path: string,
    salesQ: string,
    dates: string,
    category: string
  ): Promise<Response> => {
    try {
      const salesResponse = await recordByQuery(salesQ)
      const Terminal = data?.Terminal ?? 0

      const Dates = formatDateDash(new Date(dates ?? new Date()))
      const ControlNumber = await recordByQuery(ZControlNumber({ Dates, Terminal }))
      const controlNumber = ControlNumber?.List?.[0]?.ControlNumber ?? 0
      const PrevAmount = await recordByQuery(PreviousAmountsQuery({ Dates, Terminal }))
      const PreviousReading = PrevAmount?.List?.[0]?.PreviousReading ?? 0
      const PreviousTax = PrevAmount?.List?.[0]?.previoustax ?? 0
      const PreviousTaxSale = PrevAmount?.List?.[0]?.previoustaxsale ?? 0
      const PreviousNoTaxSale = PrevAmount?.List?.[0]?.previousnotaxsale ?? 0

      const trxQ = AllianceTransactionOtherQuery({ Terminal, Dates })
      const trxR = await recordByQuery(trxQ)
      const merge2 = trxR.List || []

      const fileName = generateAllianceFilename(
        AllianceType.salesEOD,
        data.TenantCode,
        data.Terminal,
        controlNumber,
        dates
      )
      const filePath = paths.join(path, `${fileName}`)

      // Format the sales data
      const SalesId = `
      <id>
        <tenantid>${data.TenantCode ?? 'NA'}</tenantid>
        <key>${data.POSKey ?? 'NA'}</key>
        <tmid>${data.Terminal.toString().padStart(4, '0') ?? 1}</tmid>
        <doc>${'SALES_EOD'}</doc>
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

      let sales = (salesResponse?.List || [])
        .map((item: AllianceSalesEOD) => {
          return [
            `<date>${formatDateYYYYMMDD(new Date(dates)) ?? ''}</date>`,
            `<zcounter>${item?.zcounter ?? '0'}</zcounter>`,
            `<previousnrgt>${formatNumber(item.previousnrgt)}</previousnrgt>`,
            `<nrgt>${formatNumber(item.nrgt)}</nrgt>`,
            `<previoustax>${formatNumber(item.previoustax)}</previoustax>`,
            `<newtax>${formatNumber(item.newtax)}</newtax>`,
            `<previoustaxsale>${formatNumber(item.previoustaxsale)}</previoustaxsale>`,
            `<newtaxsale>${formatNumber(item.newtaxsale)}</newtaxsale>`,
            `<previousnotaxsale>${formatNumber(item.previousnotaxsale)}</previousnotaxsale>`,
            `<newnotaxsale>${formatNumber(item.newnotaxsale)}</newnotaxsale>`,
            `<opentime>${formatDateYYYYMMDDHHMMSS(new Date(item.opentime)) ?? 'NA'}</opentime>`,
            `<closetime>${formatDateYYYYMMDDHHMMSS(new Date(item.closetime)) ?? 'NA'}</closetime>`,
            `<gross>${formatNumber(item.gross)}</gross>`,
            `<vat>${formatNumber(item.vat)}</vat>`,
            `<localtax>${formatNumber(item.localtax)}</localtax>`,
            `<amusement>${formatNumber(item.amusement)}</amusement>`,
            `<ewt>${formatNumber(item.ewt)}</ewt>`,
            `<taxsale>${formatNumber(item.taxsale)}</taxsale>`,
            `<notaxsale>${formatNumber(item.notaxsale)}</notaxsale>`,
            `<zerosale>${formatNumber(item.zerosale)}</zerosale>`,

            `<void>${formatNumber(item.void)}</void>`,
            `<voidcnt>${formatNumber(item.voidcnt)}</voidcnt>`,
            `<disc>${formatNumber(item.disc)}</disc>`,
            `<disccnt>${formatNumber(item.disccnt)}</disccnt>`,
            `<refund>${formatNumber(item.refund)}</refund>`,
            `<refundcnt>${formatNumber(item.refundcnt)}</refundcnt>`,
            `<senior>${formatNumber(item.senior)}</senior>`,
            `<seniorcnt>${formatNumber(item.seniorcnt)}</seniorcnt>`,
            `<pwd>${formatNumber(item.pwd)}</pwd>`,
            `<pwdcnt>${formatNumber(item.pwdcnt)}</pwdcnt>`,
            `<diplomat>${formatNumber(item.diplomat)}</diplomat>`,
            `<diplomatcnt>${formatNumber(item.diplomatcnt)}</diplomatcnt>`,
            `<nac>${formatNumber(item.nac ?? 0)}</nac>`,
            `<naccnt>${Number(item.naccnt ?? 0)}</naccnt>`,
            `<spd>${formatNumber(item.spd ?? 0)}</spd>`,
            `<spdcnt>${Number(item.spdcnt ?? 0)}</spdcnt>`,
            `<service>${formatNumber(item.service)}</service>`,
            `<servicecnt>${Number(item.servicecnt)}</servicecnt>`,
            `<receiptstart>${item.receiptstart ?? 'NA'}</receiptstart>`,
            `<receiptend>${item.receiptend ?? 'NA'}</receiptend>`,
            `<trxcnt>${Number(item.trxcnt)}</trxcnt>`,
            `<cash>${formatNumber(item.cash)}</cash>`,
            `<cashcnt>${Number(item.cashcnt)}</cashcnt>`,
            `<credit>${formatNumber(item.credit)}</credit>`,
            `<creditcnt>${Number(item.creditcnt)}</creditcnt>`,
            `<charge>${formatNumber(item.charge)}</charge>`,
            `<chargecnt>${Number(item.chargecnt)}</chargecnt>`,
            `<giftcheck>${formatNumber(item.giftcheck)}</giftcheck>`,
            `<giftcheckcnt>${Number(item.giftcheckcnt)}</giftcheckcnt>`,
            `<othertender>${formatNumber(item.othertender)}</othertender>`,
            `<othertendercnt>${Number(item.othertendercnt)}</othertendercnt>`
          ].join('\n')
        })
        .join('\n')

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
                <sku>${lineItem?.sku ?? 'NA'}</sku>
                <qty>${lineItem?.qty ?? 0}</qty>
                <unitprice>${formatNumber(lineItem?.unitprice)}</unitprice>
                <disc>${formatNumber(lineItem?.disc)}</disc>
                <senior>${formatNumber(lineItem?.senior)}</senior>
                <pwd>${formatNumber(lineItem?.pwd)}</pwd>
                <diplomat>${formatNumber(lineItem?.diplomat)}</diplomat>
                <nac>${formatNumber(lineItem?.nac ?? 0)}</nac>
                <spd>${formatNumber(lineItem?.spd ?? 0)}</spd>
                <taxtype>${lineItem?.taxtype ?? 'NA'}</taxtype>
                <tax>${formatNumber(lineItem?.tax)}</tax>
                <memo>${lineItem?.memo ?? 'NA'}</memo>
                <total>${formatNumber(lineItem?.total)}</total>
                <choicetype></choicetype>
              </line>`
            })
            .join('\n')
          return [
            `
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
              <nac>${formatNumber(item?.nac ?? 0)}</nac>
              <spd>${formatNumber(item?.spd ?? 0)}</spd>
              <subtotal>${formatNumber(item?.subtotal)}</subtotal>
              <disc>${formatNumber(item?.disc)}</disc>
              <senior>${formatNumber(item?.senior)}</senior>
              <pwd>${formatNumber(item?.pwd)}</pwd>
              <diplomat>${formatNumber(item?.diplomat)}</diplomat>
              <vat>${formatNumber(item?.vat)}</vat>
              <exvat>${formatNumber(item?.exvat)}</exvat>
              <incvat>${formatNumber(item?.incvat)}</incvat>
              <localtax>${formatNumber(item?.localtax)}</localtax>
              <amusement>${formatNumber(item?.amusement)}</amusement>
              <service>${formatNumber(item?.service)}</service>
              <taxsale>${formatNumber(item?.taxsale)}</taxsale>
              <notaxsale>${formatNumber(item?.notaxsale)}</notaxsale>
              <taxexsale>${formatNumber(item?.taxexsale)}</taxexsale>
              <taxincsale>${formatNumber(item.taxsale)}</taxincsale>
              <zerosale>${formatNumber(item?.zerosale)}</zerosale>
              <customercount>${item?.customercnt ?? 1}</customercount>
              <gross>${formatNumber(item?.gross)}</gross>
              <refund>${formatNumber(item?.refund)}</refund>
              <taxrate>${formatNumber(item?.taxrate)}</taxrate>
              <posted>${item?.posted ?? 'NA'}</posted>
              <qty>${item?.qty ?? 0}</qty>
              <created>${formatNumber(item?.created ?? 0)}</created>
              <memo>${(item?.memo && item.memo !== 'NA') ? item.memo : ''}</memo>
              ${SalesLine}
            </trx>`
          ].join('\n')
        })
      )
      //console.log('trx:', trx)
      // NO SALES
      if (!sales || sales.length === 0) {
        sales = [
          `<date>${formatDateYYYYMMDD(new Date(Dates))}</date>`,
          `<zcounter>${controlNumber}</zcounter>`,
          `<previousnrgt>${Number(PreviousReading).toFixed(2) ?? '0.00'}</previousnrgt>`,
          `<nrgt>${Number(PreviousReading).toFixed(2) ?? '0.00'}</nrgt>`,
          `<previoustax>${Number(PreviousTax).toFixed(2) ?? '0.00'}</previoustax>`,
          `<newtax>${Number(PreviousTax).toFixed(2) ?? '0.00'}</newtax>`,
          `<previoustaxsale>${Number(PreviousTaxSale).toFixed(2) ?? '0.00'}</previoustaxsale>`,
          `<newtaxsale>${Number(PreviousTaxSale).toFixed(2) ?? '0.00'}</newtaxsale>`,
          `<previousnotaxsale>${Number(PreviousNoTaxSale).toFixed(2) ?? '0.00'}</previousnotaxsale>`,
          `<newnotaxsale>${Number(PreviousNoTaxSale).toFixed(2) ?? '0.00'}</newnotaxsale>`,
          `<opentime>${formatDateYYYYMMDDHHMMSS(new Date(Dates)) ?? 'NA'}</opentime>`,
          `<closetime>${formatDateYYYYMMDDHHMMSS(new Date(Dates)) ?? 'NA'}</closetime>`,
          `<gross>${Number(0).toFixed(2) ?? '0.00'}</gross>`,
          `<vat>${Number(0).toFixed(2) ?? '0.00'}</vat>`,
          `<localtax>${Number(0).toFixed(2) ?? '0.00'}</localtax>`,
          `<amusement>${Number(0).toFixed(2) ?? '0.00'}</amusement>`,
          `<ewt>${Number().toFixed(2) ?? '0.00'}</ewt>`,
          `<taxsale>${Number(0).toFixed(2) ?? '0.00'}</taxsale>`,
          `<notaxsale>${Number(0).toFixed(2) ?? '0.00'}</notaxsale>`,
          `<zerosale>${Number(0).toFixed(2) ?? '0.00'}</zerosale>`,
          `<void>${Number(0).toFixed(2) ?? '0.00'}</void>`,
          `<voidcnt>${Number(0)}</voidcnt>`,
          `<disc>${Number(0).toFixed(2) ?? '0.00'}</disc>`,
          `<disccnt>${Number(0)}</disccnt>`,
          `<refund>${Number(0).toFixed(2) ?? '0.00'}</refund>`,
          `<refundcnt>${Number(0)}</refundcnt>`,
          `<senior>${Number(0).toFixed(2) ?? '0.00'}</senior>`,
          `<seniorcnt>${Number(0)}</seniorcnt>`,
          `<pwd>${Number(0).toFixed(2) ?? '0.00'}</pwd>`,
          `<pwdcnt>${Number(0)}</pwdcnt>`,
          `<diplomat>${Number(0).toFixed(2) ?? '0.00'}</diplomat>`,
          `<diplomatcnt>${Number(0)}</diplomatcnt>`,
          `<nac>${Number(0).toFixed(2)}</nac>`,
          `<naccnt>${Number(0)}</naccnt>`,
          `<spd>${Number(0).toFixed(2)}</spd>`,
          `<spdcnt>${Number(0)}</spdcnt>`,
          `<service>${Number(0).toFixed(2) ?? '0.00'}</service>`,
          `<servicecnt>${Number(0)}</servicecnt>`,
          `<receiptstart>${'0'}</receiptstart>`,
          `<receiptend>${'0'}</receiptend>`,
          `<trxcnt>${Number(0)}</trxcnt>`,
          `<cash>${Number(0).toFixed(2) ?? '0.00'}</cash>`,
          `<cashcnt>${Number(0)}</cashcnt>`,
          `<credit>${Number(0).toFixed(2) ?? '0.00'}</credit>`,
          `<creditcnt>${Number(0)}</creditcnt>`,
          `<charge>${Number(0).toFixed(2) ?? '0.00'}</charge>`,
          `<chargecnt>${Number(0)}</chargecnt>`,
          `<giftcheck>${Number(0).toFixed(2) ?? '0.00'}</giftcheck>`,
          `<giftcheckcnt>${Number(0)}</giftcheckcnt>`,
          `<othertender>${Number(0).toFixed(2) ?? '0.00'}</othertender>`,
          `<othertendercnt>${Number(0)}</othertendercnt>`
        ].join('\n')
      }

      const content: string = `
      <root>
        ${SalesId}
        <sales>
        ${sales}
        ${trx ?? ''}
        </sales>
        <master>
        ${Master}
        </master>
      </root>
      `
      // Remove existing file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      // Write the data to the file
      fs.writeFileSync(filePath, content, 'utf8')

      // Return a success response
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: unknown) {
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
