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
    
    // Simulate what getProductLines does but with raw SQL to see what TypeORM is actually generating
    const q1 = `
      SELECT collection.Id, collection.CollectionNumber, sales.Id as SalesId, salesLine.Id as LineId, salesLine.Price, salesLine.Amount
      FROM TrnCollection collection
      LEFT JOIN TrnSales sales ON collection.SalesId = sales.Id
      LEFT JOIN TrnSalesLine salesLine ON sales.Id = salesLine.SalesId
      WHERE REPLACE(collection.CollectionNumber, '-', '') = '0010001000015'
    `;
    
    const r1 = await pool.request().query(q1);
    fs.writeFileSync('typeorm_debug.txt', JSON.stringify({ r1: r1.recordset }, null, 2));
    
  } catch (err) {
    console.error("SQL error", err);
    fs.writeFileSync('typeorm_debug.txt', String(err));
  } finally {
    sql.close();
  }
}

run();
