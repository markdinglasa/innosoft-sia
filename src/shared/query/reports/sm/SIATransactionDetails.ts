export const SIATransactionDetailQuery = ({ Terminal, Dates }): string => {
  return `
   	SELECT 
    REPLACE([TrnSales].[SalesNumber], '-', '') AS [OrderNumber],
    ISNULL([MstItem].[BarCode],'NA') AS [ItemId],
    ISNULL([MstItem].[Alias],'NA') AS [ItemName],
    ISNULL([MstItemGroup].[ItemGroup],'NA') AS [ItemParentCategory],
    ISNULL([MstItem].[Category],'NA') AS [ItemCategory],
    'NA' AS [ItemSubCategory],
	CASE 
		WHEN [MstItem].[Id] = 1 
		THEN CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
		ELSE CAST(ROUND(ISNULL([TrnSalesLine].[Quantity], 0), 2) AS DECIMAL(10, 2)) 
	END AS [ItemQuantity],
    CASE 
		WHEN [TrnSales].[IsCancelled] = 1 OR [TrnSales].[IsReturn] = 2 
		THEN CAST(ROUND(0, 2) AS DECIMAL(10, 2))
		ELSE  CAST(ROUND(ISNULL([TrnSalesLine].[Amount], 0), 2) AS DECIMAL(10, 2)) 
	END AS [TransactionItemPrice],
    CAST(ROUND(ISNULL([TrnSalesLine].[Price], 0), 2) AS DECIMAL(10, 2))  AS [MenuItemPrice],
    CASE 
		WHEN [TrnSales].[IsCancelled] = 1 OR [TrnSales].[IsReturn] = 2 
		THEN 'NA' 
		ELSE ISNULL([MstDiscount].[Discount],'NA') 
	END AS [DiscountCode],
    CASE 
		WHEN [TrnSales].[IsCancelled] = 1 OR [TrnSales].[IsReturn] = 2 
		THEN CAST(ROUND(0, 2) AS DECIMAL(10, 2))
		ELSE  CAST(ROUND(ISNULL([TrnSalesLine].[DiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
	END AS [DiscountAmount],
    CASE 
		WHEN [MstItemGroup].[Id] = 8 
		THEN ISNULL([MstItemGroup].[ItemGroup],'NA') 
		ELSE 'NA' END 
	AS [Modifier1Name],
    CASE 
		WHEN [MstItemGroup].[Id] = 8 
		THEN CAST(ROUND(ISNULL([TrnSalesLine].[Quantity], 0), 2) AS DECIMAL(10, 2))
		ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
	END AS [Modifier1Quantity],
    'NA' [Modifier2Name],
    0 [Modifier2Quantity],
    CASE WHEN [TrnSales].[IsCancelled] = 1 THEN 1 ELSE 0 END AS [Void],
    CASE WHEN [TrnSales].[IsCancelled] = 1
		THEN CAST(ROUND(ISNULL([TrnSalesLine].[Amount], 0), 2) AS DECIMAL(10, 2)) 
		ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
	END AS [VoidAmount],
    CASE WHEN [TrnSales].[IsReturn] = 2 THEN 1 ELSE 0 END AS [Refund],
    CASE 
		WHEN [TrnSales].[IsReturn] = 2 
		THEN CAST(ROUND(ISNULL([TrnSalesLine].[Amount], 0), 2) AS DECIMAL(10, 2))
		ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
	END AS [RefundAmount]
    FROM [TrnSales]
    LEFT JOIN [TrnSalesLine] ON [TrnSalesLine].[SalesId] = [TrnSales].[Id]
    LEFT JOIN [MstItem] ON [MstItem].[Id] = [TrnSalesLine].[ItemId] AND [TrnSalesLine].[ItemId] <> 1
    LEFT JOIN [MstItemGroupItem] ON [MstItemGroupItem].[ItemId] = [TrnSalesLine].[ItemId]
    LEFT JOIN [MstItemGroup] ON [MstItemGroup].[Id] = [MstItemGroupItem].[ItemGroupId]
    LEFT JOIN [MstDiscount] ON [MstDiscount].[Id] = [TrnSalesLine].[DiscountId]
    WHERE [TrnSales].[TerminalId] = ${Terminal} 
	AND [TrnSales].[IsLocked] = 1 

	AND MONTH(CAST([TrnSales].[SalesDate] AS DATE)) = MONTH('${Dates}')
	AND YEAR(CAST([TrnSales].[SalesDate] AS DATE)) = YEAR('${Dates}')`
}
