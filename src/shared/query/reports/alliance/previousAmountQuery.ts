export const PreviousAmountsQuery: Function = ({ Terminal, Dates }: any): string => {
  return `
    SELECT 
    SUM(ROUND(CASE WHEN( ISNULL([TrnSales].[IsCancelled],0) = 0 AND ISNULL([TrnSales].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [PreviousReading],
      SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnSales].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [previoustax],
      SUM(ROUND((CASE WHEN((ISNULL([TrnSales].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ISNULL([TrnSalesLine].[TaxAmount],0)>0) THEN [TrnSalesLine].[Amount]-[TrnSalesLine].[TaxAmount] ELSE 0 END), 4)) AS [previoustaxsale],
      SUM(ROUND(CASE WHEN(((ISNULL([TrnSales].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND ([TrnSalesLine].[TaxAmount]<1) AND ([TrnSalesLine].[Discountid]<>4 And [TrnSalesLine].[Discountid]<>3)) THEN[TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [previousnotaxsale]
      
         FROM TrnSales 
              LEFT JOIN [TrnSalesLine] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
              LEFT JOIN [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id]
              LEFT JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id] 
              LEFT JOIN (SELECT [SalesId], SUM(([DiscountAmount]) * ([Quantity])) AS [TotalDiscountAmount] FROM [TrnSalesLine] GROUP BY [SalesId]) AS [TotalDiscount] ON [TrnSales].[Id] = [TotalDiscount].[SalesId]
          WHERE 
              [TrnSales].[IsLocked] = 1 
              AND [TrnSales].[TerminalId] = ${Terminal}
              AND CAST([TrnSales].[SalesDate] AS DATE) < '${Dates}'
          GROUP BY 
          [TrnSales].[TerminalId]
    `
}
