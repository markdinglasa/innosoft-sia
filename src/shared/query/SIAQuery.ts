
export const SIA_QUERY = ({Terminal, SMPOSSerialNumber}): string => {
 return (`
    SELECT 
        REPLACE([TrnSales].[SalesNumber], '-', '') AS [OrderNumber],
        CONVERT(varchar, [TrnSales].[SalesDate], 23) AS [BusinessDay],
        CONVERT(varchar, [TrnSales].[EntryDateTime], 21) AS [CheckOpen],
        CONVERT(varchar, [TrnSales].[UpdateDateTime], 21) AS [CheckClose],
        COALESCE(NULLIF([MstTable].[TableCode], ''), 'Walk-In') AS [TransactionType],

        CASE 
            WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
            THEN 0 
            ELSE 1 
        END AS [Void],

        CASE 
            WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
            THEN '0.00'
            ELSE COALESCE(CONVERT(VARCHAR(20), ([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount]), 1), '0.00')
        END AS [VoidAmount],

        CASE 
            WHEN [TrnCollection].[IsReturn] = 2 
            THEN 1 
            ELSE 0 
        END AS [Refund],
        CASE 
            WHEN [TrnCollection].[IsReturn] = 2 
            THEN COALESCE(CONVERT(VARCHAR(20), ([TrnCollection].[Amount]), 1), '0.00')
            ELSE '0.00'
        END AS [RefundAmount],

        MAX(
            CASE
                WHEN [TrnSalesLine].[DiscountId] = [MstDiscount].[Id] AND [MstDiscount].[Discount] = 'Senior Citizen Discount'
                THEN COALESCE(CONVERT(VARCHAR(20), ([PaxTable].[DiscountedPax]), 1), '0.00')
                ELSE '0.00'
            END
        ) AS [GuestCountSenior],

        MAX(
            CASE
                WHEN [TrnSalesLine].[DiscountId] = [MstDiscount].[Id] AND [MstDiscount].[Discount] = 'PWD'
                THEN COALESCE(CONVERT(VARCHAR(20), ([PaxTable].[DiscountedPax]), 1), '0.00')
                ELSE '0.00'
            END
        ) AS [GuestCountPWD],

        CASE 
            WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
            THEN COALESCE(CONVERT(VARCHAR(20), ([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount]), 1), '0.00')
            ELSE '0.00'
        END AS [GrossSalesAmount],

        CASE 
            WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
            THEN COALESCE(CONVERT(VARCHAR(20), (([GrossSales].[GrossSalesAmount])), 1), '0.00')
            ELSE '0.00'
        END AS [NetSalesAmount],

        CASE
            WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
            THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalTax].[TotalTaxAmount])), 1), '0.00')
            ELSE    '0.00'
        END AS [TotalTax],

        CASE
            WHEN    [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax]  = 'LOCAL TAX'
            THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalTax].[TotalTaxAmount])), 1), '0.00')
            ELSE    '0.00'
        END AS [OtherLocalTax],
        MAX(
            CASE
                WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
                THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalServiceCharge].[ServiceCharge])), 1), '0.00')
                ELSE    '0.00'
            END
        ) AS [TotalServiceCharge],
        '0.00' AS [TotalTip],
        
        CASE
            WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
            THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
            ELSE    '0.00'
        END AS [TotalDiscount],
        CASE
            WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
            THEN    COALESCE(CONVERT(VARCHAR(20), (([GrossSales].[GrossSalesAmount] - [TotalTax].[TotalTaxAmount])), 1), '0.00')
            ELSE    '0.00'
        END AS [LessTaxAmount],
        MAX(
            CASE
                WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'Employee Discount' OR [MstDiscount].[Discount] = 'Employee Meal')
                THEN    COALESCE(CONVERT(VARCHAR(20), (([TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
                ELSE    '0.00'
            END 
        ) AS [EmployeeDiscountAmount],
        MAX(
            CASE
                WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'VIP Discount')
                THEN    COALESCE(CONVERT(VARCHAR, (([TotalDiscount].[TotalDiscountAmount])), 1), '0.00')
                ELSE    '0.00'
            END
        ) AS [VIPDiscountAmount],
        ' ' AS [DiscountField1Name], 
        ' ' AS [DiscountField2Name], 
        ' ' AS [DiscountField3Name], 
        ' ' AS [DiscountField4Name], 
        ' ' AS [DiscountField5Name], 
        ' ' AS [DiscountField6Name], 
        '0.00'  AS [DiscountField1Amount], 
        '0.00'  AS [DiscountField2Amount], 
        '0.00'  AS [DiscountField3Amount], 
        '0.00'  AS [DiscountField4Amount], 
        '0.00'  AS [DiscountField5Amount], 
        '0.00'  AS [DiscountField6Amount],
        
        MAX(
            CASE
                WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Cash')
                THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
                ELSE	'0.00'
            END
        ) AS [TotalCashSalesAmount],
        MAX(
            CASE
                WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gift Certificate')
                THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
                ELSE	'0.00'
            END
        ) AS [TotalGiftCertificateSalesAmount],
        MAX(
            CASE
                WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gcash' OR [MstPayType].[PayType] = 'PayMaya' OR [MstPayType].[PayType] = 'GrabPay' OR [MstPayType].[PayType] = 'FoodPanda')
                THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
                ELSE	'0.00'
            END
        ) AS [TotalEwalletOnlineSalesAmount],
        MAX(
            CASE
                WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Mastercard')
                THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
                ELSE	'0.00'
            END
        ) AS [TotalMastercardSalesAmount],
        MAX(
            CASE
                WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Visa')
                THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
                ELSE	'0.00'
            END
        ) AS [TotalVisaSalesAmount],
        MAX(
            CASE
                WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Diners')
                THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
                ELSE	'0.00'
            END
        ) AS [TotalDinersSalesAmount],
        MAX(
            CASE
                WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'JCB')
                THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
                ELSE	'0.00'
            END
        ) AS [TotalJCBSalesAmount],
        MAX(
            CASE
                WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Credit Card')
                THEN	COALESCE(CONVERT(VARCHAR(20), (([TrnCollectionLine].[Amount])), 1), '0.00')
                ELSE	'0.00'
            END
        ) AS [TotalCreditCardSalesAmount],
        '${Terminal}' AS [TerminalNumber],
        '${SMPOSSerialNumber}' AS [SMPOSSerialNumber]
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
        WHERE [TrnSales].[TerminalId] = ${parseInt(Terminal, 10)} AND MONTH([TrnSales].[EntryDateTime]) = MONTH(GETDATE()) AND YEAR([TrnSales].[EntryDateTime]) = YEAR(GETDATE())
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
    `)
}
