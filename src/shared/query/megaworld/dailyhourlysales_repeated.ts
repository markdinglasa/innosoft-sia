export const mwDailyHourlySalesRepeated = ({ Dates, Terminal }: any): string => {
  return `
        SELECT
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
        COUNT(DISTINCT [TrnSales].[Id]) AS [NoSalesTransactionHour],
        COUNT(DISTINCT CASE WHEN [TrnSales].[CustomerId] = 1 THEN [TrnSales].[Id] ELSE NULL END) + COUNT(DISTINCT CASE WHEN [TrnSales].[CustomerId] > 1 THEN [TrnSales].[CustomerId] ELSE NULL END) AS [CustomerCountHour]
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
        [TrnSales].[SalesDate],
        DATEPART(HOUR, [TrnSalesLine].[SalesLineTimeStamp])
            `
}
