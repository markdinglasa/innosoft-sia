export const ZTrx = ({ Dates, Terminal }: any): string => {
  return `
        SELECT
 	  COUNT (DISTINCT [TrnSales].Id)  AS [TotalTrx],
      SUM( CASE WHEN ISNULL([TrnSales].[IsCancelled],0)= 0 THEN [TrnSalesLine].[Quantity] ELSE 0 END) AS [TotalQuantity],
	  COUNT( CASE WHEN ISNULL([TrnSales].[IsCancelled],0)= 0 AND ISNULL([TrnSalesLine].ItemId,0) > 0 THEN [TrnSalesLine].[ItemId] ELSE null END) AS [TotalSKU]
      FROM 
           [TrnSales]
          INNER JOIN [TrnSalesLine] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
      WHERE 
          [TrnSales].[IsLocked] = 1 
          AND [TrnSales].[TerminalId] = ${Terminal}
          AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
      GROUP BY 
          [TrnSales].[TerminalId],
          [TrnSales].[SalesDate]
      `
}
