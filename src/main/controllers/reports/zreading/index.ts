import { Error, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { format } from 'date-fns'
import { ipcMain } from 'electron'
import fs from 'node:fs/promises'
import paths from 'node:path'
import './getZReadingData'

ipcMain.handle(
  SqlChannel.getZReading,
  async (
    _event: any,
    data: any,
    dates: Date,
    BatchNo: number,
    { buffer, targetDir }
  ): Promise<Response> => {
    try {
      const activeDate = new Date(dates)
      const formattedDate = format(activeDate, 'yyyy-MM-dd')
      const fileName = `ZReading_${data.TenantCode}_${data.Terminal}_Batch${BatchNo ?? 0}_${formattedDate}`
      if (!targetDir) {
        return { IsSomething: false, Message: Error.e00x03 }
      }
      const filePath = paths.join(targetDir, `${fileName}.pdf`)
      fs.writeFile(filePath, buffer)
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error processing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
