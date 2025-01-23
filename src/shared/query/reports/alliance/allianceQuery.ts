export const AllianceTenderTotalQuery = ({ Terminal, Dates }: any): string => {
  return `
    SELECT
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Cash')) THEN CASE WHEN ([TrnCollectionLine].[Amount] > [TrnCollection].[Amount]) THEN [TrnCollection].[Amount] ELSE [TrnCollectionLine].[Amount] END ELSE 0 END) AS [CashSales],
	COUNT(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Cash')) THEN CASE WHEN ([TrnCollectionLine].[Amount] > [TrnCollection].[Amount]) THEN [TrnCollection].[Amount] ELSE [TrnCollectionLine].[Amount] END ELSE null END) AS [CashSalesCount],
	SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Credit Card'))) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [CreditSales],
	COUNT(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Credit Card'))) THEN [TrnCollectionLine].[Amount] ELSE null END) AS [CreditSalesCount], 

    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Charge'))) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [ChargeSales],

    COUNT(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Charge'))) THEN [TrnCollectionLine].[Amount] ELSE null END) AS [ChargeSalesCount],

	SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gift Certificate')) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [GiftCertificateSales],

	COUNT(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gift Certificate')) THEN [TrnCollectionLine].[Amount] ELSE null END) AS [GiftCertificateSalesCount],
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] <> 'Credit Card' AND  [MstPayType].[PayType] <> 'Cash' AND  [MstPayType].[PayType] <> 'Gift Certificate' AND  [MstPayType].[PayType] <> 'Charge' )) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [OtherTenderSales],
    COUNT(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] <> 'Credit Card' AND  [MstPayType].[PayType] <> 'Cash' AND  [MstPayType].[PayType] <> 'Gift Certificate' AND  [MstPayType].[PayType] <> 'Charge' )) THEN [TrnCollectionLine].[Amount] ELSE null END) AS [OtherTenderSalesCount]
    FROM TrnSales 
    LEFT JOIN TrnCollection ON [TrnSales].[Id] = [TrnCollection].[SalesId]
    LEFT JOIN TrnCollectionLine ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
    LEFT JOIN [MstPayType] ON [MstPayType].Id = [TrnCollectionLine].[PayTypeId]
    WHERE
      [TrnSales].[IsLocked] = 1 
      AND [TrnCollection].[IsLocked] = 1 
      AND [TrnCollectionLine].[Amount] > 0
      AND ISNULL([TrnCollection].[IsCancelled],0) = 0 
      AND ISNULL([TrnCollection].[IsReturn],0) = 0 
      AND [TrnSales].[TerminalId] =  ${Terminal}
      AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
    GROUP BY 
    [TrnSales].[TerminalId]
  `
}

export const AllianceTenderPerSalesQuery = ({ Terminal, Dates }: any): string => {
  return `
  SELECT
	[TrnSales].[Id],
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Cash')) THEN CASE WHEN ([TrnCollectionLine].[Amount] > [TrnCollection].[Amount]) THEN [TrnCollection].[Amount] ELSE [TrnCollectionLine].[Amount] END ELSE 0 END) AS [CashSales],
	SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Credit Card'))) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [CreditSales],
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND ([MstPayType].[PayType] = 'Charge'))) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [ChargeSales],
	SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] = 'Gift Certificate')) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [GiftCertificateSales],
    SUM(CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0  AND ([TrnCollectionLine].[PayTypeId] = [MstPayType].[Id] AND [MstPayType].[PayType] <> 'Credit Card' AND  [MstPayType].[PayType] <> 'Cash' AND  [MstPayType].[PayType] <> 'Gift Certificate' AND  [MstPayType].[PayType] <> 'Charge' )) THEN [TrnCollectionLine].[Amount] ELSE 0 END) AS [OtherTenderSales]
    FROM TrnSales 
    LEFT JOIN TrnCollection ON [TrnSales].[Id] = [TrnCollection].[SalesId]
    LEFT JOIN TrnCollectionLine ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
    LEFT JOIN [MstPayType] ON [MstPayType].Id = [TrnCollectionLine].[PayTypeId]
    WHERE
      [TrnSales].[IsLocked] = 1 
      AND [TrnCollection].[IsLocked] = 1 
      AND [TrnCollectionLine].[Amount] > 0
      AND ISNULL([TrnCollection].[IsCancelled],0) = 0 
      AND ISNULL([TrnCollection].[IsReturn],0) = 0 
      AND [TrnSales].[TerminalId] =  ${Terminal}
      AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
    GROUP BY 
	[TrnSales].[Id],
    [TrnSales].[TerminalId]
  `
}
export const PreviousAmountsQuery = ({ Terminal, Dates }: any): string => {
  return `
  SELECT 
  SUM(ROUND(CASE WHEN( ISNULL([TrnSales].[IsCancelled],0) = 0 AND ISNULL([TrnSales].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [PreviousReading],
	SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnSales].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [previoustax],
	SUM(ROUND((CASE WHEN((ISNULL([TrnSales].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ISNULL([TrnSalesLine].[TaxAmount],0)>0) THEN [TrnSalesLine].[Amount]-[TrnSalesLine].[TaxAmount] ELSE 0 END), 4)) AS [previoustaxsale],
    SUM(ROUND(CASE WHEN(((ISNULL([TrnSales].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND ([TrnSalesLine].[TaxAmount]<1) AND ([TrnSalesLine].[Discountid]<>4 And [TrnSalesLine].[Discountid]<>3)) THEN[TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [previousnotaxsale]
	
	   FROM TrnSales 
            LEFT JOIN [TrnSalesLine] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
            LEFT JOIN [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id]
            LEFT JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id] 
			LEFT JOIN (SELECT [SalesId], SUM(([DiscountAmount]) * ([Quantity])) AS [TotalDiscountAmount] FROM [TrnSalesLine] GROUP BY [SalesId]) AS [TotalDiscount] ON [TrnSales].[Id] = [TotalDiscount].[SalesId]
        WHERE 
            [TrnSales].[IsLocked] = 1 
            AND [TrnSales].[TerminalId] = ${Terminal}
            AND CAST([TrnSales].[SalesDate] AS DATE) < '${Dates}'
        GROUP BY 
        [TrnSales].[TerminalId]
  `
}
export const AllianceSalesEODQuery = ({
  Terminal,
  Dates,
  PreviousReading,
  PreviousTax,
  PreviousTaxSales,
  PreviousNonTaxSales,
  ControlNumber,
  ServiceCharge,
  ServiceChargeCount,
  CashSales,
  CashSalesCount,
  CreditSales,
  CreditSalesCount,
  ChargeSales,
  ChargeSalesCount,
  GiftCertificateSales,
  GiftCertificateSalesCount,
  OtherTenderSales,
  OtherTenderSalesCount,
  EWT,
  ZeroRated
}): string => {
  return `
 		SELECT 
		MIN((REPLACE(CONVERT(varchar, [TrnSales].[SalesDate], 23),'-','')+''+REPLACE(CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8),':',''))) AS [date],
		'${ControlNumber}' AS [zcounter],
		'${PreviousReading}' AS [previousnrgt],
    ${PreviousReading} + SUM(ROUND(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [nrgt],
		'${PreviousTax}' AS [previoustax],
    ${PreviousTax} + SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [newtax],

		'${PreviousTaxSales}' AS [previoustaxsale],
    ${PreviousTaxSales} + SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND ISNULL([TrnSalesLine].[TaxAmount],0)>0 AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [Price] ELSE ([Price1]+[Price2LessTax]) END)*[Quantity],2)) AS [newtaxsale],

		'${PreviousNonTaxSales}' AS [previousnotaxsale],
    ${PreviousNonTaxSales} + SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND ([TrnSalesLine].[TaxAmount]<1) AND ([TrnSalesLine].[Discountid]<>4 And [TrnSalesLine].[Discountid]<>3)) THEN[TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [newnotaxsale],
		MIN((CONVERT(varchar, [TrnSales].[SalesDate], 23)+ ' '+CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8))) AS [opentime],
		MAX((CONVERT(varchar, [TrnSales].[SalesDate], 23)+ ' '+CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8))) AS [closetime],
    SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [Price] ELSE ([Price1]+[Price2LessTax]) END)*[Quantity],2)) AS [gross],
		SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [vat],

		SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'LOCAL TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [localtax],

		SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'AMUSEMENT TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [amusement],
		'${EWT}' AS [ewt],

		SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND ISNULL([TrnSalesLine].[TaxAmount],0)>0 AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [Price] ELSE ([Price1]+[Price2LessTax]) END)*[Quantity],2)) AS [taxsale], 

		SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND ([TrnSalesLine].[TaxAmount]<1) AND ([TrnSalesLine].[Discountid]<>4 And [TrnSalesLine].[Discountid]<>3)) THEN[TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [notaxsale],
		'${ZeroRated}' AS [zerosale],

		SUM(ROUND(CASE WHEN([TrnSalesLine].[Price2]>0 AND ((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0))) THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))) ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] ELSE 0 END END,5)) AS [vatexempt],

		SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 3)) AS [void],
		COUNT(DISTINCT (CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSalesLine].[Amount] ELSE null END)) AS [voidcnt],

    SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND (TrnSalesLine.[DiscountAmount]>0) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [disc],
		COUNT(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND (TrnSalesLine.[DiscountAmount]>0) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], null) ELSE null END) AS [disccnt],

		SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  2) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 3)) AS [refund],
		COUNT((CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  2) THEN  [TrnSalesLine].[Amount] ELSE null END)) AS [refundcnt],
    
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Senior Citizen Discount')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [senior],
		COUNT(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Senior Citizen Discount')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], null) ELSE null END) AS [seniorcnt],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('PWD')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [pwd],
		COUNT(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('PWD')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], null) ELSE null END) AS [pwdcnt],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Diplomat Discount')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [diplomat],
		COUNT(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Diplomat Discount')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], null) ELSE null END) AS [diplomatcnt],
		'${ServiceCharge}' AS [service],
		'${ServiceChargeCount}' AS [servicecnt],
		MIN(REPLACE([TrnCollection].[CollectionNumber], '-', '') ) AS [receiptstart],
		MAX(REPLACE([TrnCollection].[CollectionNumber], '-', '') ) AS [receiptend],
		COUNT(DISTINCT [TrnSales].[Id]) AS [trxcnt],
		'${CashSales}' AS [cash],
		'${CashSalesCount}' AS [cashcnt],
		'${CreditSales}' AS [credit],
		'${CreditSalesCount}' AS [creditcnt],
    '${ChargeSales}' AS [charge],
		'${ChargeSalesCount}' AS [chargecnt],
		'${GiftCertificateSales}' AS [giftcheck],
		'${GiftCertificateSalesCount}' AS [giftcheckcnt],
		'${OtherTenderSales}' AS [othertender],
		'${OtherTenderSalesCount}' AS [othertendercnt]
	   FROM TrnSales 
            LEFT JOIN [TrnSalesLine] ON [TrnSales].[Id] = [TrnSalesLine].[SalesId]
            LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSalesLine].[SalesId]
            LEFT JOIN [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id]
            LEFT JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id] 
			LEFT JOIN (SELECT [SalesId], SUM(([DiscountAmount]) * ([Quantity])) AS [TotalDiscountAmount] FROM [TrnSalesLine] GROUP BY [SalesId]) AS [TotalDiscount] ON [TrnSales].[Id] = [TotalDiscount].[SalesId]
        WHERE 
            [TrnSales].[IsLocked] = 1 
            AND [TrnCollection].[IsLocked] = 1 
            AND [TrnSales].[TerminalId] = ${Terminal}
            AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
        GROUP BY 
        [TrnSales].[TerminalId]
  `
}

export const AllianceProductLineQuery = ({ Terminal, Dates, ReceiptNumber }) => {
  return `
    SELECT 
    REPLACE([TrnCollection].[CollectionNumber], '-', '') AS [receiptno],
    ISNULL([MstItem].[BarCode],'NA') AS [sku],
    CAST(ROUND(ISNULL([TrnSalesLine].[Quantity], 0), 2) AS DECIMAL(10, 2)) AS [qty],
    CAST(ROUND(ISNULL([TrnSalesLine].[Price], 0), 2) AS DECIMAL(10, 2))  AS [unitprice],
    0 AS [disc],
    0 AS [senior],
    0 AS [pwd],
    0 AS [diplomat],
    0 AS [taxtype],
    CAST(ROUND(ISNULL([TrnSalesLine].[TaxAmount], 0), 2) AS DECIMAL(10, 2)) AS [tax],
    [TrnSales].[Remarks] AS [memo],
    [TrnSalesLine].[Quantity] * [TrnSalesLine].[Price] AS [total]
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
    [TrnSales].[Remarks]
  `
}

export const AllianceTransactionQuery = ({ Terminal, Dates }) => {
  return `
SELECT 
    REPLACE([TrnCollection].[CollectionNumber], '-', '') AS [receiptno],
    SUM(CASE 
        WHEN TrnSales.IsCancelled = 1 
        THEN CAST(ROUND(ISNULL(TrnSalesLine.Amount, 0), 2) AS DECIMAL(10, 2)) 
        ELSE 0 
    END) AS void,

    SUM(CASE 
        WHEN ISNULL(TrnCollection.IsCancelled, 0) = 0 AND ISNULL (TrnCollection.IsReturn,0) = 0
             AND TrnCollectionLine.PayTypeId = MstPayType.Id 
             AND MstPayType.PayType = 'Cash' 
        THEN CASE 
            WHEN TrnCollectionLine.Amount > TrnCollection.Amount 
            THEN TrnCollection.Amount 
            ELSE TrnCollectionLine.Amount 
        END 
        ELSE 0 
    END) AS cash,
    SUM(CASE 
        WHEN ISNULL(TrnCollection.IsCancelled, 0) = 0 AND ISNULL (TrnCollection.IsReturn,0) = 0
             AND TrnCollectionLine.PayTypeId = MstPayType.Id 
             AND MstPayType.PayType = 'Credit Card' 
        THEN TrnCollectionLine.Amount 
        ELSE 0 
    END) AS credit,
    SUM(CASE 
        WHEN ISNULL(TrnCollection.IsCancelled, 0) = 0 AND ISNULL (TrnCollection.IsReturn,0) = 0
             AND TrnCollectionLine.PayTypeId = MstPayType.Id 
             AND MstPayType.PayType = 'Charge' 
        THEN TrnCollectionLine.Amount 
        ELSE 0 
    END) AS charge,
    SUM(CASE 
        WHEN ISNULL(TrnCollection.IsCancelled, 0) = 0 AND ISNULL (TrnCollection.IsReturn,0) = 0
             AND TrnCollectionLine.PayTypeId = MstPayType.Id 
             AND MstPayType.PayType = 'Gift Certificate' 
        THEN TrnCollectionLine.Amount 
        ELSE 0 
    END) AS giftcheck,
    SUM(CASE 
        WHEN ISNULL(TrnCollection.IsCancelled, 0) = 0 AND ISNULL (TrnCollection.IsReturn,0) = 0
             AND TrnCollectionLine.PayTypeId = MstPayType.Id 
             AND MstPayType.PayType NOT IN ('Credit Card', 'Cash', 'Gift Certificate', 'Charge') 
        THEN TrnCollectionLine.Amount 
        ELSE 0 
    END) AS othertender,
    SUM(DISTINCT CASE 
        WHEN TrnSales.IsCancelled = 1 OR TrnSales.IsReturn = 2 
        THEN 0 
        ELSE ISNULL([TotalDiscount].[TotalDiscountAmount], 0)
    END) AS linedisc,

	SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Senior Citizen Discount')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [linesenior],
	0 AS [evat],
	SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('PWD')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [linepwd],
    SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Diplomat Discount')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [linediplomat],
	SUM(DISTINCT CASE WHEN(ISNULL(TrnCollection.IsCancelled, 0) = 0 AND ISNULL (TrnCollection.IsReturn,0) = 0) THEN [TrnCollection].[Amount] ELSE 0 END) AS [subtotal],
	SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Senior Citizen Discount')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [senior],
	SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('PWD')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [pwd],
    SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Diplomat Discount')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [diplomat],
	SUM(DISTINCT ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [vat],
	0 as [exvat],
  
	SUM(DISTINCT ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [incvat],

	SUM(DISTINCT ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'LOCAL TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [localtax],
	SUM(DISTINCT ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'AMUSEMENT TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [amusement],
	0 [ewt],

	ISNULL([TotalServiceCharge].[ServiceCharge],0) AS [service],
	SUM(DISTINCT CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSalesLine].[TaxAmount],0) > 0) THEN [TrnSalesLine].[Amount] ELSE 0 END) AS [taxsale],
	SUM(DISTINCT CASE WHEN(ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSalesLine].[TaxAmount],0) <= 0) THEN ([TrnCollection].[Amount]) ELSE 0 END) AS [notaxsale],
	0 as [taxexsale],
	SUM(DISTINCT ROUND(CASE WHEN(([TrnSalesLine].[TaxAmount] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnCollection].[Amount] ELSE 0 END, 4)) AS [taxincsale],
	0 AS [zerosale],
	SUM(DISTINCT ROUND(CASE WHEN([TrnSalesLine].[Price2]>0 AND ((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0))) THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))) ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] ELSE 0 END END,5)) AS [vatexempt],

	MAX(ISNULL([TrnPaxTable].[TotalPax],1)) AS [customercnt],
	SUM(DISTINCT ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [TrnSalesLine].[Price] ELSE ([TrnSalesLine].[Price1]+[TrnSalesLine].[Price2LessTax]) END)*[TrnSalesLine].[Quantity],2)) AS [gross],
	SUM(DISTINCT CASE WHEN [TrnSales].[IsReturn] = 2 THEN CAST(ROUND(ISNULL([TrnSalesLine].[Amount], 0), 2) AS DECIMAL(10, 2)) ELSE CAST(ROUND(0, 2) AS DECIMAL(10, 2)) END) AS [refund],

	MAX(CASE WHEN (ISNULL(TrnCollection.IsCancelled, 0) = 0 AND ISNULL (TrnCollection.IsReturn,0) = 0 AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD') THEN [TrnSalesLine].[TaxRate] ELSE 0 END) AS [taxrate],
	MIN(REPLACE((CONVERT(varchar, [TrnSales].[SalesDate], 23)+''+REPLACE(CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8),':', '')), '-', '')) AS [posted],
	[TotalQuantity].[Quantity] AS [qty],
	1 AS [created],
	'NA' AS [memo]
	FROM [TrnSales]
    LEFT JOIN [TrnSalesLine] ON [TrnSalesLine].[SalesId] = [TrnSales].[Id]
	LEFT JOIN [TrnCollection] ON [TrnCollection].[SalesId] = [TrnSales].[Id]
	LEFT JOIN [TrnCollectionLine] ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
	LEFT JOIN [MstPayType] ON [TrnCollectionLine].[PayTypeId] = [MstPayType].[Id]
	LEFT JOIN [MstTax] ON [TrnSalesLine].[TaxId] = [MstTax].[Id] 
    LEFT JOIN [MstItem] ON [MstItem].[Id] = [TrnSalesLine].[ItemId] AND [TrnSalesLine].[ItemId] <> 1
    LEFT JOIN [MstDiscount] ON [MstDiscount].[Id] = [TrnSalesLine].[DiscountId]
	LEFT JOIN [TrnPaxTable] ON [TrnPaxTable].[SaleId] = [TrnSalesLine].[SalesId]
	LEFT JOIN (SELECT [SalesId], SUM([Quantity]) AS [Quantity] FROM [TrnSalesLine] GROUP BY [SalesId]) AS [TotalQuantity] ON [TrnSales].[Id] = [TotalQuantity].[SalesId]
	LEFT JOIN (SELECT [SalesId], SUM(([DiscountAmount]) * ([Quantity])) AS [TotalDiscountAmount] FROM [TrnSalesLine] GROUP BY [SalesId]) AS [TotalDiscount] ON [TrnSales].[Id] = [TotalDiscount].[SalesId]
	LEFT JOIN (SELECT [SalesId], SUM([Amount]) AS [GrossSalesAmount], SUM([Price]*[Quantity]) AS [TotalAmount] FROM [TrnSalesLine] GROUP BY [SalesId]) AS [GrossSales] ON [TrnSales].[Id] = [GrossSales].[SalesId]
	LEFT JOIN (SELECT [SalesId], SUM([Amount]) AS [ServiceCharge] FROM [TrnSalesLine] WHERE [ItemId] = 1 GROUP BY [SalesId]) AS [TotalServiceCharge] ON [TrnSales].[Id] = [TotalServiceCharge].[SalesId]
	WHERE 
	[TrnSales].[TerminalId] = ${Terminal}
	AND [TrnSales].[IsLocked] = 1 
	AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
	
	GROUP BY
	[TrnCollection].[CollectionNumber],
	[TotalQuantity].[Quantity],
	[TotalServiceCharge].[ServiceCharge]
  `
}

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
