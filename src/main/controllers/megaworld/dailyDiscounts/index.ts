import { Error, Success } from '@shared/messages'
import { DailyDiscount, MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateMWFilename } from '../../../functions'
import { recordByQuery } from '../../../model'

ipcMain.handle(
  SqlChannel.getDailyDiscount,
  async (_event: any, data: any, path: string, query: string): Promise<Response> => {
    try {
      const response = await recordByQuery(query)
      if (!response.List) return { IsSomething: false, Message: response.Message }

      // Generate file name
      const fileName = generateMWFilename(
        MWFileType.DailyDiscount,
        data.TenantCodeId,
        data.Terminal,
        data.BatchNo
      )
      const filePath = paths.join(path, `${fileName}`)

      // Remove existing file if it exists
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      // Prepare data for writing
      const dailyDiscountData = response.List.map(
        (item: DailyDiscount) =>
          `${item.DiscountCode},${item.DiscountDescription},${item.DiscountAmount}`
      ).join('\n') // Convert data to string with line breaks

      // Write data to the file
      fs.writeFileSync(filePath, dailyDiscountData, 'utf8')

      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
