import { DatabaseConnection, SqlChannel } from '@shared/types';
import { ipcMain } from 'electron';
import { Connection } from '../../../functions';

ipcMain.handle(SqlChannel.isConnected, async (_event: any): Promise<boolean> => {
  try {
    const result: DatabaseConnection = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Connection timeout')), 4000);
      Connection()
        .then(connection => {
          clearTimeout(timeout);
          resolve(connection);
        })
        .catch(error => {
          clearTimeout(timeout);
          reject(error);
        });
    });
    if (!result.isConnected) return false;
    return true;
  } catch (error: any) {
    return false;
  }
});