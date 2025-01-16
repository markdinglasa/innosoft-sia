import { Error, Success } from '@shared/messages'
import {
  AllianceProductLineQuery,
  AllianceProductsQuery,
  AllianceTransactionQuery
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
  formatDateYYYYMMDDHHMMSS,
  generateAllianceFilename
} from '../../../../../functions'
import { recordByQuery } from '../../../../../model'

ipcMain.handle(
  SqlChannel.getAllianceSalesEOD,
  async (
    _event: any,
    data: any,
    path: string,
    salesQ: string,
    dates: string,
    category: string
  ): Promise<Response> => {
    try {
      // Fetch records based on the provided query
      const salesResponse = await recordByQuery(salesQ)
      const Terminal = data?.Terminal ?? 0
      //console.log('Terminal:', Terminal)
      const Dates = formatDateDash(new Date(dates ?? ''))
      //console.log('Dates:', Dates)
      const trxQuery = AllianceTransactionQuery({ Terminal, Dates })
      const trnResponse = await recordByQuery(trxQuery)
      console.log('trnResponse:', trnResponse)
      // Handle case when response does not have a 'List'
      if (!salesResponse.List || !trnResponse.List) {
        return { IsSomething: false, Message: salesResponse.Message }
      }

      // Generate the file name and path
      const fileName = generateAllianceFilename(
        AllianceType.salesEOD,
        data.TenantCode,
        data.Terminal,
        new Date(dates ?? '')
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

      const sales = salesResponse.List.map((item: AllianceSalesEOD) => {
        return [
          `<date>${item?.date ?? ''}</date>`,
          `<zcounter>${item?.zcounter ?? '0'}</zcounter>`,
          `<previousnrgt>${Number(item.previousnrgt).toFixed(2) ?? '0.00'}</previousnrgt>`,
          `<nrgt>${Number(item.nrgt).toFixed(2) ?? '0.00'}</nrgt>`,
          `<previoustax>${Number(item.previoustax).toFixed(2) ?? '0.00'}</previoustax>`,
          `<newtax>${Number(item.newtax).toFixed(2) ?? '0.00'}</newtax>`,
          `<previoustaxsale>${Number(item.previoustaxsale).toFixed(2) ?? '0.00'}</previoustaxsale>`,
          `<newtaxsale>${Number(item.newtaxsale).toFixed(2) ?? '0.00'}</newtaxsale>`,
          `<previousnotaxsale>${Number(item.previousnotaxsale).toFixed(2) ?? '0.00'}</previousnotaxsale>`,
          `<newnotaxsale>${Number(item.newnotaxsale).toFixed(2) ?? '0.00'}</newnotaxsale>`,
          `<opentime>${formatDateYYYYMMDDHHMMSS(new Date(item.opentime)) ?? 'NA'}</opentime>`,
          `<closetime>${formatDateYYYYMMDDHHMMSS(new Date(item.closetime)) ?? 'NA'}</closetime>`,
          `<gross>${Number(item.gross).toFixed(2) ?? '0.00'}</gross>`,
          `<vat>${Number(item.vat).toFixed(2) ?? '0.00'}</vat>`,
          `<localtax>${Number(item.localtax).toFixed(2) ?? '0.00'}</localtax>`,
          `<amusement>${Number(item.amusement).toFixed(2) ?? '0.00'}</amusement>`,
          `<ewt>${Number(item.ewt).toFixed(2) ?? '0.00'}</ewt>`,
          `<taxsale>${Number(item.taxsale).toFixed(2) ?? '0.00'}</taxsale>`,
          `<notaxsale>${Number(item.notaxsale).toFixed(2) ?? '0.00'}</notaxsale>`,
          `<zerosale>${Number(item.zerosale).toFixed(2) ?? '0.00'}</zerosale>`,
          `<vatexempt>${Number(item.vatexempt).toFixed(2) ?? '0.00'}</vatexempt>`,
          `<void>${Number(item.void).toFixed(2) ?? '0.00'}</void>`,
          `<voidcnt>${Number(item.voidcnt).toFixed(2) ?? '0.00'}</voidcnt>`,
          `<disc>${Number(item.disc).toFixed(2) ?? '0.00'}</disc>`,
          `<disccnt>${Number(item.disccnt).toFixed(2) ?? '0.00'}</disccnt>`,
          `<refund>${Number(item.refund).toFixed(2) ?? '0.00'}</refund>`,
          `<refundcnt>${Number(item.refundcnt).toFixed(2) ?? '0.00'}</refundcnt>`,
          `<senior>${Number(item.senior).toFixed(2) ?? '0.00'}</senior>`,
          `<seniorcnt>${Number(item.seniorcnt).toFixed(2) ?? '0.00'}</seniorcnt>`,
          `<pwd>${Number(item.pwd).toFixed(2) ?? '0.00'}</pwd>`,
          `<pwdcnt>${Number(item.pwdcnt).toFixed(2) ?? '0.00'}</pwdcnt>`,
          `<diplomat>${Number(item.diplomat).toFixed(2) ?? '0.00'}</diplomat>`,
          `<diplomatcnt>${Number(item.diplomatcnt).toFixed(2) ?? '0.00'}</diplomatcnt>`,
          `<service>${Number(item.service).toFixed(2) ?? '0.00'}</service>`,
          `<servicecnt>${Number(item.servicecnt).toFixed(2) ?? '0.00'}</servicecnt>`,
          `<receiptstart>${item.receiptstart ?? 'NA'}</receiptstart>`,
          `<receiptend>${item.receiptend ?? 'NA'}</receiptend>`,
          `<trxcnt>${Number(item.trxcnt).toFixed(2) ?? '0.00'}</trxcnt>`,
          `<cash>${Number(item.cash).toFixed(2) ?? '0.00'}</cash>`,
          `<cashcnt>${Number(item.cashcnt).toFixed(2) ?? '0.00'}</cashcnt>`,
          `<credit>${Number(item.credit).toFixed(2) ?? '0.00'}</credit>`,
          `<creditcnt>${Number(item.creditcnt).toFixed(2) ?? '0.00'}</creditcnt>`,
          `<charge>${Number(item.charge).toFixed(2) ?? '0.00'}</charge>`,
          `<chargecnt>${Number(item.chargecnt).toFixed(2) ?? '0.00'}</chargecnt>`,
          `<giftcheck>${Number(item.giftcheck).toFixed(2) ?? '0.00'}</giftcheck>`,
          `<giftcheckcnt>${Number(item.giftcheckcnt).toFixed(2) ?? '0.00'}</giftcheckcnt>`,
          `<othertender>${Number(item.othertender).toFixed(2) ?? '0.00'}</othertender>`,
          `<othertendercnt>${Number(item.othertendercnt).toFixed(2) ?? '0.00'}</othertendercnt>`
        ].join('\n')
      }).join('\n')

      const formatNumber = (value: number | undefined, defaultValue = 0): string =>
        Number(value ?? defaultValue).toFixed(2)

      const trx = await Promise.all(
        trnResponse.List.map(async (item: AllianceSalesTrx) => {
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
                <choicetype>${' '}</choicetype>
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
        ${sales}
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
