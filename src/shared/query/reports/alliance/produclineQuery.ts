export const AllianceProductLineQuery: Function = ({ Terminal, Dates, ReceiptNumber }): string => {
  return `
      SELECT 
      REPLACE([TrnCollection].[CollectionNumber], '-', '') AS [receiptno],
      ISNULL([MstItem].[BarCode],'NA') AS [sku],
      CAST(ROUND(ISNULL([TrnSalesLine].[Quantity], 0), 2) AS DECIMAL(10, 2)) AS [qty],
      CAST(ROUND(ISNULL([TrnSalesLine].[Price], 0), 2) AS DECIMAL(10, 2))  AS [unitprice],
      0 AS [disc],
      0 AS [senior],
      0 AS [pwd],
      0 AS [diplomat],
      0 AS [taxtype],
      CAST(ROUND(ISNULL([TrnSalesLine].[TaxAmount], 0), 2) AS DECIMAL(10, 2)) AS [tax],
      [TrnSales].[Remarks] AS [memo], 
      SUM(CASE WHEN (TrnSalesLine.TaxAmount < 1) THEN  [TrnSalesLine].[Quantity] * [TrnSalesLine].[Price2LessTax] ELSE [TrnSalesLine].[Quantity] * [TrnSalesLine].[Price] END)  AS [total]
      FROM [TrnSales]
      LEFT JOIN [TrnSalesLine] ON [TrnSalesLine].[SalesId] = [TrnSales].[Id]
        LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSales].[Id]
      LEFT JOIN [MstItem] ON [MstItem].[Id] = [TrnSalesLine].[ItemId] AND [TrnSalesLine].[ItemId] <> 1
      LEFT JOIN [MstItemGroupItem] ON [MstItemGroupItem].[ItemId] = [TrnSalesLine].[ItemId]
      LEFT JOIN [MstItemGroup] ON [MstItemGroup].[Id] = [MstItemGroupItem].[ItemGroupId]
      LEFT JOIN [MstDiscount] ON [MstDiscount].[Id] = [TrnSalesLine].[DiscountId]
      WHERE 
          [TrnSales].[TerminalId] = ${Terminal} 
          AND [TrnSales].[IsLocked] = 1 
          AND ISNULL([TrnSales].[IsCancelled],0) = 0 
          AND ISNULL([TrnSales].[IsReturn],0) = 0 
          AND REPLACE([TrnCollection].[CollectionNumber], '-', '') = '${ReceiptNumber}'
          AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
      GROUP BY 
      [TrnSales].[Id],
      [TrnCollection].[CollectionNumber],
      [MstItem].[BarCode],
      [TrnSalesLine].[Quantity],
      [TrnSalesLine].[Price],
      [TrnSalesLine].[TaxAmount],
      [TrnSales].[Remarks]
    `
}
