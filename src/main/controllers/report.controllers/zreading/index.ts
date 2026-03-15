import { Error, Success } from '@shared/messages'
import { MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs/promises'
import paths from 'path'
import { generateMWFilename } from '../../../functions'

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
      const fileName = generateMWFilename(
        MWFileType.ZReading,
        data.TenantCode,
        data.Terminal,
        BatchNo ?? 0,
        dates
      )
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
