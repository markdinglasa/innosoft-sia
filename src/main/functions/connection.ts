import { connect } from 'mssql';

 export const POOL = async () =>{
    try {
      const config = { 
        user: `sa`,
        password: `innosoft`,
        server: `localhost`,
        database: `innosoft_pos`, 
        port: parseInt(`1433`),
        options: { encrypt: false } }
      const pool = await connect(config);
      pool.setMaxListeners(15);
      return pool;
    } catch (error) {
      throw new Error(`Database Config: ${error}`);
    }
  }
