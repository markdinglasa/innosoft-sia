import { AppDataSource } from './configurations'

export const DbCapabilities = {
  hasIsReturn: false
}

export const detectDbCapabilities = async () => {
  try {
    // 1. Fetch all columns for all tables in the current database
    const dbColumns = await AppDataSource.query(`
      SELECT TABLE_NAME, COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS
    `)

    // 2. Build a map of valid columns per table (case-insensitive)
    const validColumnsMap = new Map<string, Set<string>>()
    for (const row of dbColumns) {
      const tableName = String(row.TABLE_NAME).toLowerCase()
      const columnName = String(row.COLUMN_NAME).toLowerCase()

      if (!validColumnsMap.has(tableName)) {
        validColumnsMap.set(tableName, new Set<string>())
      }
      validColumnsMap.get(tableName)!.add(columnName)
    }

    // 3. Prune missing columns from TypeORM's EntityMetadata
    let prunedCount = 0
    for (const metadata of AppDataSource.entityMetadatas) {
      const tableName = metadata.tableName.toLowerCase()
      const validColumns = validColumnsMap.get(tableName)

      if (validColumns) {
        // Filter function to check if the database actually has this column
        const isColumnValid = (column: any) => validColumns.has(column.databaseName.toLowerCase())

        const originalCount = metadata.columns.length

        metadata.columns = metadata.columns.filter(isColumnValid)
        metadata.nonVirtualColumns = metadata.nonVirtualColumns.filter(isColumnValid)
        metadata.ownColumns = metadata.ownColumns.filter(isColumnValid)

        prunedCount += originalCount - metadata.columns.length
      }
    }

    // 4. Update the specific hasIsReturn flag for raw SQL queries
    const trnCollectionCols = validColumnsMap.get('trncollection')
    DbCapabilities.hasIsReturn = trnCollectionCols ? trnCollectionCols.has('isreturn') : false

    console.log(
      `DbCapabilities detected: ${prunedCount} missing columns pruned. hasIsReturn = ${DbCapabilities.hasIsReturn}`
    )
  } catch (err) {
    console.warn('Failed to detect DB capabilities and prune metadata, using safe defaults:', err)
  }
}

export const isReturnExpr = () => {
  return DbCapabilities.hasIsReturn ? 'collection.IsReturn' : '0'
}
