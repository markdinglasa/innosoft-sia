export const mwNetSales = ({ Terminal, Dates }) => {
  return `
    SELECT 
          SUM(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN ROUND(TrnCollection.[Amount],2) ELSE 0 END) AS [NetSales],
          SUM(ROUND(CASE WHEN(ISNULL(TrnCollection.[IsCancelled], 0) = 1) THEN  TrnCollection.[Amount] ELSE 0 END, 3)) AS [VoidAmount],
          SUM(ROUND(CASE WHEN(ISNULL(TrnCollection.[IsCancelled], 0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  2) THEN  TrnCOllection.[Amount] ELSE 0 END, 3)) AS [RefundAmount]
        FROM TrnCollection 
        WHERE 
            TrnCollection.[IsLocked] = 1 
            AND [TrnCollection].[IsLocked] = 1 
            AND TrnCollection.[TerminalId] = ${Terminal}
            AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
        GROUP BY 
          TrnCollection.[TerminalId]
    `
}
