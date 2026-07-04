const sql = require('mssql');
const fs = require('fs');

async function run() {
  const config = {
    user: 'sa',
    password: 'innosoft',
    server: 'localhost',
    port: 1433,
    options: {
      encrypt: true,
      trustServerCertificate: true,
      cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
      }
    }
  };

  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT name FROM sys.databases");
    fs.writeFileSync('dbs_debug.txt', JSON.stringify(result.recordset, null, 2));
    console.log("Success");
  } catch (err) {
    console.error("error", err);
    fs.writeFileSync('dbs_debug.txt', String(err));
  } finally {
    sql.close();
  }
}

run();
