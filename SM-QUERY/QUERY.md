SELECT
REPLACE([TrnSales].[SalesNumber], '-', '') AS [Order Num / Bill Num],
CONVERT(varchar, [TrnSales].[SalesDate], 23) AS [Business Day],
CONVERT(varchar, [TrnSales].[EntryDateTime], 21) AS [Check Open],
CONVERT(varchar, [TrnSales].[UpdateDateTime], 21) AS [Check Close],
COALESCE(NULLIF([MstTable].[TableCode], ''), 'Walk-In') AS [Transaction Type],
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN 0
ELSE 1
END AS [Void],
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN CONVERT(VARCHAR, 0.00, 1)
ELSE CONVERT(varchar, (([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount])), 1)
END AS [Void Amount],
CASE
WHEN [TrnCollection].[IsReturn] = 2
THEN 1
ELSE 0
END AS [Refund],
CASE
WHEN [TrnCollection].[IsReturn] = 2
THEN COALESCE(CONVERT(VARCHAR, (([TrnCollection].[Amount])), 1), 0.00)
ELSE CONVERT(VARCHAR, 0.00, 1)
END AS [Refund Amount],
MAX(
CASE
WHEN [TrnSalesLine].[DiscountId] = [MstDiscount].[Id] AND [MstDiscount].[Discount] = 'Senior Citizen Discount'
THEN 1
ELSE 0.00
END
) AS [Guest Count (Senior)],
MAX(
CASE
WHEN [TrnSalesLine].[DiscountId] = [MstDiscount].[Id] AND [MstDiscount].[Discount] = 'PWD'
THEN 1
ELSE 0.00
END
) AS [Guest Count (PWD)],
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END AS [Gross Sales Amount],
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([GrossSales].[GrossSalesAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END AS [Net Sales Amount],
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([TotalTax].[TotalTaxAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END AS [Total Tax],
CASE
WHEN [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax] = 'LOCAL TAX'
THEN COALESCE(CONVERT(VARCHAR, (([TotalTax].[TotalTaxAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END AS [Other / Local Tax],
MAX(
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([TotalServiceCharge].[ServiceCharge])), 1), 0.00)
ELSE CONVERT(VARCHAR, 0.00, 1)
END
) AS [Total Service Charge],
MAX(
COALESCE(CONVERT(VARCHAR, ((0)), 1), 0.00)
) AS [Total Tip],
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END AS [Total Discount],
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([GrossSales].[GrossSalesAmount] - [TotalTax].[TotalTaxAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END AS [Less Tax Amount],
MAX(
CASE
WHEN ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'Employee Discount' OR [MstDiscount].[Discount] = 'Employee Meal')
THEN COALESCE(CONVERT(VARCHAR, (([TotalDiscount].[TotalDiscountAmount])), 1), 0.00)
ELSE CONVERT(VARCHAR, 0.00, 1)
END
) AS [Employee Discount Amount]

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
SELECT [SalesId], SUM(([DiscountAmount]) \* ([Quantity])) AS [TotalDiscountAmount]
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
[MstTable].[TableCode],
[TrnCollection].[IsCancelled],
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN 0
ELSE 1
END,
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN CONVERT(VARCHAR, 0.00, 1)
ELSE CONVERT(varchar, (([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount])), 1)
END,
CASE
WHEN [TrnCollection].[IsReturn] = 2
THEN 1
ELSE 0
END,
CASE
WHEN [TrnCollection].[IsReturn] = 2
THEN COALESCE(CONVERT(VARCHAR, (([TrnCollection].[Amount])), 1), 0.00)
ELSE CONVERT(VARCHAR, 0.00, 1)
END,
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END,
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([GrossSales].[GrossSalesAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END,
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([TotalTax].[TotalTaxAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END,
CASE
WHEN [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax] = 'LOCAL TAX'
THEN COALESCE(CONVERT(VARCHAR, (([TotalTax].[TotalTaxAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END,
CASE
WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
THEN COALESCE(CONVERT(VARCHAR, (([TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
ELSE CONVERT(VARCHAR, 0.00, 1)
END,

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

---Check if IsReturn field in TrnCollection exists

ALTER TABLE [TrnCollection]
ADD [IsReturn] INT NULL;
