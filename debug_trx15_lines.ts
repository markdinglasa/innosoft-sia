import { AppDataSource } from './src/main/typeORM/configurations'
import { detectDbCapabilities } from './src/main/typeORM/db-capabilities'
import * as fs from 'fs'

async function run() {
  await AppDataSource.initialize()
  await detectDbCapabilities()

  // Find sales id for Trx 15
  const colls = await AppDataSource.query(`
    SELECT SalesId, Amount, CollectionNumber
    FROM TrnCollection
    WHERE REPLACE(CollectionNumber, '-', '') = '0010001000015'
  `)
  
  if (!colls.length) {
    fs.writeFileSync('trx15_debug.txt', 'No collection found')
    process.exit(0)
  }
  
  const salesId = colls[0].SalesId

  const lines = await AppDataSource.query(`
    SELECT Id, ItemId, Quantity, Price, Amount, TaxAmount, TaxRate, DiscountAmount
    FROM TrnSalesLine
    WHERE SalesId = ${salesId}
  `)
  
  fs.writeFileSync('trx15_debug.txt', JSON.stringify({ collection: colls[0], lines }, null, 2))
  
  process.exit(0)
}

run().catch(e => {
  fs.writeFileSync('trx15_debug.txt', String(e))
  process.exit(1)
})
