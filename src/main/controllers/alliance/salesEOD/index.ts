import { Error, Success } from '@shared/messages'
import { AllianceSalesEOD, AllianceType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { formatDateYYYYMMDDHHMMSS, generateAllianceFilename } from '../../../functions'
import { recordByQuery } from '../../../model'

ipcMain.handle(
  SqlChannel.getAllianceSalesEOD,
  async (_event: any, data: any, path: string, salesQ: string): Promise<Response> => {
    try {
      // Fetch records based on the provided query
      const salesResponse = await recordByQuery(salesQ)

      // Handle case when response does not have a 'List'
      if (!salesResponse.List) {
        return { IsSomething: false, Message: salesResponse.Message }
      }

      // Generate the file name and path
      const fileName = generateAllianceFilename(
        AllianceType.salesEOD,
        data.TenantCode,
        data.Terminal,
        new Date()
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
          <key>${'K9BRJGJS'}</key>
          <tmid>${data.Terminal.toString().padStart(4, '0') ?? 1}</tmid>
          <doc>${'SALES_PREOOD'}</doc>
        </id>
      `
      const Master = `
      <product>
        <sku>${102}</sku>
        <name>${'Hen Lin Siopao Asado'}</name>
        <inventory>${0}</inventory>
        <price>${Number(100).toFixed(2)}</price>
        <category>${data.Category ?? '01'}</category>
      </product>
     `
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
          `<othertendercnt>${Number(item.othertender).toFixed(2) ?? '0.00'}</othertendercnt>`
        ].join('\n')
      }).join('\n')

      const SalesLine = `
        <line>
          <sku>${100}</sku>
          <qty>${1}</qty>
          <unitprice>${Number(100).toFixed(2)}</unitprice>
          <disc>${Number(0).toFixed(2)}</disc>
          <senior>${Number(0).toFixed(2)}</senior>
          <pwd>${Number(0).toFixed(2)}</pwd>
          <diplomat>${Number(0).toFixed(2)}</diplomat>
          <taxtype>${Number(0).toFixed(2)}</taxtype>
          <tax>${Number(0).toFixed(2)}</tax>
          <memo>${'NA'}</memo>
          <total>${Number(0).toFixed(2)}</total>
          <choicetype></choicetype>
        </line>
      `
      const SalesEOD = `
      <root>
        ${SalesId}
        <sales>
        ${sales}
        <trx>
          <receiptno>${14}</receiptno>
          <void>${Number(0).toFixed(2)}</void>
          <cash>${Number(0).toFixed(2)}</cash>
          <credit>${Number(0).toFixed(2)}</credit>
          <giftcheck>${Number(0).toFixed(2)}</giftcheck>
          <othertender>${Number(0).toFixed(2)}</othertender>
          <linedisc>${Number(0).toFixed(2)}</linedisc>
          <linesenior>${Number(0).toFixed(2)}</linesenior>
          <evat>${Number(0).toFixed(2)}</evat>
          <linepwd>${Number(0).toFixed(2)}</linepwd>
          <linediplomat>${Number(0).toFixed(2)}</linediplomat>
          <subtotal>${Number(0).toFixed(2)}</subtotal>
          <disc>${Number(0).toFixed(2)}</disc>
          <senior>${Number(0).toFixed(2)}</senior>
          <pwd>${Number(0).toFixed(2)}</pwd>
          <diplomat>${Number(0).toFixed(2)}</diplomat>
          <vat>${Number(0).toFixed(2)}</vat>
          <exvat>${Number(0).toFixed(2)}</exvat>
          <incvat>${Number(0).toFixed(2)}</incvat>
          <localtax>${Number(0).toFixed(2)}</localtax>
          <amusement >${Number(0).toFixed(2)}</amusement >
          <service>${Number(0).toFixed(2)}</service>
          <taxsale>${Number(0).toFixed(2)}</taxsale>
          <notaxsale>${Number(0).toFixed(2)}</notaxsale>
          <taxexsale>${Number(0).toFixed(2)}</taxexsale>
          <taxinsale>${Number(0).toFixed(2)}</taxinsale>
          <zerosale>${Number(0).toFixed(2)}</zerosale>
          <vatexempt>${Number(0).toFixed(2)}</vatexempt>
          <customercount>${1}</customercount>
          <gross>${Number(100).toFixed(2)}</gross>
          <refund>${Number(0).toFixed(2)}</refund>
          <taxrate>${Number(0).toFixed(2)}</taxrate>
          <posted>${'20241214070707' /*YYYYMMDDHHMMSS*/}</posted>
          <memo>${'NA'}</memo>
          ${SalesLine}
        </trx>
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
