import { AppDataSource } from './src/main/typeORM/configurations'
import { detectDbCapabilities } from './src/main/typeORM/db-capabilities'

async function debugLines() {
  await AppDataSource.initialize()
  await detectDbCapabilities()

  for (const receiptNo of ['0010001000015', '0010001000016', '0010001000017']) {
    const collection = await AppDataSource.getRepository('TrnCollection')
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.sales', 'sales')
      .leftJoinAndSelect('sales.salesLines', 'salesLine')
      .where("REPLACE(collection.collectionNumber, '-', '') = :receiptNo", { receiptNo })
      .getOne()

    if (!collection) {
      console.log(`Receipt ${receiptNo} not found!`)
      continue
    }

    console.log(`--- Receipt: ${receiptNo} ---`)
    console.log(`Collection Amount: ${collection.amount}`)
    console.log(`Sales Amount: ${collection.sales.amount}`)

    let sum = 0
    for (const line of collection.sales.salesLines) {
      console.log(`  Line: ${line.id} - Qty: ${line.quantity} - Amount: ${line.amount}`)
      sum += Number(line.amount)
    }
    console.log(`  Sum of lines: ${sum}`)
  }
  process.exit(0)
}

debugLines().catch(console.error)
