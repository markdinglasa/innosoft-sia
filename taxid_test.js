const sql = require('mssql');
const fs = require('fs');

async function run() {
  const config = {
    user: 'sa',
    password: 'innosoft',
    server: 'localhost',
    database: 'pos13',
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
    const r1 = await pool.request().query("SELECT TaxId, COUNT(*) as Count, SUM(Amount) as TotalAmount, SUM(TaxAmount) as TotalTaxAmount FROM TrnSalesLine GROUP BY TaxId");
    fs.writeFileSync('taxid_debug.txt', JSON.stringify({ r1: r1.recordset }, null, 2));
  } catch (err) {
    fs.writeFileSync('taxid_debug.txt', String(err));
  } finally {
    sql.close();
  }
}

run();
