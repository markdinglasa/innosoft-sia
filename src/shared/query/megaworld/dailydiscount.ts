export const mwDailyDiscount = ({ Date, Terminal }: any): string => {
  return `SELECT 
            [TrnSales].[TerminalId] AS TerminalId,
            CASE WHEN [MstDiscount].[Discount] <> 'Zero Discount' THEN [MstDiscount].[Discount] ELSE 'NA' END AS [DiscountCode],
            CASE WHEN [MstDiscount].[Discount] <> 'Zero Discount' THEN [MstDiscount].[Discount] ELSE 'NA' END  AS [DiscountDescription],
            Sum(CASE 
            WHEN ([TrnSalesLine].[DiscountAmount] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) < 1) 
            THEN CAST(ROUND([TrnSalesLine].[DiscountAmount], 5) AS DECIMAL(10, 5))
            ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
            END) AS [DiscountAmount]
            FROM [TrnSales] 
                INNER JOIN [TrnSalesLine] 
                LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
                INNER JOIN [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id]
                LEFT JOIN [TrnPaxTable] ON [TrnPaxTable].[SaleId] = [TrnSalesLine].[SalesId]
                INNER JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
            WHERE 
                [TrnSales].[IsLocked] = 1 
                AND [TrnCollection].[IsLocked] = 1 
                AND [TrnSales].[TerminalId] = ${Terminal}
                AND [TrnSales].[IsCancelled] = 0 AND [TrnCollection].[IsCancelled] = 0  
                AND CAST([TrnSales].[SalesDate] AS DATE) = '${Date}'
            GROUP BY 
            [TrnSales].[TerminalId],
            [MstDiscount].[Discount]`
}
