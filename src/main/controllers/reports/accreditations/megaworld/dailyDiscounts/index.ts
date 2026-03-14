import { Error as ErrorMessage, Success } from '@shared/messages'
import { DailyDiscount, MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateMWFilename } from '../../../../../functions'
import { MegaworldReportService } from '../../../../../services/reports/MegaworldReportService'

ipcMain.handle(
  SqlChannel.getDailyDiscount,
  async (
    _event: any,
    data: any,
    path: string,
    BatchNo: number,
    dates: Date
  ): Promise<Response> => {
    try {
      const rawData = await MegaworldReportService.getDailyDiscountsData(data.Terminal, dates)

      const fileName = generateMWFilename(
        MWFileType.DailyDiscount,
        data.TenantCode,
        data.Terminal,
        BatchNo ?? 0,
        dates
      )

      const filePath = paths.join(path, `${fileName}`)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      let dailyDiscountData = (rawData as DailyDiscount[])
        .map(
          (item: DailyDiscount) =>
            `${item.DiscountCode}, ${item.DiscountDescription}, ${Number(item.DiscountAmount).toFixed(2)}`
        )
        .join('\r\n')

      // zero discounts as fallback
      if (!dailyDiscountData || dailyDiscountData.length === 0) dailyDiscountData = `NA, NA, 0.00`

      // write file
      fs.writeFileSync(filePath, dailyDiscountData, 'utf8')
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error(
        'Error writing file:',
        (error as Error).message || 'Sorry, Something went wrong.'
      )
      return { IsSomething: false, Message: ErrorMessage.e00x02 }
    }
  }
)
