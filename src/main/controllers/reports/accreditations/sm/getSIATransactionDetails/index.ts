import { SIATransactionDetailsHeaders as headers } from '@shared/data'
import { Error, Success } from '@shared/messages'
import { Response, SIATransactionDetail, SqlChannel } from '@shared/types'
import { createArrayCsvWriter } from 'csv-writer'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateSMFileName } from '../../../../../functions'
import { recordByQuery } from '../../../../../model'

const csvHeaders = headers.map((header) => header.title)
ipcMain.handle(
  SqlChannel.getSIATransactionDetails,
  async (_event: any, path: string, query: string, dates: string): Promise<Response> => {
    try {
      const response = await recordByQuery(query)
      if (!response.List) return { IsSomething: false, Message: response.Message }
      const fileName = generateSMFileName(true, dates)
      const filePath = paths.join(path, fileName)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      const csvData = response.List.map((item: SIATransactionDetail) => [
        item.OrderNumber,
        item.ItemId,
        item.ItemName,
        item.ItemParentCategory,
        item.ItemCategory,
        item.ItemSubCategory,
        item.ItemQuantity,
        item.TransactionItemPrice,
        item.MenuItemPrice,
        item.DiscountCode,
        item.DiscountAmount,
        item.Modifier1Name,
        item.Modifier1Quantity,
        item.Modifier2Name,
        item.Modifier2Quantity,
        item.Void,
        item.VoidAmount,
        item.Refund,
        item.RefundAmount
      ])
      const csvWriter = createArrayCsvWriter({
        path: filePath,
        header: csvHeaders
      })
      await csvWriter.writeRecords(csvData)
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      return { IsSomething: false, Message: error.message || Error.e00x02 }
    }
  }
)
