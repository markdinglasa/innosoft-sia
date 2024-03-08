import Store from 'electron-store';
import { ConnectionPool } from 'mssql';

interface DatabaseConnection {
    pool: ConnectionPool;
    isConnected: boolean;
}

export const Connection = async (): Promise<DatabaseConnection> => {
    try {
        const store = new Store()
        const dynaConfig:any = store.get('636E6667')
        const mssql = require('mssql');

        const config = {
            user: String(dynaConfig.username),
            password: String(dynaConfig.password),
            server: String(dynaConfig.server),
            database: String(dynaConfig.database),
            port: parseInt(dynaConfig.port, 10), // Corrected the port parsing
            options: { encrypt: false }
        };

        const pool = await new mssql.ConnectionPool(config).connect();
        pool.setMaxListeners(15);

        // Check the database connection by executing a simple query
        const result = await pool.query`SELECT 1 AS Result`;

        // Check if the query returned a result
        const isConnected = result.recordset.length > 0;

        return { pool, isConnected };
    } catch (error) {
        throw new Error(`Database connection error: ${error}`);
    }
};
