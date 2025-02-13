export const mwSalesType = ({ Dates, Terminal }: any): string => {
  return `
        SELECT 
            CASE 
                WHEN [MstItem].Category = 'food' THEN '01' -- text-transform: lowercase
                WHEN [MstItem].Category = 'non-food' THEN '02'
                WHEN [MstItem].Category = 'groceries' OR [MstItem].Category = 'grocery' THEN '03'
                WHEN [MstItem].Category = 'medicines' OR [MstItem].Category = 'medicine' THEN '04'
                ELSE '05' -- other
            END AS [SalesType],
            SUM(TrnSalesLine.Amount) AS [NetSalesAmount] 
        FROM [TrnSales]
		LEFT JOIN [TrnSalesLine] ON [TrnSalesLine].[SalesId] = [TrnSales].[Id]
        LEFT JOIN [MstItem] ON [MstItem].[Id] = [TrnSalesLine].[ItemId]
		WHERE 
        [TrnSales].[IsLocked] = 1 
        AND [TrnSales].[IsLocked] = 1 
        AND [TrnSales].[TerminalId] = ${Terminal}
        AND [TrnSales].[IsCancelled] = 0 
        AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
        GROUP BY [MstItem].Category
    `
}
