import { ConnectionPool } from "mssql";

export interface ConnectionResult {
    pool: ConnectionPool;
    isConnected: boolean;
}