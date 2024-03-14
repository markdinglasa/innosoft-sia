import sql, { ConnectionPool, Request } from 'mssql';
import { Connection } from './connection';
//import queryData from '../texts/query.json';
//import tableData from '../texts/table.json';
//import errorData from '../texts/table.json';
//import successData from '../texts/table.json';
import { ConnectionResult } from '../../shared';


export const getDataByTable = async (table: string): Promise<any[]> => {
    let pool: ConnectionPool | null = null;
    let isConnected = false;
    try {
        const connectionResult: ConnectionResult = await Connection();
        pool = connectionResult.pool;
        isConnected = connectionResult.isConnected;
        if (!isConnected) { 
            alert('DatabaseError: Database is not connected'); 
            throw new Error("Database is not connected."); 
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
/*
export const getUserByUserName = async (username) => {
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
        const query = `SELECT * FROM [MstUser] WHERE UserName = ${table}`;
        const result = await request.query(query);
        return result.recordset || [];
      console.log(username);
      const d72736C74 = await o6D646C73.f676574514644(o02x747874.q0usx02,['UserName'], [o73716C.NVarChar(255)], [c7573726E6D]);
      if (d72736C74.length === 0) return console.log(o01x747874.e00x03);
      return  d72736C74;
    } catch (error) {
      return console.log(o01x747874.e00x05);
    }
}
*/

export const get = async (Query: string, Field:string[], FieldType: any[], Data: any[]): Promise<any[]> => {
    let pool: ConnectionPool | null = null;
    let isConnected = false;
    try {
        const connectionResult: ConnectionResult = await Connection();
        pool = connectionResult.pool;
        isConnected = connectionResult.isConnected;
        if (!isConnected) { 
            alert('DatabaseError: Database is not connected'); 
            throw new Error("Database is not connected."); 
        }
        pool.setMaxListeners(15);
        if (!Query) throw new Error('SQL query is empty or invalid');
        if (!Field || !Data || Field.length !== Data.length || Field.length !== FieldType.length) throw new Error('Field, Data, or ar666C64747970 is empty, or their lengths do not match');

        const request: Request = pool.request();

        for (let i = 0; i < Field.length; i++) {
            if (Data[i] !== undefined) {
                request.input(Field[i], FieldType[i], Data[i]);
            } else {
                alert(`ModelFunctionError: Data for field '${Field[i]}' is undefined`); 
                throw new Error(`Data for field '${Field[i]}' is undefined`);
            }
        }
        const { recordset } = await request.query(Query);
        return recordset || [];
    } catch (error) {
        throw error;
    } finally {
        try {
            if (pool) {
                await pool.close();
            }
        } catch (closeError) {
            throw closeError;
        }
    }
  }// END HERE

export const getById = async (Id:number, Table:string) => {
    let pool: ConnectionPool | null = null;
    let isConnected = false;
    try {
        const connectionResult: ConnectionResult = await Connection();
        pool = connectionResult.pool;
        isConnected = connectionResult.isConnected;
        if (!isConnected) { 
            alert('DatabaseError: Database is not connected'); 
            throw new Error("Database is not connected."); 
        }
        pool.setMaxListeners(15);
        const request: Request = pool.request();
        const query = `SELECT * FROM ${Table} WHERE Id = @Id`;
        request.input('Id', sql.Int, Id);
        const result = await request.query(query);
        return (result.recordset.length > 0)? result.recordset[0]:  null;
    } catch (error) {
        throw error;
    } finally {
        try {
            if (pool) {
                await pool.close();
            }
        } catch (closeError) {
            throw closeError;
        }
    }
}