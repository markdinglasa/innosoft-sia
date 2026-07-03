import { Error as ErrorMessage, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { MegaworldOrchestrator } from '../../../../../services/reports/MegaworldOrchestrator'

ipcMain.handle(
  SqlChannel.generateMegaworldRange,
  async (
    _event: any,
    startDate: string,
    endDate: string,
    tenant: any,
    path: string,
    batchNo: number,
    isZReading: boolean,
    settings: any
  ): Promise<Response> => {
    console.log('Generating Megaworld Range:', { startDate, endDate, tenant: tenant.TenantCode, path, batchNo, isZReading })
    try {
      const results = await MegaworldOrchestrator.generateRange({
        startDate,
        endDate,
        tenant,
        path,
        batchNo,
        isZReading,
        settings
      })

      return { IsSomething: true, Message: Success.s00x00, Data: results }
    } catch (error: any) {
      console.error('Megaworld Range Error:', error.message || error)
      return { IsSomething: false, Message: ErrorMessage.e00x02 }
    }
  }
)
