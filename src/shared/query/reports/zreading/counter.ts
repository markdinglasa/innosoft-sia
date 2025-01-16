export const ZVoid = ({ Dates, Terminal }: any): string => {
  return `
SELECT
	COUNT(DISTINCT CASE WHEN ISNULL(TrnCollection.IsCancelled,0) = 1 THEN [TrnCollection].[CollectionNumber] ELSE null END) AS [CancelledTx],
	SUM(CASE WHEN ISNULL(TrnCollection.IsCancelled,0) = 1 THEN  [TrnCollection].Amount ELSE 0 END) AS [CancelledAmount]
	FROM 
         [TrnSales]
        INNER JOIN [TrnSalesLine] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
        LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
    WHERE 
        [TrnSales].[IsLocked] = 1 
        AND [TrnCollection].[IsLocked] = 1 
        AND [TrnSales].[TerminalId] = ${Terminal}
        AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
    GROUP BY 
	[TrnSales].Id,
        [TrnSales].[TerminalId],
        [TrnSales].[SalesDate]
    `
}
