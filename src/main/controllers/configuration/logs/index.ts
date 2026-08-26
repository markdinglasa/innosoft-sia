import { ERROR, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { logger } from '../../../services/LogService'
import log from 'electron-log'
import fs from 'fs'
import { dialog } from 'electron'

ipcMain.handle(SqlChannel.getLogs, async (): Promise<Response> => {
  try {
    const logs = logger.getLogs()
    return { IsSomething: true, Message: Success.s00x00, List: logs }
  } catch (error: unknown) {
    return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
  }
})

ipcMain.handle(SqlChannel.clearLogs, async (): Promise<Response> => {
  try {
    logger.clearLogs()
    return { IsSomething: true, Message: Success.s00x00 }
  } catch (error: unknown) {
    return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
  }
})

ipcMain.handle(SqlChannel.exportLogs, async (): Promise<Response> => {
  try {
    const logFilePath = log.transports.file.getFile().path
    if (!fs.existsSync(logFilePath)) {
      return { IsSomething: false, Message: 'Log file not found' }
    }

    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Logs',
      defaultPath: 'innosoft-logs.txt',
      buttonLabel: 'Export',
      filters: [{ name: 'Text Files', extensions: ['txt'] }]
    })

    if (filePath) {
      fs.copyFileSync(logFilePath, filePath)
      return { IsSomething: true, Message: 'Logs exported successfully' }
    }
    
    return { IsSomething: false, Message: 'Export cancelled' }
  } catch (error: unknown) {
    return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
  }
})
