export const mwDailyHourlySales = ({ Dates, Terminal, MallPartnerCodeId }: any): string => {
  return `
     SELECT
    '${MallPartnerCodeId}' AS [MallPartnerCodeId],
    SalesDay.[TerminalId] AS [Terminal],
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
            TrnCollection.SalesId, 
            TrnCollection.[IsCancelled],
            TrnCollection.[TerminalId],
            TrnCollection.CollectionDate,
            SUM(
                CASE 
                    WHEN ISNULL(TrnSales.[IsReturn], 0) = 2 
                    THEN 0 
                    ELSE CAST(ROUND(TrnCollection.Amount, 2) AS DECIMAL(10, 2))
                END
            ) AS [NetSalesAmount]
        FROM 
            TrnCollection 
            INNER JOIN TrnSales ON TrnSales.Id = TrnCollection.SalesId
        GROUP BY 
            TrnCollection.SalesId,
            TrnCollection.[IsCancelled],
            TrnCollection.[TerminalId],
            TrnCollection.CollectionDate
    ) AS SalesDay ON [TrnSales].Id = SalesDay.SalesId
WHERE 
    [TrnSales].[IsLocked] = 1 
    AND SalesDay.[TerminalId] = ${Terminal}
    AND SalesDay.[IsCancelled] = 0 
    AND CAST(SalesDay.CollectionDate AS DATE) = '${Dates}'
GROUP BY 
   SalesDay.[TerminalId],
    CAST(SalesDay.CollectionDate AS DATE)
  `
}
