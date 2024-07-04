import { CODE_KEY } from '@shared/constants'
import { Error, Success } from '@shared/messages'
import { GenerateLicense, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { XOREncryption } from '../../../functions'

ipcMain.handle(
  SqlChannel.generateLicense,
  async (
    _event: any,
    Data: GenerateLicense
  ): Promise<Response> => {
    try {
      if (!Data.Key) return { Data: null, Message: Error.e00x37 }
      const currentDate = new Date()
      const formatter = new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      const [{ value: month }, , { value: day }, , { value: year }] =
        formatter.formatToParts(currentDate)
      const formattedDate = `${year}/${month}/${day}`
      let result = await XOREncryption(
        CODE_KEY,
        `${Data.Key}.${Data.BusinessType}.${Data.LicenseType}.${Data.Duration}.${formattedDate}`
      )
      return { Data: result, Message: Success.s00x00 }
    } catch (error: any) {
      return { Data: null, Message: Error.e00x02 }
    }
  }
)
