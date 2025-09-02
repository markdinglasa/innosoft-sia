export const SIATransactions = ({ Terminal, POSSerialNumber, SalesType, Dates }): string => {
  return `
	WITH AggregatedPayments AS (
        SELECT 
            [TrnSales].[SalesNumber],
            [MstPayType].[PayType],
            [TrnCollectionLine].[Amount] AS [Amount],
            ROW_NUMBER() OVER (
                PARTITION BY [TrnSales].[SalesNumber]
                ORDER BY [TrnCollectionLine].[Amount] DESC
            ) AS PaymentRank
        FROM [TrnSales]
        LEFT JOIN [TrnCollection] ON [TrnSales].[Id] = [TrnCollection].[SalesId]
        LEFT JOIN [TrnCollectionLine] ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
        LEFT JOIN [MstPayType] ON [MstPayType].[Id] = [TrnCollectionLine].[PayTypeId]
           WHERE [TrnSales].[TerminalId] = ${Terminal}
            AND [TrnSales].[IsLocked] = 1
            AND MONTH(CAST([TrnSales].[SalesDate] AS DATE)) = MONTH('${Dates}')
			AND YEAR(CAST([TrnSales].[SalesDate] AS DATE)) = YEAR('${Dates}')
            AND ISNULL([TrnCollection].[IsCancelled], 0) = 0
            AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
    )
    SELECT 
        REPLACE([TrnSales].[SalesNumber], '-', '') AS [OrderNumber],
        CONVERT(varchar, [TrnSales].[SalesDate], 23) AS [BusinessDay],
        MIN((CONVERT(varchar, [TrnSales].[SalesDate], 23)+' '+CONVERT(varchar,[TrnSales].[EntryDateTime], 8))) AS [CheckOpen],
        MAX((CONVERT(varchar, [TrnSales].[SalesDate], 23)+' '+CONVERT(varchar, [TrnSales].[UpdateDateTime], 8))) AS [CheckClose],
        '${SalesType}' AS [SalesType],
        MAX(CASE WHEN ISNULL([MstTable].[TableCode],'Walk-in') <> 'Walk-in' AND ISNULL([MstTable].[TableCode],'Walk-in') <> 'Walk-in' THEN 'Dine-in' ELSE ISNULL([MstTable].[TableCode],'Walk-in') END) AS [TransactionType],
        CASE 
            WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0)
            THEN 0 
            ELSE 1 
        END AS [Void],
        CASE 
            WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0)
            THEN CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
            ELSE CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
        END AS [VoidAmount],
        CASE 
            WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2)
            THEN 1 
            ELSE 0 
        END AS [Refund],
        CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2)
			THEN CAST(ROUND(COALESCE([TrnCollection].[Amount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END AS [RefundAmount],
		MAX(
            CASE
                WHEN ISNULL([TrnSales].[Pax],1) > 0
                THEN  COALESCE(CONVERT(VARCHAR(20), ([TrnPaxTable].[TotalPax]), 1), '1')
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
        MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
        END) AS [GrossSalesAmount], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2)THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
        END) AS [NetSalesAmount], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN  CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2))
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
        END) AS [TotalTax], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND  [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax]  = 'LOCAL TAX'
			THEN  CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END) AS [OtherLocalTax], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([TotalServiceCharge].[ServiceCharge], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END) AS [TotalServiceCharge], --not max
        '0.00' AS [TotalTip],
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END) AS [TotalDiscount], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2)THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] - [TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END) AS [LessTaxAmount], --not max

		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2)THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'Senior Citizen Discount' OR [MstDiscount].[Discount] = 'PWD Discount')
			THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100)))
			ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) END
        END) AS [TaxExemptSales],
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
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
					CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
                WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
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
			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'Employee Discount' OR [MstDiscount].[Discount] = 'Employee Meal')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [EmployeeDiscountAmount], -- max

			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'Senior Citizen Discount')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [SeniorCitizenDiscountAmount], -- max

			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'VIP Discount')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [VIPDiscountAmount], -- max
			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'PWD')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [PWDDiscountAmount], -- max
			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'National Coach' OR [MstDiscount].[Discount] = 'National Athlete' OR [MstDiscount].[Discount] = 'Medal of Valor Discount' OR [MstDiscount].[Discount] = 'MOV')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [NationalCoachAthleteMedalofValorDiscountamount], -- max
			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) OR (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'SMAC Discount' OR [MstDiscount].[Discount] = 'SMAC')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [SMACDiscountAmount], -- max
           '' AS [OnlineDealsDiscountName],
           '0.00' AS [OnlineDealsDiscountAmount],
           '' AS [DiscountField1Name], 
           '' AS [DiscountField2Name], 
           '' AS [DiscountField3Name], 
           '' AS [DiscountField4Name], 
           '' AS [DiscountField5Name], 
           '' AS [DiscountField6Name], 
           '0.00'  AS [DiscountField1Amount], 
           '0.00'  AS [DiscountField2Amount], 
           '0.00'  AS [DiscountField3Amount], 
           '0.00'  AS [DiscountField4Amount], 
           '0.00'  AS [DiscountField5Amount], 
           '0.00'  AS [DiscountField6Amount],
           MAX(CASE 
			WHEN PaymentRank = 1 AND ISNULL([TrnSales].[IsReturn], 0) = 0 AND ISNULL([TrnSales].[IsCancelled], 0) = 0 THEN [AggregatedPayments].[PayType] ELSE null
			END) AS [PaymentType1],
			MAX(CASE WHEN PaymentRank = 1 THEN
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN PaymentRank = 1 AND ISNULL([TrnSales].[IsReturn], 0) = 0 AND ISNULL([TrnSales].[IsCancelled], 0) = 0 THEN 
						[AggregatedPayments].[Amount]
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
				--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
			END) AS [PaymentAmount1],

			MAX(CASE 
				WHEN PaymentRank = 2 AND ISNULL([TrnSales].[IsReturn], 0) = 0 AND ISNULL([TrnSales].[IsCancelled], 0) = 0 THEN [AggregatedPayments].[PayType] ELSE null
			END) AS [PaymentType2],
			MAX(CASE WHEN PaymentRank = 2 THEN
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN PaymentRank = 2 AND ISNULL([TrnSales].[IsReturn], 0) = 0 AND ISNULL([TrnSales].[IsCancelled], 0) = 0 THEN 
						[AggregatedPayments].[Amount]
					--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			END) AS [PaymentAmount2],

			MAX(CASE 
				WHEN PaymentRank = 3 AND ISNULL([TrnSales].[IsReturn], 0) = 0 AND ISNULL([TrnSales].[IsCancelled], 0) = 0 THEN [AggregatedPayments].[PayType] ELSE null
			END) AS [PaymentType3],
			MAX(CASE WHEN PaymentRank = 3 THEN
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN PaymentRank = 3 AND ISNULL([TrnSales].[IsReturn], 0) = 0 AND ISNULL([TrnSales].[IsCancelled], 0) = 0 THEN 
						[AggregatedPayments].[Amount]
					--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			END) AS [PaymentAmount3],
            MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Cash' THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalCashSalesAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Gift Certificate' THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalGiftCertificateSalesAmount], --Total Gift Cheque / Gift Card Sales Amount
			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Debit' THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalDebitCardSalesAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Gcash' OR [MstPayType].[PayType] = 'PayMaya' OR [MstPayType].[PayType] = 'GrabPay' OR [MstPayType].[PayType] = 'FoodPanda' THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalEwalletOnlineSalesAmount],
            MAX(
                CASE
                    WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
                    WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0 
                        AND ISNULL([TrnCollection].[IsReturn], 0) = 0 
                        AND ISNULL([TrnCollectionLine].[Amount], 0) > 0 
                        AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]) AND [MstPayType].[PayType] NOT IN ('Cash', 'Gift Certificate', 'Gcash', 'PayMaya', 'GrabPay', 'FoodPanda', 'Visa', 'Diners', 'JCB', 'Credit Card') THEN
                        CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                END
            ) AS [TotalOtherTenderAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Visa'  THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalMastercardSalesAmount],
						MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Visa' THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalVisaSalesAmount],
			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'American Express' THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalAmericanExpressSalesAmount],
			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Diners'  THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalDinersSalesAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'JCB'  THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalJCBSalesAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 OR ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Credit Card'  THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalCreditCardSalesAmount],

           '${Terminal}' AS [TerminalNumber],
           '${POSSerialNumber}' AS [SMPOSSerialNumber]
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
               LEFT JOIN [AggregatedPayments] ON [TrnSales].[SalesNumber] = [AggregatedPayments].[SalesNumber]
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
            WHERE [TrnSales].[TerminalId] = ${Terminal}
            AND [TrnSales].[IsLocked] = 1
            AND MONTH(CAST([TrnSales].[SalesDate] AS DATE)) = MONTH('${Dates}')
			AND YEAR(CAST([TrnSales].[SalesDate] AS DATE)) = YEAR('${Dates}')
		  
           GROUP BY
           [TrnSales].[SalesNumber],
           [TrnSales].[SalesDate],
           [TrnSales].[EntryDateTime],
           [TrnSales].[UpdateDateTime],
           [MstTable].[TableCode],
           [TrnCollection].[IsCancelled],
           CASE 
               WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0)
               THEN 0 
               ELSE 1 
           END,
           CASE 
               WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0)
               THEN CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
           END,
           CASE 
               WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2)
               THEN 1 
               ELSE 0 
           END,
           CASE 
               WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2)
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

/*  
    PREVIOUS QUERY 
    2024-12-16 
        WITH AggregatedPayments AS (
        SELECT 
            [TrnSales].[SalesNumber],
            [MstPayType].[PayType],
            [TrnCollectionLine].[Amount] AS [Amount],
            ROW_NUMBER() OVER (
                PARTITION BY [TrnSales].[SalesNumber]
                ORDER BY [TrnCollectionLine].[Amount] DESC
            ) AS PaymentRank
        FROM [TrnSales]
        LEFT JOIN [TrnCollection] ON [TrnSales].[Id] = [TrnCollection].[SalesId]
        LEFT JOIN [TrnCollectionLine] ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
        LEFT JOIN [MstPayType] ON [MstPayType].[Id] = [TrnCollectionLine].[PayTypeId]
        WHERE 
            [TrnSales].[TerminalId] = ${Terminal}
            AND [TrnSales].[IsLocked] = 1
            AND MONTH(CAST([TrnSales].[SalesDate] AS DATE)) = MONTH('${Dates}')
			AND YEAR(CAST([TrnSales].[SalesDate] AS DATE)) = YEAR('${Dates}')
            AND ISNULL([TrnCollection].[IsCancelled], 0) = 0
            AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
    )
    SELECT 
        REPLACE([TrnSales].[SalesNumber], '-', '') AS [OrderNumber],
        CONVERT(varchar, [TrnSales].[SalesDate], 23) AS [BusinessDay],
        MIN((CONVERT(varchar, [TrnSales].[SalesDate], 23)+' '+CONVERT(varchar,[TrnSales].[EntryDateTime], 8))) AS [CheckOpen],
        MAX((CONVERT(varchar, [TrnSales].[SalesDate], 23)+' '+CONVERT(varchar, [TrnSales].[UpdateDateTime], 8))) AS [CheckClose],
        '${SalesType}' AS [SalesType],
        MAX(CASE WHEN ISNULL([MstTable].[TableCode],'Walk-in') <> 'Walk-in' AND ISNULL([MstTable].[TableCode],'Walk-in') <> 'Walk-in' THEN 'Dine-in' ELSE ISNULL([MstTable].[TableCode],'Walk-in') END) AS [TransactionType],
        CASE 
            WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0)
            THEN 0 
            ELSE 1 
        END AS [Void],
        CASE 
            WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0)
            THEN CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
            ELSE CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
        END AS [VoidAmount],
        CASE 
            WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2)
            THEN 1 
            ELSE 0 
        END AS [Refund],
        CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2)
			THEN CAST(ROUND(COALESCE([TrnCollection].[Amount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END AS [RefundAmount],
		MAX(
            CASE
                WHEN ISNULL([TrnSales].[Pax],1) > 0
                THEN  COALESCE(CONVERT(VARCHAR(20), ([TrnPaxTable].[TotalPax]), 1), '1')
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
        MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			-CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
        END) AS [GrossSalesAmount], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			-CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount], 0), 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
        END) AS [NetSalesAmount], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			- CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN  CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2))
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
        END) AS [TotalTax], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) AND [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax]  = 'LOCAL TAX'THEN
			- CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND  [TrnSalesLine].[TaxId] = [MstTax].[Id] AND [MstTax].[Tax]  = 'LOCAL TAX'
			THEN  CAST(ROUND(COALESCE([TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END) AS [OtherLocalTax], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			- CAST(ROUND(COALESCE([TotalServiceCharge].[ServiceCharge], 0), 2) AS DECIMAL(10, 2))  
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([TotalServiceCharge].[ServiceCharge], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END) AS [TotalServiceCharge], --not max
        '0.00' AS [TotalTip],
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			- CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END) AS [TotalDiscount], --not max
		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) THEN
			- CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] - [TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
			THEN CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] - [TotalTax].[TotalTaxAmount], 0), 2) AS DECIMAL(10, 2)) 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
        END) AS [LessTaxAmount], --not max

		MAX(CASE 
			WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) AND ([MstDiscount].[Discount] = 'Senior Citizen Discount' OR [MstDiscount].[Discount] = 'PWD Discount') THEN
			-([TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))))
			WHEN ((ISNULL([TrnCollection].[IsReturn],0) = 2) AND [TrnSalesLine].[TaxId]=5) THEN -[TrnSalesLine].[Amount] 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
			CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'Senior Citizen Discount' OR [MstDiscount].[Discount] = 'PWD Discount')
			THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100)))
			ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] 
			ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) END
        END) AS [TotalExemptSales],
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
					WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) AND [MstDiscount].[Discount] NOT IN (
                           'SMAC Discount', 'SMAC', 'Zero Discount',
                           'Employee Discount', 'Employee Meal',
                           'Senior Citizen Discount',
                           'PWD Discount', 'PWD',
                           'VIP Discount',
                           'National Coach', 'National Athlete', 'Medal of Valor Discount'
                       ) THEN
					- CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
					WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
					CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
                   WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 )
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
			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) AND ([MstDiscount].[Discount] = 'Employee Discount' OR [MstDiscount].[Discount] = 'Employee Meal') THEN
				- CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'Employee Discount' OR [MstDiscount].[Discount] = 'Employee Meal')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [EmployeeDiscountAmount], -- max

			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) AND ([MstDiscount].[Discount] = 'Senior Citizen Discount') THEN
				- CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'Senior Citizen Discount')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [SeniorCitizenDiscountAmount], -- max

			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) AND ([MstDiscount].[Discount] = 'VIP Discount') THEN
				- CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'VIP Discount')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [VIPDiscountAmount], -- max
			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) AND ([MstDiscount].[Discount] = 'PWD') THEN
				- CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'PWD')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [PWDDiscountAmount], -- max
			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) AND ([MstDiscount].[Discount] = 'National Coach' OR [MstDiscount].[Discount] = 'National Athlete' OR [MstDiscount].[Discount] = 'Medal of Valor Discount' OR [MstDiscount].[Discount] = 'MOV') THEN
				- CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'National Coach' OR [MstDiscount].[Discount] = 'National Athlete' OR [MstDiscount].[Discount] = 'Medal of Valor Discount' OR [MstDiscount].[Discount] = 'MOV')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [NationalCoachAthleteMedalofValorDiscountamount], -- max
			MAX(CASE 
				WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2) AND ([MstDiscount].[Discount] = 'SMAC Discount' OR [MstDiscount].[Discount] = 'SMAC') THEN
				- CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 2) THEN
				CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
				WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 ) AND ([MstDiscount].[Discount] = 'SMAC Discount' OR [MstDiscount].[Discount] = 'SMAC')
				THEN CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2)) 
				ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) 
			END) AS [SMACDiscountAmount], -- max
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
           MAX(CASE 
			WHEN PaymentRank = 1 THEN [AggregatedPayments].[PayType] 
			END) AS [PaymentType1],
			MAX(CASE WHEN PaymentRank = 1 THEN
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						-[AggregatedPayments].[Amount]
					WHEN PaymentRank = 1 AND ISNULL([TrnSales].[IsReturn], 0) = 0 AND ISNULL([TrnSales].[IsCancelled], 0) = 0 THEN 
						[AggregatedPayments].[Amount]
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
				--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
			END) AS [PaymentAmount1],

			MAX(CASE 
				WHEN PaymentRank = 2 THEN [AggregatedPayments].[PayType] 
			END) AS [PaymentType2],
			MAX(CASE WHEN PaymentRank = 2 THEN
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						-[AggregatedPayments].[Amount]
					WHEN PaymentRank = 2 AND ISNULL([TrnSales].[IsReturn], 0) = 0 AND ISNULL([TrnSales].[IsCancelled], 0) = 0 THEN 
						[AggregatedPayments].[Amount]
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
				--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
			END) AS [PaymentAmount2],

			MAX(CASE 
				WHEN PaymentRank = 3 THEN [AggregatedPayments].[PayType] 
			END) AS [PaymentType3],
			MAX(CASE WHEN PaymentRank = 3 THEN
				CASE
					WHEN ISNULL([TrnSales].[IsCancelled], 0) = 1 THEN 
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 THEN 
						-[AggregatedPayments].[Amount] 
					WHEN PaymentRank = 3 AND ISNULL([TrnSales].[IsReturn], 0) = 0 AND ISNULL([TrnSales].[IsCancelled], 0) = 0 THEN 
						[AggregatedPayments].[Amount]
					ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
				--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
			END) AS [PaymentAmount3],
            MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Cash' THEN
						-CAST(ROUND(ISNULL([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 1 THEN
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Cash' THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalCashSalesAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gift Certificate' THEN
						-CAST(ROUND(ISNULL([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 1 THEN
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Gift Certificate' THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalGiftCertificateSalesAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Gcash' OR [MstPayType].[PayType] = 'PayMaya' OR [MstPayType].[PayType] = 'GrabPay' OR [MstPayType].[PayType] = 'FoodPanda') THEN
						-CAST(ROUND(ISNULL([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 1 THEN
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Gcash' OR [MstPayType].[PayType] = 'PayMaya' OR [MstPayType].[PayType] = 'GrabPay' OR [MstPayType].[PayType] = 'FoodPanda' THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalEwalletOnlineSalesAmount],
            MAX(
                CASE
                    WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0 
                        AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]) AND [MstPayType].[PayType] NOT IN ('Cash', 'Gift Certificate', 'Gcash', 'PayMaya', 'GrabPay', 'FoodPanda', 'Visa', 'Diners', 'JCB', 'Credit Card') THEN
                        -CAST(ROUND(COALESCE(([TrnCollectionLine].[Amount]), 0), 2) AS DECIMAL(10, 2))
                    WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 1 THEN
                        CAST(ROUND(0, 2) AS DECIMAL(10, 2))
                    WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0 
                        AND ISNULL([TrnCollection].[IsReturn], 0) = 0 
                        AND ISNULL([TrnCollectionLine].[Amount], 0) > 0 
                        AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]) AND [MstPayType].[PayType] NOT IN ('Cash', 'Gift Certificate', 'Gcash', 'PayMaya', 'GrabPay', 'FoodPanda', 'Visa', 'Diners', 'JCB', 'Credit Card') THEN
                        CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
                END
            ) AS [TotalOtherTenderAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Visa' THEN
						-CAST(ROUND(ISNULL([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 1 THEN
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Visa'  THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalMastercardSalesAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Diners' THEN
						-CAST(ROUND(ISNULL([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 1 THEN
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Diners'  THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalDinersSalesAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'JCB' THEN
						-CAST(ROUND(ISNULL([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 1 THEN
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'JCB'  THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
				END
			) AS [TotalJCBSalesAmount],

			MAX(
				CASE
					WHEN ISNULL([TrnSales].[IsReturn], 0) = 2 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Credit Card' THEN
						-CAST(ROUND(ISNULL([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 1 THEN
						CAST(ROUND(0, 2) AS DECIMAL(10, 2))
					WHEN ISNULL([TrnCollection].[IsCancelled], 0) = 0
						 AND ISNULL([TrnCollection].[IsReturn], 0) = 0
						 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0
						 AND [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
						 AND [MstPayType].[PayType] = 'Credit Card'  THEN
						CAST(ROUND(COALESCE([TrnCollectionLine].[Amount], 0), 2) AS DECIMAL(10, 2))
					--ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2))
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
               LEFT JOIN [AggregatedPayments] ON [TrnSales].[SalesNumber] = [AggregatedPayments].[SalesNumber]
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
            WHERE [TrnSales].[TerminalId] = ${Terminal}
            AND [TrnSales].[IsLocked] = 1
            AND MONTH(CAST([TrnSales].[SalesDate] AS DATE)) = MONTH('${Dates}')
			AND YEAR(CAST([TrnSales].[SalesDate] AS DATE)) = YEAR('${Dates}')
		  
           GROUP BY
           [TrnSales].[SalesNumber],
           [TrnSales].[SalesDate],
           [TrnSales].[EntryDateTime],
           [TrnSales].[UpdateDateTime],
           [MstTable].[TableCode],
           [TrnCollection].[IsCancelled],
           CASE 
               WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0)
               THEN 0 
               ELSE 1 
           END,
           CASE 
               WHEN (ISNULL([TrnCollection].[IsCancelled],0) = 0)
               THEN CAST(ROUND(0, 2) AS DECIMAL(10, 2))
               ELSE CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount] + [TotalDiscount].[TotalDiscountAmount], 0), 2) AS DECIMAL(10, 2))
           END,
           CASE 
               WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2)
               THEN 1 
               ELSE 0 
           END,
           CASE 
               WHEN (ISNULL([TrnCollection].[IsReturn],0) = 2)
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
     
    
    */
