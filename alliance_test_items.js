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
        sl.ItemId,
        i.ItemDescription,
        sl.Amount,
        sl.TaxAmount,
        t.Tax as TaxName
      FROM TrnSales s
      LEFT JOIN TrnSalesLine sl ON s.Id = sl.SalesId
      LEFT JOIN TrnCollection c ON s.Id = c.SalesId
      LEFT JOIN MstTax t ON sl.TaxId = t.Id
      LEFT JOIN MstItem i ON sl.ItemId = i.Id
      WHERE s.IsLocked = 1
        AND c.IsLocked = 1
        AND c.TerminalId = 1
        AND CAST(c.CollectionDate AS DATE) = '2024-11-19'
    `)

    fs.writeFileSync('alliance_items_nov19.txt', JSON.stringify({ raw: r1.recordset }, null, 2))
  } catch (err) {
    fs.writeFileSync('alliance_items_nov19.txt', String(err))
  } finally {
    sql.close()
  }
}

run()
