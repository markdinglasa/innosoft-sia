import { Error, Success } from '@shared/messages';
import { DBConfig } from '@shared/types';
import { SqlChannel } from '@shared/types/sql';
import { ipcMain } from 'electron';
import Store from 'electron-store';

interface Response {
    Data: boolean;
    Message: string;
}

ipcMain.handle(SqlChannel.setConnection, async (_event: any, config:DBConfig): Promise<Response> => {
  try {
    if (!config) return ({Data: false, Message: Error.e00x43})
    const store = new Store()
    store.set(SqlChannel.dbConfig, config)
    return ({Data: true, Message: Success.s00x00})
  } catch (error: any) {
    return ({Data: false, Message: Error.e00x02})
  }
})
