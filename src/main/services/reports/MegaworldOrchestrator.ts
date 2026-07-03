import { MWFileType, Tenant } from '@shared/types'
import fs from 'fs'
import paths from 'path'
import { generateMWFilename } from '../../functions'
import { MegaworldReportService } from './MegaworldReportService'
import { MegaworldZReadingService } from './MegaworldZReadingService'
import { formatDateMMDDYYYY } from '../../functions/utility'

export class MegaworldOrchestrator {
  static async generateRange(
    params: {
      startDate: string;
      endDate: string;
      tenant: Tenant;
      path: string;
      batchNo: number;
      isZReading: boolean;
      settings: any;
    }
  ) {
    const { startDate, endDate, tenant, path, batchNo, isZReading, settings } = params
    const start = new Date(startDate)
    const end = new Date(endDate)
    const results: any[] = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const activeDate = new Date(d)
      const terminalId = Number(tenant.Terminal)
      const tenantCode = tenant.TenantCode ?? ''

      console.log(`Processing date: ${activeDate.toISOString()} for terminal: ${terminalId}`)

      // 1. Get Sales Data and Control Number (Cumulative days with locked collections)
      const controlNumberResult = await MegaworldReportService.getDailySalesData(terminalId, tenantCode, activeDate)

      console.log(`Generating reports for ${activeDate.toDateString()} (Control Number: ${controlNumberResult.ControlNumber})...`)

      // 2. Generate Daily Sales (S)
      await this.generateDailySales(tenant, path, batchNo, activeDate, controlNumberResult)

      // 3. Generate Daily Discounts (D)
      await this.generateDailyDiscounts(tenant, path, batchNo, activeDate)

      // 4. Generate Hourly Sales (H)
      await this.generateHourlySales(tenant, path, batchNo, activeDate)

      // 5. Generate Z-Reading PDF (Z)
      if (isZReading) {
        try {
          const pdfBuffer = await MegaworldZReadingService.generatePDFBuffer(terminalId, activeDate, settings)
          const fileName = generateMWFilename(
            MWFileType.ZReading,
            tenant.TenantCode,
            tenant.Terminal,
            batchNo ?? 0,
            activeDate
          )
          const filePath = paths.join(path, `${fileName}.pdf`)
          console.log(`Writing Z-Reading report to: ${filePath}`)
          fs.writeFileSync(filePath, pdfBuffer)
        } catch (error) {
          console.error(`Failed to generate Z-Reading for ${activeDate.toDateString()}:`, error)
        }
      }

      results.push({
        date: activeDate.toISOString(),
        success: true
      })
    }

    return results
  }

  private static async generateDailySales(tenant: any, path: string, BatchNo: number, dates: Date, mainItem: any) {
    const terminalId = Number(tenant.Terminal)
    const salestypeResult = await MegaworldReportService.getSalesTypeData(terminalId, dates)

    const fileName = generateMWFilename(
      MWFileType.DailySales,
      tenant.TenantCode,
      tenant.Terminal,
      BatchNo ?? 0,
      dates
    )
    const filePath = paths.join(path, `${fileName}`)
    
    const salestypeD = (salestypeResult || []).map(
      (item: { SalesType: string; NetSalesAmount: number }) => {
        return [
          `21${item?.SalesType ?? 'NA'}`,
          `22${Number(item?.NetSalesAmount).toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`
        ].join('\r\n')
      }
    )

    const dailySalesData = [
      `01${mainItem.MallPartnerCodeId}`,
      `02${mainItem.Terminal}`,
      `03${String(formatDateMMDDYYYY(new Date(mainItem.Date))).replace(/[^a-zA-Z0-9]/g, '')}`,
      `04${mainItem.OldAccumulatedTotal.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `05${mainItem.NewAccumulatedTotal.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `06${mainItem.GrossSalesAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `07${mainItem.NonTaxSalesAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `08${mainItem.GovMandatedDiscount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `09${mainItem.OtherDiscount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `10${mainItem.RefundAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `11${mainItem.TaxAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `12${mainItem.ServiceChargeAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `13${mainItem.NetSalesAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `14${mainItem.CashSales.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `15${mainItem.CreditDebitsales.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `16${mainItem.OtherPaymentSales.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `17${mainItem.VoidAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
      `18${mainItem.CustomerCount}`,
      `19${mainItem.ControlNumber}`,
      `20${mainItem.NoSalesTransaction}`,
      salestypeD.join('\r\n')
    ].join('\r\n')

    fs.writeFileSync(filePath, dailySalesData, 'utf8')
  }

  private static async generateDailyDiscounts(tenant: any, path: string, BatchNo: number, dates: Date) {
    const rawData = await MegaworldReportService.getDailyDiscountsData(Number(tenant.Terminal), dates)
    const fileName = generateMWFilename(
      MWFileType.DailyDiscount,
      tenant.TenantCode,
      tenant.Terminal,
      BatchNo ?? 0,
      dates
    )
    const filePath = paths.join(path, `${fileName}`)
    
    let dailyDiscountData = (rawData as any[])
      .map(
        (item: any) =>
          `${item.DiscountCode}, ${item.DiscountDescription}, ${Number(item.DiscountAmount).toFixed(2)}`
      )
      .join('\r\n')

    if (!dailyDiscountData || dailyDiscountData.length === 0) dailyDiscountData = `NA, NA, 0.00`
    fs.writeFileSync(filePath, dailyDiscountData, 'utf8')
  }

  private static async generateHourlySales(tenant: any, path: string, BatchNo: number, dates: Date) {
    const { day: dayResponse, hourly: hourlyResponse } =
      await MegaworldReportService.getHourlySalesData(Number(tenant.Terminal), tenant.TenantCode, dates)

    const fileName = generateMWFilename(
      MWFileType.DailyHourlySales,
      tenant.TenantCode,
      tenant.Terminal,
      BatchNo ?? 0,
      dates
    )
    const filePath = paths.join(path, fileName)
    console.log(`Writing Hourly Sales report to: ${filePath}`)

    const hourlySalesData =
      hourlyResponse
        ?.map((item: any) => {
          return [
            `04${item.HourCode}`,
            `05${Number(item.NetSalesAmountHour).toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
            `06${item.NoSalesTransactionHour}`,
            `07${item.CustomerCountHour}`
          ].join('\r\n')
        })
        .join('\r\n') ?? ''

    let daySalesData =
      dayResponse
        ?.map((item: any) => {
          return [
            `01${item.MallPartnerCodeId}`,
            `02${item.Terminal}`,
            `03${String(formatDateMMDDYYYY(new Date(item.Date))).replace(/[^a-zA-Z0-9]/g, '')}`,
            hourlySalesData,
            `08${Number(item.NetSalesAmountDay).toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
            `09${item.NoSalesTransactionDay}`,
            `10${item.CustomerCountDay}`
          ].join('\r\n')
        })
        .join('\r\n') ?? ''

    if (!daySalesData || daySalesData.length === 0)
      daySalesData = [
        `01${tenant.TenantCode ?? 'NA'}`,
        `02${tenant?.Terminal ?? '00'}`,
        `03${String(formatDateMMDDYYYY(new Date(dates))).replace(/[^a-zA-Z0-9]/g, '') ?? '00000000'}`,
        `040`,
        `05000`,
        `060`,
        `070`,
        `08000`,
        `090`,
        `100`
      ].join('\r\n')

    fs.writeFileSync(filePath, daySalesData, 'utf8')
  }
}
