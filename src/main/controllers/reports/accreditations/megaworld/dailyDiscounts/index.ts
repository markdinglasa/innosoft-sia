import { Error, Success } from '@shared/messages'
import { DailyDiscount, MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateMWFilename } from '../../../../../functions'
import { recordByQuery } from '../../../../../model'

ipcMain.handle(
  SqlChannel.getDailyDiscount,
  async (
    _event: any,
    data: any,
    path: string,
    BatchNo: number,
    query: string,
    dates: Date
  ): Promise<Response> => {
    try {
      const response = await recordByQuery(query)
      if (!response.List) return { IsSomething: false, Message: response.Message }
      const fileName = generateMWFilename(
        MWFileType.DailyDiscount,
        data.TenantCode,
        data.Terminal,
        BatchNo ?? 0,
        dates
      )

      const filePath = paths.join(path, `${fileName}`)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      let dailyDiscountData = response.List.map(
        (item: DailyDiscount) =>
          `${item.DiscountCode}, ${item.DiscountDescription}, ${Number(item.DiscountAmount).toFixed(2)}`
      ).join('\n')

      if (!dailyDiscountData || dailyDiscountData.length === 0) dailyDiscountData = `NA, NA, 0.00`
      fs.writeFileSync(filePath, dailyDiscountData, 'utf8')
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
