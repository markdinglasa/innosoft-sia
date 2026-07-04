const sql = require('mssql')
const fs = require('fs')

async function run() {
  const config = {
    user: 'sa',
    password: 'innosoft',
    server: 'localhost',
    database: 'pos_myk',
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

    // Find Collection
    const colls = await pool
      .request()
      .query(
        "SELECT Id, SalesId, Amount, CollectionNumber FROM TrnCollection WHERE REPLACE(CollectionNumber, '-', '') = '0010001000015'"
      )

    if (colls.recordset.length === 0) {
      fs.writeFileSync('myk_debug.txt', 'No collection found')
      return
    }

    const salesId = colls.recordset[0].SalesId

    // Find Sales Lines
    const lines = await pool
      .request()
      .query(
        'SELECT Id, ItemId, Quantity, Price, Amount, TaxAmount, TaxRate, DiscountAmount FROM TrnSalesLine WHERE SalesId = ' +
          salesId
      )

    fs.writeFileSync(
      'myk_debug.txt',
      JSON.stringify({ collection: colls.recordset[0], lines: lines.recordset }, null, 2)
    )
    console.log('Success! Data written to myk_debug.txt')
  } catch (err) {
    console.error('SQL error', err)
    fs.writeFileSync('myk_debug.txt', String(err))
  } finally {
    sql.close()
  }
}

run()
