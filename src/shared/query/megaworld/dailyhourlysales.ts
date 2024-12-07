export const mwDailyHourlySales = ({ Date, Terminal, MallParnterCodeId }: any): string => {
  return `
        SELECT
        '${MallParnterCodeId}' AS [MallPartnerCodeId],
        [TrnSales].[TerminalId] AS [Terminal],
        '${Date}' AS [Date],
        CASE
            WHEN DATEPART(HOUR, [TrnSalesLine].[SalesLineTimeStamp]) = 0 THEN '24'
            ELSE RIGHT('0' + CAST(DATEPART(HOUR, [TrnSalesLine].[SalesLineTimeStamp]) AS VARCHAR), 2)
        END AS [HourCode],
        SUM(
            CASE 
                WHEN ISNULL([TrnCollection].[IsReturn], 0) = 2 
                THEN 0 
                ELSE CAST(ROUND([TrnSalesLine].[Amount], 2) AS DECIMAL(10, 2))
            END
        ) AS [NetSalesAmountHour],
        COUNT([TrnSales].[Id]) AS [NoSalesTransactionHour],
        COUNT(DISTINCT 
            CASE 
                WHEN ISNULL([TrnSales].[CustomerId], 0) <> 0 THEN [TrnSales].[CustomerId] 
            END
        ) AS [CustomerCountHour],
        SUM(
            CASE 
                WHEN ISNULL([TrnCollection].[IsReturn], 0) = 2 
                THEN 0 
                ELSE CAST(ROUND([TrnSalesLine].[Amount], 2) AS DECIMAL(10, 2))
            END
        ) AS [NetSalesAmountDay],
        COUNT([TrnSales].[Id]) AS [NoSalesTransactionDay],
        COUNT(
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
        AND CAST([TrnSales].[SalesDate] AS DATE) = '${Date}'
    GROUP BY 
        [TrnSales].[TerminalId],
        [TrnSales].[SalesDate],
        DATEPART(HOUR, [TrnSalesLine].[SalesLineTimeStamp])
            `
}
