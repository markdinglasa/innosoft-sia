export const AllianceProductsQuery = ({ Terminal, Dates }) => {
  return `
     SELECT 
      ISNULL([MstItem].[BarCode],'NA') AS [sku],
      ISNULL([MstItem].[Alias],'NA') AS [name],
      CASE WHEN(ISNULL([MstItem].[IsInventory],0) = 0) THEN 0 ELSE 1 END AS [inventory],
      ISNULL([MstItem].[Price],0) AS [price],
      '01' AS [category]
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
          AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
      GROUP BY 
      [MstItem].[Id],
      [MstItem].[Alias],
      [MstItem].[BarCode],
      [MstItem].[IsInventory],
      [MstItem].[Price]
    `
}
