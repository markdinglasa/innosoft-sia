const sql = require('mssql')
const fs = require('fs')

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
  }

  try {
    const pool = await sql.connect(config)
    const r1 = await pool.request().query(`
      SELECT 
        SUM(ROUND(CASE WHEN c.IsCancelled = 0 AND COALESCE(sl.TaxAmount, 0) < 1 AND sl.ItemId <> 1 THEN sl.Amount ELSE 0 END, 2)) as notaxsale,
        SUM(ROUND(CASE WHEN s.IsCancelled = 0 AND d.Discount <> 'Senior Citizen Discount' AND d.Discount <> 'PWD' AND COALESCE(sl.TaxAmount, 0) > 0 THEN sl.Amount ELSE 0 END, 2)) as taxsale
      FROM TrnSales s
      LEFT JOIN TrnSalesLine sl ON s.Id = sl.SalesId
      LEFT JOIN TrnCollection c ON s.Id = c.SalesId
      LEFT JOIN MstDiscount d ON sl.DiscountId = d.Id
      WHERE s.IsLocked = 1
        AND c.IsLocked = 1
        AND c.TerminalId = 1
        AND CAST(c.CollectionDate AS DATE) = '2024-11-19'
    `)

    fs.writeFileSync('alliance_debug.txt', JSON.stringify({ raw: r1.recordset }, null, 2))
  } catch (err) {
    fs.writeFileSync('alliance_debug.txt', String(err))
  } finally {
    sql.close()
  }
}

run()
