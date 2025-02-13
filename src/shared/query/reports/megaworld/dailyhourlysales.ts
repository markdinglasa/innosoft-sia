export const mwDailyHourlySales = ({ Dates, Terminal, MallPartnerCodeId }: any): string => {
  return `
    SELECT
    '${MallPartnerCodeId}' AS [MallPartnerCodeId],
    [TrnSales].[TerminalId] AS [Terminal],
    '${Dates}' AS [Date],
    SUM(SalesDay.NetSalesAmount) AS [NetSalesAmountDay],
    COUNT(DISTINCT [TrnSales].[Id]) AS [NoSalesTransactionDay],
    COUNT(DISTINCT
        CASE 
            WHEN [TrnSales].[CustomerId] = 1 THEN [TrnSales].[Id]
            ELSE NULL
        END
    ) 
    +
    COUNT(DISTINCT
        CASE 
            WHEN [TrnSales].[CustomerId] > 1 THEN [TrnSales].[CustomerId]
            ELSE NULL
        END
    ) AS [CustomerCountDay]
FROM 
    [TrnSales]
    LEFT JOIN (
        SELECT 
            TrnSalesLine.SalesId, 
            SUM(
                CASE 
                    WHEN ISNULL(TrnSales.[IsReturn], 0) = 2 
                    THEN 0 
                    ELSE CAST(ROUND(TrnSalesLine.[NetPrice] * TrnSalesLine.[Quantity], 2) AS DECIMAL(10, 2))
                END
            ) AS [NetSalesAmount]
        FROM 
            TrnSalesLine 
            INNER JOIN TrnSales ON TrnSales.Id = TrnSalesLine.SalesId
        GROUP BY 
            TrnSalesLine.SalesId
    ) AS SalesDay ON [TrnSales].Id = SalesDay.SalesId
WHERE 
    [TrnSales].[IsLocked] = 1 
    AND [TrnSales].[TerminalId] = ${Terminal}
    AND [TrnSales].[IsCancelled] = 0 
    AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
GROUP BY 
    [TrnSales].[TerminalId],
    CAST([TrnSales].[SalesDate] AS DATE)
  `
}
