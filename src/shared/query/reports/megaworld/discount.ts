export const mwDiscounts = ({ Dates, Terminal }: any): string => {
  return `
SELECT
      SUM(
          CASE 
              WHEN (ISNULL([TrnCollection].[IsReturn], 0) = 0 OR ISNULL([TrnSales].[IsCancelled], 0) = 1) 
                  AND ([MstDiscount].[Discount] = 'PWD' OR 
            [MstDiscount].[Discount] = 'Senior Citizen Discount' OR 
            [MstDiscount].[Discount] = 'MOV' OR 
            [MstDiscount].[Discount] = 'Athlete Discount' OR
            [MstDiscount].[Discount] = 'National Athlete' OR
            [MstDiscount].[Discount] = 'Single Parent')
              THEN ISNULL(TrnSalesLine.DiscountAmount*TrnSalesLine.Quantity, 0)  
              ELSE 0 
          END
      ) AS [GovMandatedDiscount],

      SUM(
          CASE 
              WHEN (ISNULL([TrnCollection].[IsReturn], 0) = 0 OR ISNULL([TrnSales].[IsCancelled], 0) = 1) 
                      AND ([MstDiscount].[Discount] <> 'PWD' AND 
            [MstDiscount].[Discount] <> 'Senior Citizen Discount' AND 
            [MstDiscount].[Discount] <> 'MOV' AND 
            [MstDiscount].[Discount] <> 'Athlete Discount' AND
            [MstDiscount].[Discount] <> 'National Athlete' AND
            [MstDiscount].[Discount] <> 'Single Parent')
              THEN ISNULL(TrnSalesLine.DiscountAmount*TrnSalesLine.Quantity, 0)  
              ELSE 0
          END
      ) AS [OtherDiscount]
	FROM 
        [TrnSales]
        INNER JOIN [TrnSalesLine] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
        LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
        INNER JOIN [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id]
 WHERE 
        [TrnSales].[IsLocked] = 1 
        AND [TrnCollection].[IsLocked] = 1 
        AND TrnCollection.[TerminalId] = ${Terminal}
        AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
    GROUP BY 
        TrnCollection.[TerminalId],
        TrnCollection.CollectionDate
        `
}
