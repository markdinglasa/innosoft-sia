export const mwDailySales = ({
  Dates,
  Terminal,
  OldAccumulatedTotal,
  NewAccumulatedTotal,
  GrossSalesAmount,
  VatExempt,
  RefundAmount,
  VATAmount,
  ServiceChargeAmount,
  NetSalesAmount,
  CashSales,
  CreditDebitsales,
  OtherPaymentSales,
  VoidAmount,
  ControlNumber,
  SalesType,
  NetSalesAmountPerSalesType,
  MallPartnerCodeId
}: any): string => {
  return `
      SELECT
        '${MallPartnerCodeId}' AS [MallPartnerCodeId],
        TrnCollection.[TerminalId] AS [Terminal],
        '${Dates}' AS [Date],
		'${OldAccumulatedTotal}' AS [OldAccumulatedTotal],
		'${NewAccumulatedTotal}' AS [NewAccumulatedTotal], 
		'${GrossSalesAmount}' AS [GrossSalesAmount],
		'${VatExempt}' AS [NonTaxSalesAmount],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('PWD', 'Senior Citizen Discount', 'MOV', 'Athlete Discount', 'National Athlete', 'Single Parent')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [GovMandatedDiscount],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND  ([MstDiscount].[Discount] NOT IN ('PWD', 'Senior Citizen Discount', 'MOV', 'Athlete Discount', 'National Athlete', 'Single Parent')) THEN  ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END ) AS [OtherDiscount],
		'${RefundAmount}' AS [RefundAmount],
		'${VATAmount}' AS [TaxAmount],
		'${ServiceChargeAmount}' AS [ServiceChargeAmount],
		'${NetSalesAmount}' AS [NetSalesAmount],
		'${CashSales}' AS [CashSales],
		'${CreditDebitsales}' AS [CreditDebitsales],
		'${OtherPaymentSales}' AS [OtherPaymentSales],
		'${VoidAmount}' AS [VoidAmount],
		 COUNT(DISTINCT CASE  WHEN [TrnSales].[CustomerId] = 1 THEN [TrnSales].[Id] ELSE NULL END) +  COUNT(DISTINCT CASE  WHEN [TrnSales].[CustomerId] > 1 THEN [TrnSales].[CustomerId] ELSE NULL END ) AS [CustomerCount],
		'${ControlNumber}' AS [ControlNumber],
		COUNT(DISTINCT [TrnSales].[Id]) AS [NoSalesTransaction],
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
        AND TrnCollection.[TerminalId] = ${Terminal}
        AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
    GROUP BY 
        TrnCollection.[TerminalId],
        TrnCollection.CollectionDate
    `
}

export const TaxAmountQuery = ({ Dates, Terminal }: any): string => {
  return `
    SELECT 
        SUM(ROUND(CASE WHEN( ISNULL([TrnSales].[IsCancelled],0) = 0 AND ISNULL([TrnSales].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [PreviousReading],
        SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [Price] ELSE ([Price1]+[Price2LessTax]) END)*[Quantity],2)) AS [GrossSales], 
        SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [TaxAmount],
        SUM(ROUND(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [NetSales],
		SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 3)) AS [VoidAmount],
		SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  2) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 3)) AS [RefundAmount],
        SUM(ROUND(CASE WHEN([TrnSalesLine].[Price2]>0 AND ((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0))) THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))) ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] ELSE 0 END END,5)) AS [VATExempt],
        SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND ([TrnSalesLine].[TaxAmount]<1) AND ([TrnSalesLine].[Discountid]<>4 And [TrnSalesLine].[Discountid]<>3)) THEN[TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [NONVATSales]
        FROM TrnSales 
            INNER JOIN [TrnSalesLine] 
            LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
            INNER JOIN [MstDiscount] ON TrnSalesLine.DiscountId = MstDiscount.Id
            INNER JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
            LEFT JOIN (
                   SELECT [SalesId], SUM([Amount]) AS [ServiceCharge]
                   FROM [TrnSalesLine]
                   WHERE [ItemId] = 1
                   GROUP BY [SalesId]
               ) AS [TotalServiceCharge] ON [TrnSales].[Id] = [TotalServiceCharge].[SalesId]
        WHERE 
            [TrnSales].[IsLocked] = 1 
            AND [TrnCollection].[IsLocked] = 1 
            AND TrnCollection.[TerminalId] = ${Terminal}
            AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
        GROUP BY 
        TrnCollection.[TerminalId]
   `
}
export const ControlNumberQuery = ({ Terminal, Dates }: any): string => {
  return `
    SELECT MAX([ControlNumber]) AS [ControlNumber], MAX([PreviousReading]) AS [PreviousReading]
    FROM [SysControlNumber]
    WHERE [TerminalId] = ${Terminal}
    AND CAST([TimeStamp] AS DATE) = '${Dates}'
    `
}

export const PreviousReading = ({ Dates, Terminal }: any): string => {
  return `
        SELECT  
        SUM(ROUND(CASE WHEN( ISNULL(TrnCollection.[IsCancelled],0) = 0 AND ISNULL(TrnCollection.[IsReturn], 0) = 0) THEN TrnCollection.[Amount] ELSE 0 END, 5)) AS [PreviousReading]
        FROM TrnCollection
        WHERE TrnCollection.[TerminalId] = ${Terminal} AND CAST(TrnCollection.CollectionDate AS DATE) < '${Dates}'
      `
}
export const PaymentSalesQuery = ({ Dates, Terminal }: any): string => {
  return `
    SELECT 
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0 AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Cash')) THEN CASE WHEN ([TrnCollectionLine].[Amount] > [TrnCollection].[Amount]) THEN [TrnCollection].[Amount] ELSE [TrnCollectionLine].[Amount] END ELSE 0 END) AS [CashSales], 
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Credit Card' OR [MstPayType].[PayType] = 'Debit' ))) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [CreditDebitsales], 
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Credit Card'))) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [Creditsales], 
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Charge'))) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [ChargeSales],
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollectionLine].[Amount], 0) > 0 AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] <> 'Credit Card' AND  [MstPayType].[PayType] <> 'Cash' AND  [MstPayType].[PayType] <> 'Debit' )) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [OtherPaymentSales]
    FROM TrnSales 
	LEFT JOIN TrnCollection ON [TrnSales].[Id] = [TrnCollection].[SalesId]
    LEFT JOIN TrnCollectionLine ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
    LEFT JOIN [MstPayType] ON [MstPayType].Id = [TrnCollectionLine].[PayTypeId]
    WHERE
    [TrnCollection].[IsLocked] = 1 
	AND ISNULL([TrnCollection].[IsCancelled],0) = 0 
	AND ISNULL([TrnCollection].[IsReturn],0) =0 
    AND [TrnCollection].[TerminalId] = ${Terminal}
    AND CAST([TrnCollection].[CollectionDate] AS DATE) = '${Dates}'
	GROUP BY 
	[TrnCollection].[TerminalId]
  `
}
export const ServiceChargeQuery = ({ Dates, Terminal }: any): string => {
  return `
    SELECT 
      SUM([TrnSalesLine].[Amount]) AS [ServiceCharge],
      COUNT([TrnSalesLine].[Amount]) AS [ServiceChargeCount]
      FROM TrnSalesLine
      LEFT JOIN TrnCollection ON TrnCollection.[SalesId] = [TrnSalesLine].[SalesId]
      WHERE [ItemId] = 1 
      AND TrnCollection.[IsLocked] = 1 
      AND TrnCollection.[TerminalId] = ${Terminal}
      AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}' 
      GROUP BY TrnCollection.CollectionDate
      `
}
export const GrossSalesQuery = ({ Dates, Terminal }: any): string => {
  return `
        SELECT 
          SUM(ROUND(CASE WHEN( ISNULL([TrnSales].[IsCancelled],0) = 0 AND ISNULL([TrnSales].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [PreviousReading],
          SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [Price] ELSE ([Price1]+[Price2LessTax]) END)*[Quantity],2)) AS [GrossSales], 
          SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [TaxAmount],
          SUM(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END) AS [NetSales],
          SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 3)) AS [VoidAmount],
          SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  2) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 3)) AS [RefundAmount],
          SUM(ROUND(CASE WHEN([TrnSalesLine].[Price2]>0 AND ((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0))) THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))) ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] ELSE 0 END END,5)) AS [VATExempt],
          SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND ([TrnSalesLine].[TaxAmount]<1) AND ([TrnSalesLine].[Discountid]<>4 And [TrnSalesLine].[Discountid]<>3)) THEN[TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [NONVATSales]
          FROM TrnSales 
              INNER JOIN [TrnSalesLine] 
              LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
              INNER JOIN [MstDiscount] ON TrnSalesLine.DiscountId = MstDiscount.Id
              INNER JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
              LEFT JOIN (
                     SELECT [SalesId], SUM([Amount]) AS [ServiceCharge]
                     FROM [TrnSalesLine]
                     WHERE [ItemId] = 1
                     GROUP BY [SalesId]
                 ) AS [TotalServiceCharge] ON [TrnSales].[Id] = [TotalServiceCharge].[SalesId]
          WHERE 
              [TrnSales].[IsLocked] = 1 
              AND [TrnCollection].[IsLocked] = 1 
              AND TrnCollection.[TerminalId] = ${Terminal}
              AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
          GROUP BY 
          TrnCollection.[TerminalId]
    
    `
}
