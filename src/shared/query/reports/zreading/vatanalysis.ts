export const ZVATAnalysis = ({ Dates, Terminal }: any): string => {
  return `
SELECT 
	SUM(
		CASE WHEN TrnSalesLine.DiscountId <> 7 AND TrnSalesLine.DiscountId <> 16 AND TrnSalesLine.TaxId = 4
		THEN TrnSalesLine.Amount
		ELSE 0 
	END) AS VATSales,
	SUM((CASE WHEN(([TrnSalesLine].[TaxRate] > 0)) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END)) AS [VATAmount],
	SUM(
		CASE WHEN (ISNULL([MstDiscount].IsVatExempt,0) = 1)  AND (TrnSalesLine.TaxId <> 9 OR TrnSalesLine.TaxId = 18)
		THEN TrnSalesLine.Amount
		ELSE 0 
	END) AS VATExempt,
	SUM (
		CASE WHEN (TrnSalesLine.TaxId = 9 OR TrnSalesLine.ItemId = 1)
		THEN TrnSalesLine.Amount
		ELSE 0 END
	) AS NONVat
	FROM TrnCollection 
	LEFT JOIN TrnSalesLine ON TrnSalesLine.SalesId = TrnCollection.SalesId
	LEFT JOIN MstDiscount ON MstDiscount.Id = TrnSalesLine.DiscountId
	LEFT JOIN MstTax ON MstTax.Id = TrnSalesLine.TaxId
	WHERE  
		TrnCollection.[TerminalId] = ${Terminal}
		AND ISNULL(TrnCollection.[IsReturn], 0) =  0
		AND ISNULL(TrnCollection.[IsCancelled],0) = 0
		AND TrnCollection.[IsLocked] = 1 
		AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
	GROUP BY
	TrnCollection.[TerminalId],
	CAST(TrnCollection.CollectionDate AS DATE)
		`
}
