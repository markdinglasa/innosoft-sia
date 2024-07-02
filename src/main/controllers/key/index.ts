

import { CODE_KEY } from '@shared/constants';
import { SqlChannel } from '@shared/types/sql';
import { ipcMain } from 'electron';
import { getBiosSerialNumber, getStorageSerialNumber, XOREncryption } from '../../functions';

ipcMain.handle(
  SqlChannel.getKey,
  async (_event: any): Promise<any> => {
    try {
        const bios = await getBiosSerialNumber();
        const strg = await getStorageSerialNumber();
        if (!bios || !strg) return ({ key: null, message: `bios or storage is missing`});
        let tmp = `${bios}${strg}`.replace(/[^\w]/g, '').replace('.', '').replace('_', '').replace('-', '');
        tmp = await XOREncryption(CODE_KEY, tmp);
        return ({ key: tmp, message: `key is generated`});
    } catch (error: any) {
        return ({ key: null, message: `Internal Server Error: ${error}`});
    }
  }
)
