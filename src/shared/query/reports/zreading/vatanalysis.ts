export const ZVATAnalysis = ({ Dates, Terminal }: any): string => {
  return `
 SELECT 
	SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnSales].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 5)) AS [VATAmount],
	SUM( CASE WHEN(ISNULL([TrnSales].[IsCancelled],0) = 0 AND ISNULL([TrnSalesLine].[TaxAmount],0) > 0) THEN [TrnSalesLine].[Quantity] * (CASE WHEN ISNULL(TrnSalesLine.price2,0) > 0 THEN TrnSalesLine.price1 ELSE TrnSalesLine.NetPrice END) ELSE 0 END) AS [VATSales],
	SUM( CASE WHEN(ISNULL([TrnSales].[IsCancelled],0) = 0 AND [TrnSalesLine].[TaxId]=2 AND [TrnSalesLine].DiscountId <> 3 AND  [TrnSalesLine].DiscountId <> 4) THEN ([TrnSalesLine].[Amount]) ELSE 0 END) AS [NonVATSales],
	0 AS [zerosale],

	SUM(ROUND(CASE WHEN([TrnSalesLine].[Price2]>0 AND ((ISNULL([TrnSales].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0))) THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))) ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] ELSE 0 END END,2)) AS [VATExemptSales]

	FROM [TrnSales]
    LEFT JOIN [TrnSalesLine] ON [TrnSalesLine].[SalesId] = [TrnSales].[Id]
	LEFT JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id] 
	WHERE 
	[TrnSales].[TerminalId] = ${Terminal}
	AND [TrnSales].[IsLocked] = 1 
	AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
	GROUP BY 
    [TrnSales].[TerminalId],
	[TrnSales].[SalesDate]
    `
}
