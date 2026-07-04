import { BrowserWindow } from 'electron'
import { ZReadingReportService } from './ZReadingReportService'
import { format } from 'date-fns'

export class MegaworldZReadingService {
  /**
   * Generate Z-Reading PDF Buffer
   */
  static async generatePDFBuffer(terminalId: number, dates: Date, settings: any): Promise<Buffer> {
    const data = await ZReadingReportService.getZReadingData(terminalId, dates)
    const html = this.generateHTML(data, settings, dates)

    return new Promise((resolve, reject) => {
      const window = new BrowserWindow({
        show: false,
        webPreferences: {
          offscreen: true
        }
      })

      window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

      window.webContents.on('did-finish-load', async () => {
        try {
          const pdfBuffer = await window.webContents.printToPDF({
            pageSize: 'Letter',
            printBackground: true
          })
          window.close()
          resolve(pdfBuffer)
        } catch (error) {
          window.close()
          reject(error)
        }
      })

      window.webContents.on('did-fail-load', () => {
        window.close()
        reject(new Error('Failed to load Z-Reading template'))
      })
    })
  }

  private static generateHTML(data: any, settings: any, dates: Date): string {
    const formattedDate = format(dates, 'MMMM dd, yyyy')
    const {
      paytypes = [],
      controlNumber = {},
      discounts = [],
      previousReading = {},
      trx = {},
      gross = {},
      VATAnalysis = {},
      CancelledTx = {},
      collectionNumber = {}
    } = data

    const regularDiscounts = discounts.reduce(
      (total: number, d: any) => total + (d.NonGovDiscountAmount ?? 0),
      0
    )
    const GovDiscountAmount = discounts.reduce(
      (total: number, d: any) => total + (d.GovDiscountAmount ?? 0),
      0
    )
    const GrossSalesAmount = Number(gross?.NetSales ?? 0) + regularDiscounts + GovDiscountAmount
    const totalCollection = paytypes.reduce(
      (total: number, p: any) => total + (p.TotalAmount ?? 0),
      0
    )

    const formatNum = (num: number) =>
      Number(num || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

    let pytypesHtml = paytypes
      .map(
        (p: any) => `
      <div class="row">
        <span>${p.PayType}:</span>
        <span class="text-end">${formatNum(p.TotalAmount)}</span>
      </div>
    `
      )
      .join('')

    let discountsHtml = discounts
      .filter((d: any) => d.IsGovernmentMandated)
      .map(
        (d: any) => `
      <div class="discount-block">
        <div class="row">
          <span>${d.Discount}:</span>
          <span class="text-end">${formatNum(d.GovDiscountAmount)}</span>
        </div>
        <div class="row">
          <span>Less:</span>
          <span class="text-end">${formatNum(d.VATExempt)}</span>
        </div>
      </div>
    `
      )
      .join('')

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Courier New', Courier, monospace; width: 280px; margin: 0; padding: 10px; color: #000; background: #fff; }
          .container { display: flex; flex-direction: column; text-align: center; }
          .header { margin-bottom: 10px; }
          .header h4 { margin: 0; font-size: 14px; }
          .header span { font-size: 10px; display: block; }
          .info { margin-bottom: 10px; text-align: left; font-size: 11px; }
          .info span { display: block; }
          .title { font-weight: bold; font-size: 12px; margin-bottom: 2px; }
          .date { font-size: 11px; margin-bottom: 5px; }
          .border-top { border-top: 1px solid #000; padding: 5px 0; }
          .row { display: flex; justify-content: space-between; font-size: 11px; padding: 1px 0; }
          .text-end { text-align: right; flex: 1; }
          .text-bold { font-weight: bold; }
          .mb-1 { margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h4>${settings.Name ?? 'NA'}</h4>
            <span>${settings.Address ?? 'NA'}</span>
            <span>Operator ${settings.Operator ?? 'NA'}</span>
          </div>
          <div class="info">
            <span>Permit: ${settings.PermitNumber ?? 'NA'}</span>
            <span>TIN: ${settings.TIN ?? 'NA'}</span>
            <span>Accrdt: ${settings.AccreditationNumber ?? 'NA'}</span>
            <span>Serial: ${settings.SerialNumber ?? 'NA'}</span>
            <span>Machine: ${settings.MachineNumber ?? 'NA'}</span>
          </div>
          <div class="mb-1">
            <div class="title">Z Reading Report</div>
            <div class="date">${formattedDate}</div>
          </div>
          
          <div class="border-top">
            <div class="row">
              <span>Gross Sales:</span>
              <span class="text-end">${formatNum(GrossSalesAmount)}</span>
            </div>
            <div class="row">
              <span>Regular Discount:</span>
              <span class="text-end">${formatNum(regularDiscounts)}</span>
            </div>
            ${discountsHtml}
            <div class="row">
              <span>Net Sales:</span>
              <span class="text-end">${formatNum(gross?.NetSales)}</span>
            </div>
          </div>

          <div class="border-top">
            ${pytypesHtml}
          </div>

          <div class="border-top">
            <div class="row text-bold">
              <span>Total Collection:</span>
              <span class="text-end">${formatNum(totalCollection)}</span>
            </div>
          </div>

          <div class="border-top">
            <div class="row">
              <span>AR:</span>
              <span class="text-end">0.00</span>
            </div>
          </div>

          <div class="border-top">
            <div class="row">
              <span>Non-VAT Sales:</span>
              <span class="text-end">${formatNum(VATAnalysis?.NONVat)}</span>
            </div>
            <div class="row">
              <span>VAT Sales:</span>
              <span class="text-end">${formatNum(VATAnalysis?.VATSales)}</span>
            </div>
            <div class="row">
              <span>VAT Exempt Sales:</span>
              <span class="text-end">${formatNum(VATAnalysis?.VATExempt)}</span>
            </div>
            <div class="row">
              <span>Zero Rated Sales:</span>
              <span class="text-end">${formatNum(VATAnalysis?.zerosale)}</span>
            </div>
            <div class="row">
              <span>VAT Amount:</span>
              <span class="text-end">${formatNum(VATAnalysis?.VATAmount)}</span>
            </div>
          </div>

          <div class="border-top">
            <div class="row">
              <span>Counter Start:</span>
              <span class="text-end">${collectionNumber.CounterStart ?? '0'}</span>
            </div>
            <div class="row">
              <span>Counter End:</span>
              <span class="text-end">${collectionNumber.CounterEnd ?? '0'}</span>
            </div>
          </div>

          <div class="border-top">
            <div class="row">
              <span>Cancelled Tx:</span>
              <span class="text-end">${CancelledTx.CancelledTx ?? 0}</span>
            </div>
            <div class="row">
              <span>Cancelled Amount:</span>
              <span class="text-end">${formatNum(CancelledTx.CancelledAmount)}</span>
            </div>
          </div>

          <div class="border-top">
            <div class="row">
              <span>No. of Transactions:</span>
              <span class="text-end">${trx?.TotalTrx ?? 0}</span>
            </div>
            <div class="row">
              <span>Number of SKU:</span>
              <span class="text-end">${trx?.TotalSKU ?? 0}</span>
            </div>
            <div class="row">
              <span>Total Quantity:</span>
              <span class="text-end">${formatNum(trx?.TotalQuantity)}</span>
            </div>
          </div>

          <div class="border-top">
            <div class="row">
              <span>Z-Counter:</span>
              <span class="text-end">${controlNumber?.ControlNumber ?? 0}</span>
            </div>
            <div class="row">
              <span>Previous Reading:</span>
              <span class="text-end">${formatNum(previousReading?.PreviousReading)}</span>
            </div>
            <div class="row">
              <span>Net Sales:</span>
              <span class="text-end">${formatNum(gross?.NetSales)}</span>
            </div>
            <div class="row text-bold">
              <span>Running Total:</span>
              <span class="text-end">${formatNum((previousReading?.PreviousReading ?? 0) + Number(gross?.NetSales ?? 0))}</span>
            </div>
          </div>

          <div class="border-top text-bold">
            Z Reading End
          </div>
        </div>
      </body>
      </html>
    `
  }
}
