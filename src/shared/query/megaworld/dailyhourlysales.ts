export const mwDailyHourlySales = ({ Dates, Terminal, MallPartnerCodeId }: any): string => {
  return `
        SELECT
        '${MallPartnerCodeId}' AS [MallPartnerCodeId],
        [TrnSales].[TerminalId] AS [Terminal],
        '${Dates}' AS [Date],
        SUM(
            CASE 
                WHEN ISNULL([TrnCollection].[IsReturn], 0) = 2 
                THEN 0 
                ELSE CAST(ROUND([TrnSalesLine].[Amount], 2) AS DECIMAL(10, 2))
            END
        ) AS [NetSalesAmountDay],
        COUNT(DISTINCT [TrnSales].[Id]) AS [NoSalesTransactionDay],
        COUNT(DISTINCT
        CASE 
            WHEN [TrnSales].[CustomerId] = 1 THEN [TrnSales].[Id] -- Count each walk-in customer individually
            ELSE NULL
        END
    ) 
    +
    COUNT(DISTINCT
        CASE 
            WHEN [TrnSales].[CustomerId] > 1 THEN [TrnSales].[CustomerId] -- Count distinct customers for Id > 1
            ELSE NULL
        END
    ) AS [CustomerCountDay]
    FROM 
        [TrnSales]
        INNER JOIN [TrnSalesLine] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
        LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
        INNER JOIN [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id]
        LEFT JOIN [TrnPaxTable] ON [TrnPaxTable].[SaleId] = [TrnSalesLine].[SalesId]
        INNER JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id]
    WHERE 
        [TrnSales].[IsLocked] = 1 
        AND [TrnCollection].[IsLocked] = 1 
        AND [TrnSales].[TerminalId] = ${Terminal}
        AND [TrnSales].[IsCancelled] = 0 
        AND [TrnCollection].[IsCancelled] = 0  
        AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
    GROUP BY 
        [TrnSales].[TerminalId],
        [TrnSales].[SalesDate]`
}
