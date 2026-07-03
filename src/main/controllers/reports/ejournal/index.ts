import { Error as err, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { EJournalReportService } from '../../../services/reports/EJournalReportService'

ipcMain.handle(
  SqlChannel.E_JOURNAL,
  async (
    _event: any,
    {
      dateStart,
      dateEnd,
      targetDir,
      settings
    }: { dateStart: string; dateEnd: string; targetDir: string; settings: any }
  ): Promise<Response> => {
    try {
      // Validation
      if (!dateStart || !dateEnd || !targetDir) {
        return { IsSomething: false, Message: 'Missing required parameters' }
      }

      await EJournalReportService.generateEJournal(dateStart, dateEnd, targetDir, settings)

      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: unknown) {
      console.error('Error processing E-Journal file:', (error as Error).message)
      return { IsSomething: false, Message: (error as Error).message || err.e00x02 }
    }
  }
)
