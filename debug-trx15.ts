import { AppDataSource } from './src/main/typeORM/configurations'
import { detectDbCapabilities } from './src/main/typeORM/db-capabilities'

async function debugTrx15() {
  await AppDataSource.initialize()
  await detectDbCapabilities()

  const collection = await AppDataSource.getRepository('TrnCollection')
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.sales', 'sales')
      .leftJoinAndSelect('sales.salesLines', 'salesLine')
      .leftJoinAndSelect('salesLine.item', 'item')
      .where("REPLACE(collection.collectionNumber, '-', '') = '0010001000015'")
      .getOne()

  console.log(JSON.stringify(collection?.sales?.salesLines, null, 2))
  process.exit(0)
}

debugTrx15().catch(console.error)
