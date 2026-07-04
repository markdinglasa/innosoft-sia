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
    
    const items = await pool.request().query(`
      SELECT sl.SalesId, sl.Amount, sl.ItemId, i.ItemDescription, sl.TaxAmount, sl.Price, sl.DiscountAmount
      FROM TrnSalesLine sl
      LEFT JOIN MstItem i ON sl.ItemId = i.Id
      INNER JOIN TrnSales s ON sl.SalesId = s.Id
      INNER JOIN TrnCollection c ON s.Id = c.SalesId
      WHERE REPLACE(c.CollectionNumber, '-', '') = '0010001000015'
      AND CAST(s.SalesDate AS DATE) = '2024-11-19'
    `);
    
    fs.writeFileSync('nov19_debug.txt', JSON.stringify({ items: items.recordset }, null, 2));
    
  } catch (err) {
    fs.writeFileSync('nov19_debug.txt', String(err));
  } finally {
    sql.close();
  }
}

run();
