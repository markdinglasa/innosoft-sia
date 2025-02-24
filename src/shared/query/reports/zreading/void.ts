export const ZCounter = ({ Dates, Terminal }: any): string => {
  return `
    SELECT
	MIN([TrnCollection].[CollectionNumber]) AS [CounterStart],
	MAX([TrnCollection].[CollectionNumber]) AS [CounterEnd]
	FROM 
         [TrnSales]
        INNER JOIN [TrnSalesLine] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
        LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
      
    WHERE 
        [TrnSales].[IsLocked] = 1 
        AND [TrnCollection].[IsLocked] = 1 
        AND [TrnSales].[TerminalId] = ${Terminal}
        AND CAST([TrnCollection].[CollectionDate] AS DATE) = '${Dates}'
    GROUP BY 

        [TrnCollection].[TerminalId],
        [TrnCollection].[CollectionDate]
    `
}
