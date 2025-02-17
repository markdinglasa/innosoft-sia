export const mwDailyDiscount = ({ Dates, Terminal }: any): string => {
  return `
  
        SELECT 
            TrnCollection.[TerminalId] AS TerminalId,
            CASE WHEN [MstDiscount].[Discount] <> 'Zero Discount' THEN [MstDiscount].[Discount] ELSE 'NA' END AS [DiscountCode],
            CASE WHEN [MstDiscount].[Discount] <> 'Zero Discount' THEN [MstDiscount].[Discount] ELSE 'NA' END  AS [DiscountDescription],
            Sum(CASE 
            WHEN ([TrnSalesLine].[DiscountAmount] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) = 0) 
            THEN [TrnSalesLine].[DiscountAmount]
            ELSE 0
            END) AS [DiscountAmount]
        FROM 
            [TrnSales] 
            INNER JOIN [TrnSalesLine] 
            LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
            INNER JOIN [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
        WHERE 
                [TrnSales].[IsLocked] = 1 
                AND [TrnCollection].[IsLocked] = 1 
                AND TrnCollection.[TerminalId] = ${Terminal}
                AND TrnCollection.[IsCancelled] = 0 AND [TrnCollection].[IsCancelled] = 0  
                AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
        GROUP BY 
            TrnCollection.[TerminalId],
            [MstDiscount].[Discount]
            `
}
