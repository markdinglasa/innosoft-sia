import { ConnectionPool } from 'mssql';
import { POOL } from './connection';

export const getDataByTable = async (table: string): Promise<any[]> => {
    let pool: ConnectionPool | null = null;
    try {
        pool = await POOL();
        pool.setMaxListeners(15);
        const request = pool.request();
        const query = `SELECT * FROM ${table}`;
        const result = await request.query(query);
        return result.recordset || [];
    } catch (error) {
        throw new Error(`Error executing query in getDataByTable: ${error}`);
    } finally {
        try {
            if (pool) {
                await pool.close();
            }
        } catch (error) {
            throw new Error(`Error closing database connection in getDataByTable: ${error}`);
        }
    }
};
