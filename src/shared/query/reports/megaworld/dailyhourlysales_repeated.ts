export const mwDailyHourlySalesRepeated = ({ Dates, Terminal }: any): string => {
  return `
        SELECT
        CASE
            WHEN DATEPART(HOUR, [TrnCollection].EntryDateTime) = 0 THEN '24'
            ELSE RIGHT('0' + CAST(DATEPART(HOUR, [TrnCollection].EntryDateTime) AS VARCHAR), 2)
        END AS [HourCode],
        SUM(
            CASE 
                WHEN ISNULL([TrnCollection].[IsReturn], 0) = 2 
                THEN 0 
                ELSE CAST(ROUND([TrnCollection].[Amount], 2) AS DECIMAL(10, 2))
            END
        ) AS [NetSalesAmountHour],
        COUNT(DISTINCT [TrnCollection].[Id]) AS [NoSalesTransactionHour],
        COUNT(DISTINCT CASE WHEN [TrnSales].[CustomerId] = 1 THEN [TrnSales].[Id] ELSE NULL END) + COUNT(DISTINCT CASE WHEN [TrnSales].[CustomerId] > 1 THEN [TrnSales].[CustomerId] ELSE NULL END) AS [CustomerCountHour]
    FROM 
        [TrnSales]
        LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSales].Id

    WHERE 
        [TrnCollection].[IsLocked] = 1 
        AND [TrnCollection].[IsLocked] = 1 
        AND [TrnCollection].[TerminalId] = ${Terminal}
        AND [TrnCollection].[IsCancelled] = 0  
        AND CAST([TrnCollection].CollectionDate AS DATE) = '${Dates}'
    GROUP BY 
        [TrnCollection].[TerminalId],
        [TrnCollection].CollectionDate,
        DATEPART(HOUR, [TrnCollection].EntryDateTime)
            `
}
