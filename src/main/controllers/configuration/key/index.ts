import { CODE_KEY } from '@shared/constants'
import { SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { getBiosSerialNumber, getStorageSerialNumber, XOREncryption } from '../../../functions'

ipcMain.handle(SqlChannel.getKey, async (_event: any): Promise<string> => {
  try {
    const bios = await getBiosSerialNumber()
    const strg = await getStorageSerialNumber()
    if (!bios || !strg) return `bios or storage is missing`
    let tmp = `${bios}${strg}`
      .replace(/[^\w]/g, '')
      .replace('.', '')
      .replace('_', '')
      .replace('-', '')
    tmp = await XOREncryption(CODE_KEY, tmp)
    return tmp
  } catch (error: any) {
    return `Internal Server Error: ${error}`
  }
})
