export const mwDailySales = ({
  Dates,
  Terminal,
  OldAccumulatedTotal,
  VatExempt,
  RefundAmount,
  VATAmount,
  ServiceChargeAmount,
  CashSales,
  CreditDebitsales,
  OtherPaymentSales,
  VoidAmount,
  ControlNumber,
  SalesType,
  NetSalesAmountPerSalesType,
  MallParnterCodeId
}: any): string => {
  return `
     SELECT
        '${MallParnterCodeId}' AS [MallPartnerCodeId],
        [TrnSales].[TerminalId] AS [Terminal],
        '${Dates}' AS [Date],
		'${OldAccumulatedTotal}' AS [OldAccumulatedTotal],
		${OldAccumulatedTotal} + SUM(CASE WHEN ISNULL([TrnCollection].[IsReturn], 0) = 2 OR ISNULL([TrnSales].[IsCancelled],0) = 1 THEN 0 ELSE CAST(ROUND([TrnSalesLine].[Amount], 3) AS DECIMAL(10, 3))  END) AS [NewAccumulatedTotal], 
		SUM(CASE WHEN [TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL  THEN CAST(ROUND(COALESCE([GrossSales].[GrossSalesAmount], 0), 3) AS DECIMAL(10, 3)) + CAST(ROUND(COALESCE([TotalDiscount].[TotalDiscountAmount], 0), 5) AS DECIMAL(10, 5)) ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) END) AS [GrossSalesAmount],
		'${VatExempt}' AS [NonTaxSalesAmount],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('PWD', 'Senior Citizen Discount', 'MOV', 'Athlete Discount', 'National Athlete', 'Single Parent')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [GovMandatedDiscount],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND  ([MstDiscount].[Discount] NOT IN ('PWD', 'Senior Citizen Discount', 'MOV', 'Athlete Discount', 'National Athlete', 'Single Parent')) THEN  ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END ) AS [OtherDiscount],
		'${RefundAmount}' AS [RefundAmount],
		'${VATAmount}' AS [RefundAmount],
		'${ServiceChargeAmount}' AS [ServiceChargeAmount],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn], 0) = 2 OR ISNULL([TrnSales].[IsCancelled],0) = 1) THEN 0  ELSE CAST(ROUND([GrossSales].[GrossSalesAmount], 3) AS DECIMAL(10, 3)) END) AS [NetSalesAmount],
		'${CashSales}' AS [CashSales],
		'${CreditDebitsales}' AS [CreditDebitsales],
		'${OtherPaymentSales}' AS [OtherPaymentSales],
		'${VoidAmount}' AS [VoidAmount],
		 COUNT(CASE  WHEN [TrnSales].[CustomerId] = 1 THEN [TrnSales].[Id] ELSE NULL END) +  COUNT(DISTINCT CASE  WHEN [TrnSales].[CustomerId] > 1 THEN [TrnSales].[CustomerId] ELSE NULL END ) AS [CustomerCount],
		'${ControlNumber}' AS [ControlNumber],
		COUNT([TrnSales].[Id]) AS [NoSalesTransaction],
		'${SalesType}' AS [SalesType],
		'${NetSalesAmountPerSalesType}' AS [NetSalesAmountPerSalesType]
	FROM 
        [TrnSales]
        INNER JOIN [TrnSalesLine] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
        LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
        INNER JOIN [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id]
        LEFT JOIN [TrnPaxTable] ON [TrnPaxTable].[SaleId] = [TrnSalesLine].[SalesId]
        INNER JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id]
		LEFT JOIN (SELECT [SalesId], SUM(([DiscountAmount]) * ([Quantity])) AS [TotalDiscountAmount]FROM [TrnSalesLine] GROUP BY [SalesId]) AS [TotalDiscount] ON [TrnSales].[Id] = [TotalDiscount].[SalesId]
		LEFT JOIN (SELECT [SalesId], SUM([Amount]) AS [GrossSalesAmount], SUM([Price]*[Quantity]) AS [TotalAmount] FROM [TrnSalesLine] GROUP BY [SalesId]) AS [GrossSales] ON [TrnSales].[Id] = [GrossSales].[SalesId]
    WHERE 
        [TrnSales].[IsLocked] = 1 
        AND [TrnCollection].[IsLocked] = 1 
        AND [TrnSales].[TerminalId] = '${Terminal}'
        AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
    GROUP BY 
        [TrnSales].[TerminalId],
        [TrnSales].[SalesDate]
    `
}

export const TaxAmount = ({ Dates, TerminalId }: any): string => {
  return `
    SELECT
        SUM(CASE 
                WHEN (([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) 
                    AND ([TrnCollection].[IsReturn] <> 2) 
                    AND ([TrnSalesLine].[ItemId] = 4)) 
                THEN ISNULL([TrnSalesLine].[Amount], 0) 
                ELSE 0 
            END) AS GrossSalesAmountNotSubjectToPercentageRent,

        SUM(CASE 
                WHEN (([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) 
                    AND ([MstDiscount].[Discount] = 'Senior Citizen Discount')) 
                THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) 
                ELSE 0 
            END) AS [AdjustmentAmount],
        SUM(CASE 
                WHEN (([TrnCollection].[IsCancelled] = 0 OR [TrnCollection].[IsCancelled] IS NULL) 
                    AND ([MstDiscount].[Discount] = 'PWD')) 
                THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) 
                ELSE 0 
            END) AS [DisabilityDiscount],
        SUM(CASE WHEN ([TrnSalesLine].[Price2]>0 AND (ISNULL([TrnSales].[IsReturn], 0) = 0 AND [TrnSales].[IsCancelled] = 0)) THEN CAST(ROUND([TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))), 2) AS DECIMAL(10, 2))  ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN CAST(ROUND([TrnSalesLine].[Amount], 2) AS DECIMAL(10, 2)) ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) END END) AS [VatExempt]
    FROM  
        [TrnSales]
    INNER JOIN [TrnSalesLine] 
        ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
    LEFT JOIN [TrnCollection] 
        ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
    INNER JOIN [MstDiscount] 
        ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id]
    LEFT JOIN [TrnPaxTable] 
        ON [TrnPaxTable].[SaleId] = [TrnSalesLine].[SalesId]
    INNER JOIN [MstTax] 
        ON [TrnSalesLine].[TaxId] = [MstTax].[Id]
    LEFT JOIN 
        (SELECT [SalesId], SUM([DiscountAmount] * [Quantity]) AS TotalDiscountAmount 
        FROM [TrnSalesLine] 
        GROUP BY [SalesId]) AS TotalDiscount 
        ON [TrnSales].[Id] = [TotalDiscount].[SalesId]

    WHERE 
        [TrnSales].[IsLocked] = 1 
        AND [TrnCollection].[IsLocked] = 1 
        AND [TrnSales].[IsCancelled] = 0 
        AND [TrnSales].[TerminalId] = ${TerminalId}
        AND [TrnCollection].[IsCancelled] = 0  
        AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'

    GROUP BY 
        [TrnSales].[TerminalId],
        [TrnSales].[SalesDate]`
}

export const ServiceCharge = ({ Dates, TerminalId }: any): string => {
  return `
    SELECT 
    SUM([TrnSalesLine].[Amount]) AS ServiceCharge 
    FROM TrnSalesLine
    LEFT JOIN [TrnSales] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
    WHERE [ItemId] = 1 
    AND [TrnSales].[IsLocked] = 1 
    AND [TrnSales].[TerminalId] = ${TerminalId}
    AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}' 
    GROUP BY [TrnSalesLine].[Amount]
    `
}
