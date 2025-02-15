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
FROM 
    [TrnCollection]
    LEFT JOIN [TrnSalesLine] ON [TrnSalesLine].[SalesId] = [TrnCollection].[SalesId]
    LEFT JOIN [MstItem] ON [MstItem].[Id] = [TrnSalesLine].[ItemId]
WHERE 
    [TrnCollection].[IsLocked] = 1 
    AND [TrnCollection].[TerminalId] = ${Terminal}
    AND [TrnCollection].[IsCancelled] = 0 
    AND CAST([TrnCollection].[CollectionDate] AS DATE) = '${Dates}'
GROUP BY 
    CASE 
        WHEN [MstItem].Category = 'food' THEN '01'
        WHEN [MstItem].Category = 'non-food' THEN '02'
        WHEN [MstItem].Category = 'groceries' OR [MstItem].Category = 'grocery' THEN '03'
        WHEN [MstItem].Category = 'medicines' OR [MstItem].Category = 'medicine' THEN '04'
        ELSE '05'
    END
    `
}
