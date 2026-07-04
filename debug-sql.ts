import { AppDataSource } from './src/main/typeORM/configurations'
import { detectDbCapabilities } from './src/main/typeORM/db-capabilities'

async function debugTrx15() {
  await AppDataSource.initialize()
  await detectDbCapabilities()

  // Find sales id for Trx 15
  const colls = await AppDataSource.query(`
    SELECT SalesId, Amount, CollectionNumber
    FROM TrnCollection
    WHERE REPLACE(CollectionNumber, '-', '') = '0010001000015'
  `)
  
  if (!colls.length) {
    console.log("No collection found")
    process.exit(0)
  }
  
  const salesId = colls[0].SalesId
  console.log("Collection:", colls[0])

  const lines = await AppDataSource.query(`
    SELECT Id, ItemId, Quantity, Price, Amount, TaxAmount, TaxRate, DiscountAmount
    FROM TrnSalesLine
    WHERE SalesId = ${salesId}
  `)
  
  console.log("Lines:")
  console.table(lines)
  
  process.exit(0)
}

debugTrx15().catch(console.error)
