import { SqlChannel } from '@shared/types';
import { ipcMain } from 'electron';
import { Connection, DatabaseConnection } from '../../../functions';

ipcMain.handle(SqlChannel.isConnected, async (_event: any): Promise<boolean> => {
  try {
    // Wrap the async operation with a Promise that respects the timeout
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

    // Check if connected
    if (!result.isConnected) return false;
    return true;
  } catch (error: any) {
    return false;
  }
});