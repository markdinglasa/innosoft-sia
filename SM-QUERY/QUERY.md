SELECT 
    REPLACE([TrnSales].[SalesNumber], '-', '') AS [Order Num / Bill Num],
    CONVERT(varchar, [TrnSales].[SalesDate], 23) AS [Business Day],
    CONVERT(varchar, [TrnSales].[EntryDateTime], 21) AS [Check Open],
    CONVERT(varchar, [TrnSales].[UpdateDateTime], 21) AS [Check Close],
    COALESCE(NULLIF([MstTable].[TableCode], ''), 'Walk-In') AS [Transaction Type],
    SUM(COALESCE([GrossSales].[GrossSalesAmount], 0)) AS [Gross Sales Amount],
    SUM(COALESCE([TotalServiceCharge].[ServiceCharge], 0)) AS [Service Charge],
    SUM(COALESCE([TotalTax].[TotalTaxAmount], 0)) AS [Total Tax Amount],
    SUM(COALESCE([TotalDiscount].[TotalDiscountAmount], 0)) AS [Total Discount Amount]
FROM [TrnSales]
LEFT JOIN [TrnSalesLine] ON [TrnSalesLine].[SalesId] = [TrnSales].[Id]
LEFT JOIN [TrnCollection] ON [TrnSales].[Id] = [TrnCollection].[SalesId]
LEFT JOIN [TrnCollectionLine] ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
LEFT JOIN [MstTable] ON [TrnSales].[TableId] = [MstTable].[Id]
LEFT JOIN [MstTax] ON [MstTax].[Id] = [TrnSalesLine].[TaxId]
LEFT JOIN [MstItem] ON [MstItem].[Id] = [TrnSalesLine].[ItemId]
LEFT JOIN [MstPayType] ON [MstPayType].[Id] = [TrnCollectionLine].[PayTypeId]
LEFT JOIN [MstDiscount] ON [MstDiscount].[Id] = [TrnSalesLine].[DiscountId]
LEFT JOIN (
    SELECT [SalesId], SUM([Amount]) AS [GrossSalesAmount]
    FROM [TrnSalesLine]
    GROUP BY [SalesId]
) AS [GrossSales] ON [TrnSales].[Id] = [GrossSales].[SalesId]
LEFT JOIN (
    SELECT [SalesId], SUM([Amount]) AS [ServiceCharge]
    FROM [TrnSalesLine]
    WHERE [ItemId] = 1
    GROUP BY [SalesId]
) AS [TotalServiceCharge] ON [TrnSales].[Id] = [TotalServiceCharge].[SalesId]
LEFT JOIN (
    SELECT [SalesId], SUM([TaxAmount]) AS [TotalTaxAmount]
    FROM [TrnSalesLine]
    GROUP BY [SalesId]
) AS [TotalTax] ON [TrnSales].[Id] = [TotalTax].[SalesId]
LEFT JOIN (
    SELECT [SalesId], SUM(([DiscountAmount]) * ([Quantity])) AS [TotalDiscountAmount]
    FROM [TrnSalesLine]
    GROUP BY [SalesId]
) AS [TotalDiscount] ON [TrnSales].[Id] = [TotalDiscount].[SalesId]
LEFT JOIN (
    SELECT 
        [TrnSalesLine].[SalesId],
        SUM(CASE WHEN [TrnSalesLine].[ItemId] = 1 THEN 0 ELSE [TrnSalesLine].[Quantity] END) AS [Quantity],
        SUM([TrnSalesLine].[Amount]) AS [Amount],
        [PaxTable].[TotalPax],
        [PaxTable].[DiscountedPax]
    FROM [TrnSalesLine]
    INNER JOIN [PaxTable] ON [TrnSalesLine].[SalesId] = [PaxTable].[SalesId]
    GROUP BY [TrnSalesLine].[SalesId], [PaxTable].[TotalPax], [PaxTable].[DiscountedPax]
) AS [PAX] ON [TrnSales].[Id] = [PAX].[SalesId]
GROUP BY
    [TrnSales].[SalesNumber],
    [TrnSales].[SalesDate],
    [TrnSales].[EntryDateTime],
    [TrnSales].[UpdateDateTime],
    [MstTable].[TableCode]



## CREATE A LOADER THAT WOULD SET IT IN STORE 
TABLE NAME: ItemPurchase
QUERY:
    SELECT 
        TrnSalesLine.ItemId AS ItemId, 
        TrnSalesLine.SalesId AS SalesId, 
        TrnSalesLine.Price AS Price, 
        CASE 
            WHEN TrnSalesLine.ItemId = 1 THEN 0 
            ELSE TrnSalesLine.Quantity 
        END AS Quantity, 
        TrnSalesLine.Amount, 
        ${PaxTable.TotalPax}, 
        ${PaxTable.DiscountedPax}
    FROM 
        TrnSalesLine 

-- Create a temporary table to hold PaxTable data
CREATE TABLE #PaxTable (
    Id INT,
    SalesId INT,
    TotalPax INT,
    DiscountedPax INT
);

-- Insert data into the temporary table
INSERT INTO #PaxTable (Id, SalesId, TotalPax, DiscountedPax)
VALUES
    (7, 410, 1, 1),
    (8, 411, 1, 1),
    (9, 412, 2, 1),
    (10, 413, 1, 1);