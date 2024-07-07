export const SM_QUERY = `
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
		THEN '0.00'
		ELSE COALESCE(CONVERT(VARCHAR(20), ([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount]), 1), '0.00')
	END AS [Void Amount],
	CASE 
        WHEN [TrnCollection].[IsReturn] = 2 
        THEN 1 
        ELSE 0 
    END AS [Refund],
    CASE 
        WHEN [TrnCollection].[IsReturn] = 2 
        THEN COALESCE(CONVERT(VARCHAR(20), ([TrnCollection].[Amount]), 1), '0.00')
        ELSE '0.00'
    END AS [Refund Amount],
    MAX(
		CASE
			WHEN [TrnSalesLine].[DiscountId] = [MstDiscount].[Id] AND [MstDiscount].[Discount] = 'Senior Citizen Discount'
			THEN COALESCE(CONVERT(VARCHAR(20), ([PaxTable].[DiscountedPax]), 1), '0.00')
			ELSE '0.00'
		END
    ) AS [Guest Count (Senior)],
    MAX(
        CASE
            WHEN [TrnSalesLine].[DiscountId] = [MstDiscount].[Id] AND [MstDiscount].[Discount] = 'PWD'
            THEN COALESCE(CONVERT(VARCHAR(20), ([PaxTable].[DiscountedPax]), 1), '0.00')
            ELSE '0.00'
        END
    ) AS [Guest Count (PWD)],
    CASE 
        WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
        THEN COALESCE(CONVERT(VARCHAR(20), ([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount]), 1), '0.00')
        ELSE '0.00'
    END AS [Gross Sales Amount],
    CASE 
        WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
        THEN COALESCE(CONVERT(VARCHAR(20), (([GrossSales].[GrossSalesAmount])), 1), '0.00')
        ELSE '0.00'
    END AS [Net Sales Amount],
    CASE
        WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
        THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalTax].[TotalTaxAmount])), 1), '0.00')
        ELSE    '0.00'
    END AS [Total Tax],
    CASE
        WHEN    [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax]  = 'LOCAL TAX'
        THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalTax].[TotalTaxAmount])), 1), '0.00')
        ELSE    '0.00'
    END AS [Other / Local Tax],
    MAX(
        CASE
            WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
            THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalServiceCharge].[ServiceCharge])), 1), '0.00')
            ELSE    '0.00'
        END
    ) AS [Total Service Charge],
    '0.00' AS [Total Tip],
    
    CASE
        WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
        THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
        ELSE    '0.00'
    END AS [Total Discount],
    CASE
        WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
        THEN    COALESCE(CONVERT(VARCHAR(20), (([GrossSales].[GrossSalesAmount] - [TotalTax].[TotalTaxAmount])), 1), '0.00')
        ELSE    '0.00'
    END AS [Less Tax Amount],
    MAX(
        CASE
            WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'Employee Discount' OR [MstDiscount].[Discount] = 'Employee Meal')
            THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
            ELSE    '0.00'
        END 
    ) AS [Employee Discount Amount],
    MAX(
        CASE
            WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'VIP Discount')
            THEN    COALESCE(CONVERT(VARCHAR, (([TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
            ELSE    '0.00'
        END
    ) AS [VIP Discount Amount],
    ' ' AS [Discount Field 1 Name], 
    ' ' AS [Discount Field 2 Name], 
    ' ' AS [Discount Field 3 Name], 
    ' ' AS [Discount Field 4 Name], 
    ' ' AS [Discount Field 5 Name], 
    ' ' AS [Discount Field 6 Name], 
    '0.00'  AS [Discount Field 1 Amount], 
    '0.00'  AS [Discount Field 2 Amount], 
    '0.00'  AS [Discount Field 3 Amount], 
    '0.00'  AS [Discount Field 4 Amount], 
    '0.00'  AS [Discount Field 5 Amount], 
    '0.00'  AS [Discount Field 6 Amount],
    
    MAX(
		CASE
			WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Cash')
			THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
			ELSE	'0.00'
		END
	) AS [Total Cash Sales Amount],
	MAX(
		CASE
			WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gift Certificate')
			THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
			ELSE	'0.00'
		END
	) AS [Total Gift Certificate Sales Amount],
	MAX(
		CASE
			WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gcash' OR [MstPayType].[PayType] = 'PayMaya' OR [MstPayType].[PayType] = 'GrabPay' OR [MstPayType].[PayType] = 'FoodPanda')
			THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
			ELSE	'0.00'
		END
	) AS [Total E-wallet / Online Sales Amount],
	MAX(
		CASE
			WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Mastercard')
			THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
			ELSE	'0.00'
		END
	) AS [Total Mastercard Sales Amount],
	MAX(
		CASE
			WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Visa')
			THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
			ELSE	'0.00'
		END
	) AS [Total Visa Sales Amount],
	MAX(
		CASE
			WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Diners')
			THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
			ELSE	'0.00'
		END
	) AS [Total Diners Sales Amount],
	MAX(
		CASE
			WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'JCB')
			THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
			ELSE	'0.00'
		END
	) AS [Total JCB Sales Amount],
	MAX(
		CASE
			WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Credit Card')
			THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
			ELSE	'0.00'
		END
	) AS [Total Credit Card Sales Amount],
	'tmp-1' AS [Terminal Number],
	'tmp-001888599' AS [SMPOSSerialNumber]
    FROM [TrnSales]
        LEFT JOIN [TrnSalesLine] ON [TrnSalesLine].[SalesId] = [TrnSales].[Id]
        LEFT JOIN [TrnCollection] ON [TrnSales].[Id] = [TrnCollection].[SalesId]
        LEFT JOIN [TrnCollectionLine] ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
        LEFT JOIN [MstTable] ON [TrnSales].[TableId] = [MstTable].[Id]
        LEFT JOIN [MstTax] ON [MstTax].[Id] = [TrnSalesLine].[TaxId]
        LEFT JOIN [MstItem] ON [MstItem].[Id] = [TrnSalesLine].[ItemId]
        LEFT JOIN [MstPayType] ON [MstPayType].[Id] = [TrnCollectionLine].[PayTypeId]
        LEFT JOIN [MstDiscount] ON [MstDiscount].[Id] = [TrnSalesLine].[DiscountId]
        LEFT JOIN [PaxTable] ON [PaxTable].[SalesId] = [TrnSalesLine].[SalesId]
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
	WHERE MONTH([TrnSales].[EntryDateTime]) = MONTH(GETDATE()) AND YEAR([TrnSales].[EntryDateTime]) = YEAR(GETDATE())
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
		THEN '0.00'
		ELSE COALESCE(CONVERT(VARCHAR(20), ([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount]), 1), '0.00')
	END,
	CASE 
        WHEN [TrnCollection].[IsReturn] = 2 
        THEN 1 
        ELSE 0 
    END,
    CASE 
        WHEN [TrnCollection].[IsReturn] = 2 
        THEN COALESCE(CONVERT(VARCHAR(20), ([TrnCollection].[Amount]), 1), '0.00')
        ELSE '0.00'
    END,
    CASE 
        WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
        THEN COALESCE(CONVERT(VARCHAR(20), ([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount]), 1), '0.00')
        ELSE '0.00'
    END,
    CASE 
        WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
        THEN COALESCE(CONVERT(VARCHAR(20), (([GrossSales].[GrossSalesAmount])), 1), '0.00')
        ELSE '0.00'
    END,
    CASE
        WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
        THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalTax].[TotalTaxAmount])), 1), '0.00')
        ELSE    '0.00'
    END,
    CASE
        WHEN    [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax]  = 'LOCAL TAX'
        THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalTax].[TotalTaxAmount])), 1), '0.00')
        ELSE    '0.00'
    END,
    CASE
        WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
        THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
        ELSE    '0.00'
    END,
    CASE
        WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
        THEN    COALESCE(CONVERT(VARCHAR(20), (([GrossSales].[GrossSalesAmount] - [TotalTax].[TotalTaxAmount])), 1), '0.00')
        ELSE    '0.00'
    END
`
