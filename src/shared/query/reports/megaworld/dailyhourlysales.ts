export const mwDailyHourlySales = ({ Dates, Terminal, MallPartnerCodeId }: any): string => {
  return `
    SELECT
        '${MallPartnerCodeId}' AS [MallPartnerCodeId],
        TrnCollection.[TerminalId] AS [Terminal],
        '${Dates}' AS [Date],
		SUM(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN TrnCollection.[Amount] ELSE 0 END) AS [NetSalesAmountDay],
        COUNT(DISTINCT TrnCollection.[Id]) AS [NoSalesTransactionDay],
        COUNT(DISTINCT
            CASE 
                WHEN [MstCustomer].[Customer] = 'Walk In' THEN TrnCollection.[Id]
                ELSE NULL
            END
        ) 
        +
        COUNT(DISTINCT
            CASE 
                WHEN [MstCustomer].[Customer] <> 'Walk In' THEN TrnCollection.[CustomerId]
                ELSE NULL
            END
        ) AS [CustomerCountDay]
    FROM TrnCollection 
        LEFT JOIN [MstCustomer] ON [MstCustomer].[Id] = TrnCollection.[CustomerId]
    WHERE 
        TrnCollection.[IsLocked] = 1 
        AND TrnCollection.[TerminalId] = ${Terminal}  
        AND TrnCollection.[IsCancelled] = 0 
        AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
    GROUP BY 
        TrnCollection.[TerminalId],
        CAST(TrnCollection.CollectionDate AS DATE)
  `
}
