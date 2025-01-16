export const ZDiscount = ({ Dates, Terminal }: any): string => {
  return `
    		SELECT 
		MstDiscount.IsGovernmentMandated,
		[MstDiscount].[Discount],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ISNULL(TrnSalesLine.DiscountId,0) >0 AND ISNULL(MstDiscount.IsGovernmentMandated,0) = 1
		THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) 
		ELSE 0 
		END) AS [GovDiscountAmount],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ISNULL(TrnSalesLine.DiscountId,0) >0 AND ISNULL(MstDiscount.IsGovernmentMandated,0) = 0
		THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) 
		ELSE 0 
		END) AS [NonGovDiscountAmount]
        FROM TrnSales 
            INNER JOIN [TrnSalesLine] 
            LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
            INNER JOIN [MstDiscount] ON TrnSalesLine.DiscountId = MstDiscount.Id
            INNER JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
            LEFT JOIN (
                   SELECT [SalesId], SUM([Amount]) AS [ServiceCharge]
                   FROM [TrnSalesLine]
                   WHERE [ItemId] = 1
                   GROUP BY [SalesId]
               ) AS [TotalServiceCharge] ON [TrnSales].[Id] = [TotalServiceCharge].[SalesId]
			   LEFT JOIN (SELECT [SalesId], SUM(([DiscountAmount]) * ([Quantity])) AS [TotalDiscountAmount]FROM [TrnSalesLine] GROUP BY [SalesId]) AS [TotalDiscount] ON [TrnSales].[Id] = [TotalDiscount].[SalesId]
        WHERE 
            [TrnSales].[IsLocked] = 1 
			AND ISNULL(TrnSales.IsCancelled,0) = 0
			 AND [MstDiscount].[Discount] <> 'Zero Discount' 
            AND [TrnCollection].[IsLocked] = 1 
            AND [TrnSales].[TerminalId] = ${Terminal}
            AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
        GROUP BY 
		[TrnCollection].[CollectionDate],
		[TrnSalesLine].DiscountId,
        [TrnSales].[TerminalId],
		MstDiscount.Discount,
		MstDiscount.IsGovernmentMandated
      `
}
