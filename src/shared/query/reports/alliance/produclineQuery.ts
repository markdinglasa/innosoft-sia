export const AllianceProductLineQuery: Function = ({ Terminal, Dates, ReceiptNumber }): string => {
  return `
      SELECT 
      REPLACE([TrnCollection].[CollectionNumber], '-', '') AS [receiptno],
      REPLACE(ISNULL([MstItem].[BarCode],'NA'), '&', ' ') AS [sku],
      CAST(ROUND(ISNULL([TrnSalesLine].[Quantity], 0), 2) AS DECIMAL(10, 2)) AS [qty],
      CAST(ROUND(ISNULL([TrnSalesLine].[Price], 0), 2) AS DECIMAL(10, 2))  AS [unitprice],
      CAST(ROUND(ISNULL([TrnSalesLine].[DiscountAmount] * [TrnSalesLine].[Quantity], 0), 2) AS DECIMAL(10,2)) AS [disc],
      CAST(ROUND(CASE WHEN [MstDiscount].[Discount] = 'Senior Citizen Discount' THEN ISNULL([TrnSalesLine].[DiscountAmount] * [TrnSalesLine].[Quantity], 0) ELSE 0 END, 2) AS DECIMAL(10,2)) AS [senior],
      CAST(ROUND(CASE WHEN [MstDiscount].[Discount] = 'PWD' THEN ISNULL([TrnSalesLine].[DiscountAmount] * [TrnSalesLine].[Quantity], 0) ELSE 0 END, 2) AS DECIMAL(10,2)) AS [pwd],
      CAST(ROUND(CASE WHEN [MstDiscount].[Discount] = 'Diplomat Discount' THEN ISNULL([TrnSalesLine].[DiscountAmount] * [TrnSalesLine].[Quantity], 0) ELSE 0 END, 2) AS DECIMAL(10,2)) AS [diplomat],
      CAST(ROUND(CASE WHEN [MstDiscount].[Discount] LIKE '%National Athlete%' OR [MstDiscount].[Discount] LIKE '%Coach%' THEN ISNULL([TrnSalesLine].[DiscountAmount] * [TrnSalesLine].[Quantity], 0) ELSE 0 END, 2) AS DECIMAL(10,2)) AS [nac],
      CAST(ROUND(CASE WHEN [MstDiscount].[Discount] LIKE '%Solo Parent%' THEN ISNULL([TrnSalesLine].[DiscountAmount] * [TrnSalesLine].[Quantity], 0) ELSE 0 END, 2) AS DECIMAL(10,2)) AS [spd],
      0 AS [taxtype],
      CAST(ROUND(ISNULL([TrnSalesLine].[TaxAmount], 0), 2) AS DECIMAL(10, 2)) AS [tax],
      [TrnSales].[Remarks] AS [memo], 
      CAST(ROUND(([TrnSalesLine].[Quantity] * [TrnSalesLine].[Price]) - (ISNULL([TrnSalesLine].[DiscountAmount], 0) * [TrnSalesLine].[Quantity]), 2) AS DECIMAL(10,2)) AS [total]
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
      [TrnSales].[Remarks],
      [TrnSalesLine].[DiscountAmount],
      [MstDiscount].[Discount]
    `
}
