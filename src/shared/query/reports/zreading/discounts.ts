export const ZDiscount = ({ Dates, Terminal }: any): string => {
  return `
	SELECT 
		[MstDiscount].[IsGovernmentMandated],
		[MstDiscount].[Discount],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ISNULL(TrnSalesLine.DiscountId,0) >0 AND ISNULL([MstDiscount].[IsGovernmentMandated],0) = 1
		THEN ISNULL(TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity, 0) 
		ELSE 0 
		END) AS [GovDiscountAmount],
		SUM(
			CASE WHEN (ISNULL([MstDiscount].IsVatExempt,0) = 1) AND (TrnSalesLine.TaxId <> 9 OR TrnSalesLine.TaxId =18)
			THEN TrnSalesLine.Amount
			ELSE 0 
		END) AS VATExempt,
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ISNULL(TrnSalesLine.DiscountId,0) >0 AND ISNULL([MstDiscount].[IsGovernmentMandated],0) = 0
		THEN ISNULL(TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity, 0) 
		ELSE 0 
		END) AS [NonGovDiscountAmount]
    FROM TrnSales 
            INNER JOIN [TrnSalesLine] ON TrnSalesLine.SalesId = TrnSales.Id
            LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
            INNER JOIN [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].Id
        WHERE 
			[MstDiscount].[Discount] <> 'Zero Discount' 
            AND [TrnCollection].[IsLocked] = 1 
            AND [TrnCollection].[TerminalId] = ${Terminal}
            AND CAST([TrnCollection].CollectionDate AS DATE) = '${Dates}'
        GROUP BY 
		[TrnCollection].[CollectionDate],
        [TrnCollection].[TerminalId],
		[MstDiscount].[Discount],
		[MstDiscount].[IsGovernmentMandated]
      `
}
