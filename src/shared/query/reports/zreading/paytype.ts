export const ZPayTypes = ({ Dates, Terminal }: any): string => {
  return `
    WITH AdjustedAmounts AS (
        SELECT
            [TrnCollection].[Id] AS CollectionId,
            [MstPayType].[PayType],
            CASE 
                WHEN ISNULL([TrnCollection].[IsReturn], 0) = 2 THEN 0
                WHEN [MstPayType].[PayType] = 'Cash' THEN
                    [TrnCollection].[Amount] - 
                    COALESCE(
                        (
                            SELECT SUM(Amount) 
                            FROM [TrnCollectionLine] 
                            WHERE [PayTypeId] <> 1 AND [CollectionId] = [TrnCollection].[Id]
                        ), 
                        0
                    )
                ELSE [TrnCollectionLine].[Amount]
            END AS AdjustedAmount
        FROM 
            [TrnCollection]
        LEFT JOIN 
            [TrnCollectionLine] ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
        LEFT JOIN 
            [MstPayType] ON [MstPayType].[Id] = [TrnCollectionLine].[PayTypeId]
        WHERE 
            [TrnCollection].[IsLocked] = 1 
            AND ISNULL([TrnCollection].[IsCancelled], 0) = 0
            AND [TrnCollection].[TerminalId] = ${Terminal}
            AND CAST([TrnCollection].[CollectionDate] AS DATE) = '${Dates}'
    )
    SELECT
        PayType,
        SUM(AdjustedAmount) AS TotalAmount
    FROM 
        AdjustedAmounts
    GROUP BY 
        PayType
    ORDER BY 
        PayType ASC;
      `
}
