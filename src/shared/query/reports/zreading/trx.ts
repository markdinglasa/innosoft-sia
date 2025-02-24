export const ZTrx = ({ Dates, Terminal }: any): string => {
  return `
        SELECT
        COUNT (DISTINCT TrnCollection.Id)  AS [TotalTrx],
        SUM( CASE WHEN ISNULL(TrnCollection.[IsCancelled],0)= 0 THEN [TrnSalesLine].[Quantity] ELSE 0 END) AS [TotalQuantity],
        COUNT( CASE WHEN ISNULL(TrnCollection.[IsCancelled],0)= 0 AND ISNULL([TrnSalesLine].ItemId,0) > 0 THEN [TrnSalesLine].[ItemId] ELSE null END) AS [TotalSKU]
        FROM 
            TrnCollection
            INNER JOIN [TrnSalesLine] ON TrnCollection.[SalesId] = [TrnSalesLine].[SalesId]
        WHERE 
            TrnCollection.[IsLocked] = ${Terminal}
            AND TrnCollection.[TerminalId] = 1
            AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
        GROUP BY 
            TrnCollection.[TerminalId],
            TrnCollection.CollectionDate
      `
}
