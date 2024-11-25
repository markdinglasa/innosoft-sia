export const SIATransactions = ({ Terminal, SMPOSSerialNumber }): string => {
  return `
        
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
               THEN CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
               ELSE CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
           END AS [VoidAmount],
           CASE 
               WHEN [TrnCollection].[IsReturn] = 2 
               THEN 1 
               ELSE 0 
           END AS [Refund],
           CASE 
               WHEN [TrnCollection].[IsReturn] = 2 
               THEN CAST(ROUND(COALESCE([TrnCollection].[Amount], 0), 2) AS DECIMAL(10, 2)) 
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
           END AS [RefundAmount],
           MAX(
            CASE
                WHEN [TrnSales].[Pax] <> 0 OR [TrnSales].[Pax] IS NOT NULL
                THEN COALESCE(CONVERT(VARCHAR(20), ([TrnPaxTable].[TotalPax]), 1), '0')
                ELSE '0'
            END
        ) AS [GuestCount],
        MAX(
            CASE
                WHEN [TrnSalesLine].[DiscountId] = [MstDiscount].[Id] AND [MstDiscount].[Discount] = 'Senior Citizen Discount'
                THEN COALESCE(CONVERT(VARCHAR(20), ([TrnPaxTable].[DiscountedPax]), 1), '0')
                ELSE '0'
            END
        ) AS [GuestCountSenior],
        MAX(
            CASE
                WHEN [TrnSalesLine].[DiscountId] = [MstDiscount].[Id] AND [MstDiscount].[Discount] = 'PWD'
                THEN COALESCE(CONVERT(VARCHAR(20), ([TrnPaxTable].[DiscountedPax]), 1), '0')
                ELSE '0'
            END
        ) AS [GuestCountPWD],
           CASE 
               WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
               THEN CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
           END AS [GrossSalesAmount],
           CASE 
               WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
               THEN CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount], 0), 2) AS DECIMAL(10, 2)) 
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
           END AS [NetSalesAmount],
           CASE
               WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
               THEN    CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
               ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
           END AS [TotalTax],
           CASE
               WHEN    [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax]  = 'LOCAL TAX'
               THEN    CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
               ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
           END AS [OtherLocalTax],
           MAX(
               CASE
                   WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
                   THEN    CAST(ROUND(COALESCE([TotalServiceCharge].[ServiceCharge], 0), 2) AS DECIMAL(10, 2)) 
                   ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
               END
           ) AS [TotalServiceCharge],
           '0.00' AS [TotalTip],
           CASE
                WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
                THEN    CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
                ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
           END AS [TotalDiscount],
           CASE
               WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
               THEN    CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] - [TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
               ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
           END AS [LessTaxAmount],
           MAX(
               CASE 
                   WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL AND ([MstDiscount].[Discount] = 'Senior Citizen Discount' OR [MstDiscount].[Discount] = 'PWD Discount')
                   THEN CAST(ROUND(COALESCE((((([GrossSales].[TotalAmount]/[TrnPaxTable].[TotalPax])*[TrnPaxTable].[DiscountedPax])/1.12) - ((((([GrossSales].[TotalAmount]/[TrnPaxTable].[TotalPax])*[TrnPaxTable].[DiscountedPax])/1.12))*0.2)), 0), 2) AS DECIMAL(10, 2)) 
                   ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
               END
           ) AS [TotalExemptSales],
           MAX(
               CASE
                   WHEN ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL)
                       AND [MstDiscount].[Discount] NOT IN (
                           'SMAC Discount', 'SMAC', 'Zero Discount',
                           'Employee Discount', 'Employee Meal',
                           'Senior Citizen Discount',
                           'PWD Discount', 'PWD',
                           'VIP Discount',
                           'National Coach', 'National Athlete', 'Medal of Valor Discount'
                       )
                   THEN COALESCE([MstDiscount].[Discount], 'N/A')
                   ELSE 'N/A'
               END
           ) AS [RegularOtherDiscountName],
           MAX(
               CASE
                   WHEN ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL)
                       AND [MstDiscount].[Discount] NOT IN (
                           'SMAC Discount', 'SMAC', 'Zero Discount',
                           'Employee Discount', 'Employee Meal',
                           'Senior Citizen Discount',
                           'PWD Discount', 'PWD',
                           'VIP Discount',
                           'National Coach', 'National Athlete', 'Medal of Valor Discount'
                       )
                   THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
                   ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
               END
           ) AS [RegularOtherDiscountAmount],
           MAX(
               CASE
                   WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'Employee Discount' OR [MstDiscount].[Discount] = 'Employee Meal')
                   THEN    CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
                   ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
               END 
           ) AS [EmployeeDiscountAmount],
           MAX(
               CASE
                   WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'Senior Citizen Discount')
                   THEN    CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
                   ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
               END 
           ) AS [SeniorCitizenDiscountAmount],
           MAX(
               CASE
                   WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'VIP Discount')
                   THEN    CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
                   ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END
           ) AS [VIPDiscountAmount],
           MAX(
               CASE
                   WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'PWD')
                   THEN    CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
                   ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END 
           ) AS [PWDDiscountAmount],
           MAX(
               CASE
                   WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'National Coach' OR [MstDiscount].[Discount] = 'National Athlete' OR [MstDiscount].[Discount] = 'Medal of Valor Discount')
                   THEN    CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
                   ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END 
           ) AS [NationalCoachAthleteMedalofValorDiscountamount],
           MAX(
               CASE
                   WHEN    ([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([MstDiscount].[Discount] = 'SMAC Discount' OR [MstDiscount].[Discount] = 'SMAC')
                   THEN    CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
                   ELSE    CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END 
           ) AS [SMACDiscountAmount],
           ' ' AS [OnlineDealsDiscountName],
           '0.00' AS [OnlineDealsDiscountAmount],
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
                   THEN	CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                   ELSE	CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END
           ) AS [TotalCashSalesAmount],
           MAX(
               CASE
                   WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gift Certificate')
                   THEN	CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                   ELSE	CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END
           ) AS [TotalGiftCertificateSalesAmount],
           MAX(
               CASE
                   WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gcash' OR [MstPayType].[PayType] = 'PayMaya' OR [MstPayType].[PayType] = 'GrabPay' OR [MstPayType].[PayType] = 'FoodPanda')
                   THEN	CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                   ELSE	CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END
           ) AS [TotalEwalletOnlineSalesAmount],
           MAX(
               CASE
                    WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Mastercard')
                    THEN CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                    ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END
           ) AS [TotalMastercardSalesAmount],
           MAX(
               CASE
                   WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Visa')
                   THEN	CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                   ELSE	CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END
           ) AS [TotalVisaSalesAmount],
           MAX(
               CASE
                   WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Diners')
                   THEN	CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                   ELSE	CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END
           ) AS [TotalDinersSalesAmount],
           MAX(
               CASE
                   WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'JCB')
                   THEN	CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                   ELSE	CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               END
           ) AS [TotalJCBSalesAmount],
           MAX(
               CASE
                   WHEN	([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) AND ([TrnCollectionLine].[Amount] > 0 OR [TrnCollectionLine].[Amount] IS NOT NULL) AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Credit Card')
                   THEN	CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                   ELSE	CAST(ROUND(0, 2) AS DECIMAL(10, 2))
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
               LEFT JOIN [TrnPaxTable] ON [TrnPaxTable].[SaleId] = [TrnSalesLine].[SalesId]
               LEFT JOIN (
                   SELECT [SalesId], SUM([Amount]) AS [GrossSalesAmount],
                   SUM([Price]*[Quantity]) AS [TotalAmount]
   
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
                   [TrnPaxTable].[TotalPax],
                   [TrnPaxTable].[DiscountedPax]
               FROM [TrnSalesLine]
               INNER JOIN [TrnPaxTable] ON [TrnSalesLine].[SalesId] = [TrnPaxTable].[SaleId]
               GROUP BY [TrnSalesLine].[SalesId], [TrnPaxTable].[TotalPax], [TrnPaxTable].[DiscountedPax]
               ) AS [PAX] ON [TrnSales].[Id] = [PAX].[SalesId]
           WHERE [TrnSales].[TerminalId] = ${Terminal} AND [TrnSales].[IsLocked] = 1 AND MONTH([TrnSales].[EntryDateTime]) = MONTH(GETDATE()) AND YEAR([TrnSales].[EntryDateTime]) = YEAR(GETDATE())
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
               THEN CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
           END,
           CASE 
               WHEN [TrnCollection].[IsReturn] = 2 
               THEN 1 
               ELSE 0 
           END,
           CASE 
               WHEN [TrnCollection].[IsReturn] = 2 
               THEN CAST(ROUND(COALESCE([TrnCollection].[Amount], 0), 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
           END,
           CASE 
               WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
               THEN CAST(ROUND(COALESCE(([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount]), 0), 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
           END,
           CASE 
               WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
               THEN CAST(ROUND(COALESCE(([GrossSales].[GrossSalesAmount]), 0), 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
           END,
           CASE
               WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
               THEN CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
           END,
           CASE
               WHEN [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax]  = 'LOCAL TAX'
               THEN CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
           END,
           CASE 
               WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL 
               THEN CAST(ROUND(COALESCE(([GrossSales].[GrossSalesAmount]/ 1.12), 0), 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
           END,
           CASE
               WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
               THEN CAST(ROUND(COALESCE(([TotalDiscount].[TotalDiscountAmount]), 0), 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
           END,
           CASE
               WHEN    [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL
               THEN CAST(ROUND(COALESCE(([GrossSales].[GrossSalesAmount] - [TotalTax].[TotalTaxAmount]), 0), 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
           END
       `
}
