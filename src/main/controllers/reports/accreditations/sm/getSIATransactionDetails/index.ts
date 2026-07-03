import { SIATransactionDetailsHeaders as headers } from '@shared/data'
import { Error, Success } from '@shared/messages'
import { Response, SIATransactionDetail, SqlChannel } from '@shared/types'
import { SIATransactionDetailQuery } from '@shared/query'
import { createArrayCsvWriter } from 'csv-writer'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateSMFileName } from '../../../../../functions'
import { recordByQuery } from '../../../../../model'

const csvHeaders = headers.map((header) => header.title)
ipcMain.handle(
  SqlChannel.getSIATransactionDetails,
  async (_event: any, path: string, tenant: any, dates: string): Promise<Response> => {
    try {
      const { Terminal = 1 } = tenant
      const query = SIATransactionDetailQuery({ Terminal, Dates: dates })
      const response = await recordByQuery(query)
      if (!response.List) return { IsSomething: false, Message: response.Message }
      const fileName = generateSMFileName(true, dates)
      const filePath = paths.join(path, fileName)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      const csvData: any = response.List.map((item: SIATransactionDetail) => {
        return Object.values(item).map((val: string | number) =>
          typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== ''
            ? parseFloat(val ?? 0)
            : val
        )
      })

      const csvWriter = createArrayCsvWriter({
        path: filePath,
        header: csvHeaders,
        alwaysQuote: true,
        fieldDelimiter: `,`,
        recordDelimiter: '\n'
      })

      await csvWriter.writeRecords(csvData)
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      return { IsSomething: false, Message: error.message || Error.e00x02 }
    }
  }
)
