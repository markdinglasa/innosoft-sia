import { ConnectionPool } from 'mssql';
import { Connection } from './connection';

export const getDataByTable = async (table: string): Promise<any[]> => {
    let pool: ConnectionPool | null = null;
    let isConnected = false;
    try {
        const connectionResult = await Connection();
        pool = connectionResult.pool;
        isConnected = connectionResult.isConnected;
        if (!isConnected) {
            console.error("Database is not connected.");
            return [];
        }
        pool.setMaxListeners(15);
        const request = pool.request();
        const query = `SELECT * FROM ${table}`;
        const result = await request.query(query);
        return result.recordset || [];
    } catch (error) {
        console.error(`Error executing query in getDataByTable: ${error}`);
        return [];
    } finally {
        try {
            if (pool) {
                await pool.close();
            }
        } catch (error) {
            console.error(`Error closing database connection in getDataByTable: ${error}`);
        }
    }
};
