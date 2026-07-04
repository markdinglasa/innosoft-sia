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
    
    // Fetch Items for 38588 (Trx 15) and 38587 (Trx 16)
    const items = await pool.request().query(`
      SELECT sl.SalesId, sl.Amount, sl.ItemId, i.BarCode, i.IsInventory, i.ItemDescription, sl.TaxAmount
      FROM TrnSalesLine sl
      LEFT JOIN MstItem i ON sl.ItemId = i.Id
      WHERE sl.SalesId IN (38588, 38587)
    `);
    
    fs.writeFileSync('items_debug.txt', JSON.stringify({ items: items.recordset }, null, 2));
    
  } catch (err) {
    fs.writeFileSync('items_debug.txt', String(err));
  } finally {
    sql.close();
  }
}

run();
