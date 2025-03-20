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
		0 + SUM(ROUND(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [nrgt],
		'${PreviousTax}' AS [previoustax],
		0 + SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [newtax],
		'${PreviousTaxSales}' AS [previoustaxsale],
		0 + SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND ISNULL([TrnSalesLine].[TaxAmount],0)>0 AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [TrnSalesLine].[Amount]-[TrnSalesLine].[TaxAmount] ELSE (0) END),2)) AS [newtaxsale],
		'${PreviousNonTaxSales}' AS [previousnotaxsale],
		0 + SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND ([TrnSalesLine].[TaxAmount]<=0)) THEN[TrnCollection].[Amount] ELSE 0 END, 5)) AS [newnotaxsale],
		MIN((CONVERT(varchar, [TrnSales].[SalesDate], 23)+ ' '+CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8))) AS [opentime],
		MAX((CONVERT(varchar, [TrnSales].[SalesDate], 23)+ ' '+CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8))) AS [closetime],
		SUM(ROUND(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 5)) AS [gross],
		SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [vat],
		SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'LOCAL TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [localtax],
		SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'AMUSEMENT TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 4)) AS [amusement],
		'${EWT}' AS [ewt],
		SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND ISNULL([TrnSalesLine].[TaxAmount],0)>0 AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [TrnSalesLine].[Amount]-[TrnSalesLine].[TaxAmount] ELSE (0) END),2)) AS [taxsale],
		SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND ([TrnSalesLine].[TaxAmount]<=0)) THEN[TrnCollection].[Amount] ELSE 0 END, 5)) AS [notaxsale],
		'${ZeroRated}' AS [zerosale],
		SUM(ROUND(CASE WHEN([TrnSalesLine].[Price2]>0 AND ((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0))) THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))) ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] ELSE 0 END END,5)) AS [vatexempt],
		SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 3)) AS [void],
		COUNT(DISTINCT (CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSalesLine].[Amount] ELSE null END)) AS [voidcnt],
		SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND (TrnSalesLine.[DiscountAmount]>0) AND ([MstDiscount].[Discount] NOT IN ('Senior Citizen Discount','PWD')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], 0) ELSE 0 END) AS [disc],
		COUNT(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND (TrnSalesLine.[DiscountAmount]>0) AND ([MstDiscount].[Discount] NOT IN ('Senior Citizen Discount','PWD')) THEN ISNULL([TotalDiscount].[TotalDiscountAmount], null) ELSE null END) AS [disccnt],
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
            AND [TrnCollection].[TerminalId] = ${Terminal}
            AND CAST([TrnCollection].[CollectionDate] AS DATE) = '${Dates}'
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
    SUM(CASE WHEN (TrnSalesLine.TaxAmount < 1) THEN  [TrnSalesLine].[Quantity] * [TrnSalesLine].[Price2LessTax] ELSE [TrnSalesLine].[Quantity] * [TrnSalesLine].[Price] END)  AS [total]
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

export const AllianceTransactionVATQuery = ({ Terminal, Dates }) => {
  return `
   WITH FilteredSales AS (
    SELECT *
    FROM TrnSales
    WHERE TerminalId = ${Terminal}
      AND IsLocked = 1
      AND CAST(SalesDate AS DATE) = '${Dates}'
    ),
  SalesLines AS (
      SELECT 
          sl.Id,
          sl.SalesId,
          sl.Amount,
          sl.TaxAmount,
          sl.TaxRate,
          sl.Price,
          sl.Price2,
          sl.Price2LessTax,
          sl.Quantity,
          sl.DiscountRate,
          sl.TaxId,
          sl.ItemId,
          sl.DiscountAmount,
          sl.SalesLineTimeStamp,
          sl.Price1,
          mstDisc.Discount,
          mstTax.Tax
      FROM TrnSalesLine sl
      LEFT JOIN MstDiscount mstDisc ON sl.DiscountId = mstDisc.Id
      LEFT JOIN MstTax mstTax ON sl.TaxId = mstTax.Id
      WHERE sl.SalesId IN (SELECT Id FROM FilteredSales)
  ),
  Collections AS (
      SELECT
          c.Id,
          c.SalesId,
          c.CollectionNumber,
          c.IsCancelled AS CollectionIsCancelled,
          c.IsReturn AS CollectionIsReturn,
          c.Amount AS CollectionAmount,
          cl.Amount AS CollectionLineAmount,
          cl.PayTypeId,
          mstPay.PayType
      FROM TrnCollection c
      LEFT JOIN TrnCollectionLine cl ON c.Id = cl.CollectionId
      LEFT JOIN MstPayType mstPay ON cl.PayTypeId = mstPay.Id
      WHERE c.SalesId IN (SELECT Id FROM FilteredSales)
  ),

  VatCalculations AS (
  SELECT
    v.SalesId,
    SUM(CASE
        WHEN v.TaxRate > 0
              THEN v.TaxAmount
        ELSE 0
    END) AS vat,
    SUM(CASE
        WHEN v.TaxRate > 0 
              AND v.Tax = 'LOCAL TAX'
              THEN v.TaxAmount
        ELSE 0
    END) AS localtax,
    SUM(CASE
        WHEN v.TaxRate > 0
              AND v.Tax = 'AMUSEMENT TAX'
              THEN v.TaxAmount
        ELSE 0
    END) AS amusement
	FROM (
        SELECT DISTINCT
            sl.SalesId,
			sl.TaxRate,
			sl.TaxAmount,
			mstTax.Tax
        FROM SalesLines sl
        LEFT JOIN FilteredSales s ON sl.SalesId = s.Id
		LEFT JOIN Collections c ON s.Id = c.SalesId
		LEFT JOIN MstTax mstTax ON sl.TaxId = mstTax.Id
        WHERE (c.CollectionIsReturn = 0 OR s.IsCancelled = 1)
    ) v
    GROUP BY v.SalesId
)
SELECT
    REPLACE(c.CollectionNumber, '-', '') AS receiptno,
	   vc.vat,
    0 AS exvat,
    vc.vat AS incvat,
    vc.localtax,
    vc.amusement,
    0 AS ewt
FROM FilteredSales s
LEFT JOIN SalesLines sl ON s.Id = sl.SalesId
LEFT JOIN Collections c ON s.Id = c.SalesId
LEFT JOIN VatCalculations vc ON s.Id = vc.SalesId
GROUP BY 
    c.CollectionNumber,
	    vc.vat,
    vc.localtax,
    vc.amusement
  `
}
export const AllianceTransactionOtherQuery = ({ Terminal, Dates }) => {
  return `
   WITH FilteredSales AS (
        SELECT *
        FROM TrnSales
        WHERE TerminalId = ${Terminal}
        AND IsLocked = 1
        AND CAST(SalesDate AS DATE) = '${Dates}'
    ),
    SalesLines AS (
        SELECT 
            sl.Id,
            sl.SalesId,
            sl.Amount,
            sl.TaxAmount,
            sl.TaxRate,
            sl.Price,
            sl.Price2,
            sl.Price2LessTax,
            sl.Quantity,
            sl.DiscountRate,
            sl.TaxId,
            sl.ItemId,
            sl.DiscountAmount,
            sl.SalesLineTimeStamp,
            sl.Price1,
            mstDisc.Discount,
            mstTax.Tax
        FROM TrnSalesLine sl
        LEFT JOIN MstDiscount mstDisc ON sl.DiscountId = mstDisc.Id
        LEFT JOIN MstTax mstTax ON sl.TaxId = mstTax.Id
        WHERE sl.SalesId IN (SELECT Id FROM FilteredSales)
    ),
    Collections AS (
        SELECT
            c.Id,
            c.SalesId,
            c.CollectionNumber,
            c.IsCancelled AS CollectionIsCancelled,
            c.IsReturn AS CollectionIsReturn,
            c.Amount AS CollectionAmount,
            cl.Amount AS CollectionLineAmount,
            cl.PayTypeId,
            mstPay.PayType
        FROM TrnCollection c
        LEFT JOIN TrnCollectionLine cl ON c.Id = cl.CollectionId
        LEFT JOIN MstPayType mstPay ON cl.PayTypeId = mstPay.Id
        WHERE c.SalesId IN (SELECT Id FROM FilteredSales)
    ),
    PaymentAggregates AS (
        SELECT
            SalesId,
            CollectionNumber,
            SUM(CASE
                WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                    AND PayType = 'Cash'
                    THEN CASE 
                            WHEN CollectionLineAmount > CollectionAmount 
                                THEN CollectionAmount 
                                ELSE CollectionLineAmount 
                        END
                ELSE 0
            END) AS cash,
            SUM(CASE
                WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                    AND PayType = 'Credit Card'
                    THEN CollectionLineAmount
                ELSE 0
            END) AS credit,
            SUM(CASE
                WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                    AND PayType = 'Charge'
                    THEN CollectionLineAmount
                ELSE 0
            END) AS charge,
            SUM(CASE
                WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                    AND PayType = 'Gift Certificate'
                    THEN CollectionLineAmount
                ELSE 0
            END) AS giftcheck,
            SUM(CASE
                WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                    AND PayType NOT IN ('Credit Card', 'Cash', 'Gift Certificate', 'Charge')
                    THEN CollectionLineAmount
                ELSE 0
            END) AS othertender
        FROM Collections
        GROUP BY SalesId, CollectionNumber
    ),
    -- Pre-aggregate discounts without duplicates
    DiscountAggregates AS (
        SELECT 
            d.SalesId,
            SUM(d.DiscTotal) AS TotalDiscountAmount,
            SUM(CASE WHEN d.Discount = 'Senior Citizen Discount' THEN d.DiscTotal ELSE 0 END) AS linesenior,
            SUM(CASE WHEN d.Discount = 'PWD' THEN d.DiscTotal ELSE 0 END) AS linepwd,
            SUM(CASE WHEN d.Discount = 'Diplomat Discount' THEN d.DiscTotal ELSE 0 END) AS linediplomat
        FROM (
            SELECT DISTINCT
                sl.SalesId,
                sl.Discount,
                sl.DiscountAmount * sl.Quantity AS DiscTotal
            FROM SalesLines sl
            JOIN FilteredSales s ON sl.SalesId = s.Id
            JOIN Collections c ON s.Id = c.SalesId
            WHERE (c.CollectionIsReturn = 0 OR s.IsCancelled = 1)
        ) d
        GROUP BY d.SalesId
    ),
    ServiceChargeAgg AS (
        SELECT
            SalesId,
            SUM(Amount) AS ServiceCharge
        FROM SalesLines
        WHERE ItemId = 1
        GROUP BY SalesId
    ),
    TotalQuantity AS (
        SELECT
            SalesId,
            SUM(Quantity) AS Quantity
        FROM SalesLines
        GROUP BY SalesId
    ),
    PaxTable AS (
        SELECT
            SaleId,
            MAX(TotalPax) AS TotalPax
        FROM TrnPaxTable
        WHERE SaleId IN (SELECT Id FROM FilteredSales)
        GROUP BY SaleId
    ),

    VatCalculations AS (
        SELECT
            v.SalesId,
            SUM(CASE
                WHEN v.TaxRate > 0
                    THEN v.TaxAmount
                ELSE 0
            END) AS vat,
            SUM(CASE
                WHEN v.TaxRate > 0 
                    AND v.Tax = 'LOCAL TAX'
                    THEN v.TaxAmount
                ELSE 0
            END) AS localtax,
            SUM(CASE
                WHEN v.TaxRate > 0
                    AND v.Tax = 'AMUSEMENT TAX'
                    THEN v.TaxAmount
                ELSE 0
            END) AS amusement
        FROM (
            SELECT DISTINCT
                sl.SalesId,
                sl.TaxRate,
                sl.TaxAmount,
                mstTax.Tax
            FROM SalesLines sl
            LEFT JOIN FilteredSales s ON sl.SalesId = s.Id
            LEFT JOIN Collections c ON s.Id = c.SalesId
            LEFT JOIN MstTax mstTax ON sl.TaxId = mstTax.Id
            WHERE (c.CollectionIsReturn = 0 OR s.IsCancelled = 1)
        ) v
        GROUP BY v.SalesId
    )
    SELECT
        REPLACE(c.CollectionNumber, '-', '') AS receiptno,
        SUM(CASE WHEN s.IsCancelled = 1 THEN ROUND(sl.Amount, 2) ELSE 0 END) AS void,
        pa.cash,
        pa.credit,
        pa.charge,
        pa.giftcheck,
        pa.othertender,
        0 AS evat,
        SUM(DISTINCT CASE
            WHEN c.CollectionIsCancelled = 0 AND c.CollectionIsReturn = 0 AND sl.TaxAmount > 0
                THEN sl.Price * sl.Quantity
            ELSE sl.Price2LessTax * sl.Quantity
        END) AS subtotal,
        vc.vat,
        0 AS exvat,
        vc.vat AS incvat,
        vc.localtax,
        vc.amusement,
        0 AS ewt,
        sc.ServiceCharge AS service,
        SUM(DISTINCT CASE
            WHEN c.CollectionIsCancelled = 0 AND c.CollectionIsReturn = 0 
                AND sl.TaxAmount > 0
                THEN sl.Amount - sl.TaxAmount
            ELSE 0
        END) AS taxsale,
        SUM(DISTINCT CASE
            WHEN c.CollectionIsCancelled = 0 AND c.CollectionIsReturn = 0 
                AND sl.TaxAmount <= 0
                THEN c.CollectionAmount
            ELSE 0
        END) AS notaxsale,
        0 AS taxexsale,
        SUM(DISTINCT CASE
            WHEN sl.TaxAmount > 0 AND (c.CollectionIsReturn = 0 AND s.IsCancelled = 0)
                THEN sl.Amount - sl.TaxAmount
            ELSE 0
        END) AS taxincsale,
        0 AS zerosale,
        SUM(DISTINCT CASE
            WHEN sl.Price2 > 0 AND (c.CollectionIsReturn = 0 AND s.IsCancelled = 0)
                THEN sl.Quantity * (sl.Price2LessTax - (sl.Price2LessTax * (sl.DiscountRate / 100)))
            ELSE CASE WHEN sl.TaxId = 5 THEN sl.Amount ELSE 0 END
        END) AS vatexempt,
        MAX(pt.TotalPax) AS customercnt,
        SUM(DISTINCT CASE
            WHEN (ISNULL(s.IsReturn,0) = 0 AND ISNULL(s.IsCancelled,0) = 0) THEN c.CollectionAmount
            ELSE 0
        END) AS gross,
        SUM(DISTINCT CASE WHEN s.IsReturn = 2 THEN s.Amount ELSE 0 END) AS refund,
        MAX(CASE
            WHEN c.CollectionIsCancelled = 0 AND c.CollectionIsReturn = 0 
                AND sl.Discount NOT IN ('Senior Citizen Discount', 'PWD')
                THEN sl.TaxRate
            ELSE 0
        END) AS taxrate,
        MIN(REPLACE(CONVERT(varchar, s.SalesDate, 23) 
                + REPLACE(CONVERT(varchar, sl.SalesLineTimeStamp, 8), ':', ''), '-', '')) AS posted,
        tq.Quantity AS qty,
        1 AS created,
        'NA' AS memo
    FROM FilteredSales s
    LEFT JOIN SalesLines sl ON s.Id = sl.SalesId
    LEFT JOIN Collections c ON s.Id = c.SalesId
    LEFT JOIN PaymentAggregates pa ON c.SalesId = pa.SalesId 
                                AND c.CollectionNumber = pa.CollectionNumber
    LEFT JOIN DiscountAggregates da ON s.Id = da.SalesId
    LEFT JOIN ServiceChargeAgg sc ON s.Id = sc.SalesId
    LEFT JOIN TotalQuantity tq ON s.Id = tq.SalesId
    LEFT JOIN PaxTable pt ON s.Id = pt.SaleId
    LEFT JOIN VatCalculations vc ON s.Id = vc.SalesId
    GROUP BY 
        c.CollectionNumber,
        tq.Quantity,
        sc.ServiceCharge,
        pa.cash,
        pa.credit,
        pa.charge,
        pa.giftcheck,
        pa.othertender,
        da.TotalDiscountAmount,
        da.linesenior,
        da.linepwd,
        da.linediplomat,
        vc.vat,
        vc.localtax,
        vc.amusement,
        sc.ServiceCharge
`
}
export const AllianceTransactionDiscountsQuery = ({ Terminal, Dates }) => {
  return `
    WITH FilteredSales AS (
    SELECT *
    FROM TrnSales
    WHERE TerminalId = ${Terminal}
      AND IsLocked = 1
      AND CAST(SalesDate AS DATE) = '${Dates}'
    ),
        SalesLines AS (
        SELECT 
            sl.Id,
            sl.SalesId,
            sl.Amount,
            sl.TaxAmount,
            sl.TaxRate,
            sl.Price,
            sl.Price2,
            sl.Price2LessTax,
            sl.Quantity,
            sl.DiscountRate,
            sl.TaxId,
            sl.ItemId,
            sl.DiscountAmount,
            sl.SalesLineTimeStamp,
            sl.Price1,
            mstDisc.Discount,
            mstTax.Tax
        FROM TrnSalesLine sl
        LEFT JOIN MstDiscount mstDisc ON sl.DiscountId = mstDisc.Id
        LEFT JOIN MstTax mstTax ON sl.TaxId = mstTax.Id
        WHERE sl.SalesId IN (SELECT Id FROM FilteredSales)
    ),
    Collections AS (
        SELECT
            c.Id,
            c.SalesId,
            c.CollectionNumber,
            c.IsCancelled AS CollectionIsCancelled,
            c.IsReturn AS CollectionIsReturn,
            c.Amount AS CollectionAmount,
            cl.Amount AS CollectionLineAmount,
            cl.PayTypeId,
            mstPay.PayType
        FROM TrnCollection c
        LEFT JOIN TrnCollectionLine cl ON c.Id = cl.CollectionId
        LEFT JOIN MstPayType mstPay ON cl.PayTypeId = mstPay.Id
        WHERE c.SalesId IN (SELECT Id FROM FilteredSales)
    ),

    DiscountAggregates AS (
        SELECT 
            d.SalesId,
			SUM(CASE WHEN d.Discount <> 'Senior Citizen Discount' AND d.Discount <> 'PWD' THEN d.DiscTotal ELSE 0 END) AS disc,
            SUM(CASE WHEN d.Discount = 'Senior Citizen Discount' THEN d.DiscTotal ELSE 0 END) AS linesenior,
            SUM(CASE WHEN d.Discount = 'PWD' THEN d.DiscTotal ELSE 0 END) AS linepwd,
            SUM(CASE WHEN d.Discount = 'Diplomat Discount' THEN d.DiscTotal ELSE 0 END) AS linediplomat
        FROM (
            SELECT DISTINCT
                sl.SalesId,
                sl.Discount,
                sl.DiscountAmount * sl.Quantity AS DiscTotal
            FROM SalesLines sl
            JOIN FilteredSales s ON sl.SalesId = s.Id
            JOIN Collections c ON s.Id = c.SalesId
            WHERE (c.CollectionIsReturn = 0 OR s.IsCancelled = 1)
        ) d
        GROUP BY d.SalesId
    )
    SELECT
        REPLACE(c.CollectionNumber, '-', '') AS receiptno,
        0 AS linedisc,
        0 AS linesenior,
        0 AS linepwd,
        0 AS linediplomat,
        da.disc AS disc,
        da.linesenior AS senior,
        da.linepwd AS pwd,
        da.linediplomat AS diplomat
    FROM FilteredSales s
    LEFT JOIN SalesLines sl ON s.Id = sl.SalesId
    LEFT JOIN Collections c ON s.Id = c.SalesId
    LEFT JOIN DiscountAggregates da ON s.Id = da.SalesId
    GROUP BY 
        c.CollectionNumber,
        da.disc,
        da.linesenior,
        da.linepwd,
        da.linediplomat
  `
}

export const AllianceTransactionQuery = ({ Terminal, Dates }) => {
  return `
WITH FilteredSales AS (
    SELECT *
    FROM TrnSales
    WHERE TerminalId = ${Terminal}
      AND IsLocked = 1
      AND CAST(SalesDate AS DATE) = '${Dates}'
),
SalesLines AS (
    SELECT 
        sl.Id,
        sl.SalesId,
        sl.Amount,
        sl.TaxAmount,
        sl.TaxRate,
        sl.Price,
        sl.Price2,
        sl.Price2LessTax,
        sl.Quantity,
        sl.DiscountRate,
        sl.TaxId,
        sl.ItemId,
        sl.DiscountAmount,
        sl.SalesLineTimeStamp,
        sl.Price1,
        mstDisc.Discount,
        mstTax.Tax
    FROM TrnSalesLine sl
    LEFT JOIN MstDiscount mstDisc ON sl.DiscountId = mstDisc.Id
    LEFT JOIN MstTax mstTax ON sl.TaxId = mstTax.Id
    WHERE sl.SalesId IN (SELECT Id FROM FilteredSales)
),
Collections AS (
    SELECT
        c.Id,
        c.SalesId,
        c.CollectionNumber,
        c.IsCancelled AS CollectionIsCancelled,
        c.IsReturn AS CollectionIsReturn,
        c.Amount AS CollectionAmount,
        cl.Amount AS CollectionLineAmount,
        cl.PayTypeId,
        mstPay.PayType
    FROM TrnCollection c
    LEFT JOIN TrnCollectionLine cl ON c.Id = cl.CollectionId
    LEFT JOIN MstPayType mstPay ON cl.PayTypeId = mstPay.Id
    WHERE c.SalesId IN (SELECT Id FROM FilteredSales)
),
PaymentAggregates AS (
    SELECT
        SalesId,
        CollectionNumber,
        SUM(CASE
            WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                 AND PayType = 'Cash'
                 THEN CASE 
                        WHEN CollectionLineAmount > CollectionAmount 
                             THEN CollectionAmount 
                             ELSE CollectionLineAmount 
                      END
            ELSE 0
        END) AS cash,
        SUM(CASE
            WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                 AND PayType = 'Credit Card'
                 THEN CollectionLineAmount
            ELSE 0
        END) AS credit,
        SUM(CASE
            WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                 AND PayType = 'Charge'
                 THEN CollectionLineAmount
            ELSE 0
        END) AS charge,
        SUM(CASE
            WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                 AND PayType = 'Gift Certificate'
                 THEN CollectionLineAmount
            ELSE 0
        END) AS giftcheck,
        SUM(CASE
            WHEN CollectionIsCancelled = 0 AND CollectionIsReturn = 0
                 AND PayType NOT IN ('Credit Card', 'Cash', 'Gift Certificate', 'Charge')
                 THEN CollectionLineAmount
            ELSE 0
        END) AS othertender
    FROM Collections
    GROUP BY SalesId, CollectionNumber
),
-- Pre-aggregate discounts without duplicates
DiscountAggregates AS (
    SELECT 
        d.SalesId,
        SUM(d.DiscTotal) AS TotalDiscountAmount,
        SUM(CASE WHEN d.Discount = 'Senior Citizen Discount' THEN d.DiscTotal ELSE 0 END) AS linesenior,
        SUM(CASE WHEN d.Discount = 'PWD' THEN d.DiscTotal ELSE 0 END) AS linepwd,
        SUM(CASE WHEN d.Discount = 'Diplomat Discount' THEN d.DiscTotal ELSE 0 END) AS linediplomat
    FROM (
        SELECT DISTINCT
            sl.SalesId,
            sl.Discount,
            sl.DiscountAmount * sl.Quantity AS DiscTotal
        FROM SalesLines sl
        JOIN FilteredSales s ON sl.SalesId = s.Id
        JOIN Collections c ON s.Id = c.SalesId
        WHERE (c.CollectionIsReturn = 0 OR s.IsCancelled = 1)
    ) d
    GROUP BY d.SalesId
),
ServiceChargeAgg AS (
    SELECT
        SalesId,
        SUM(Amount) AS ServiceCharge
    FROM SalesLines
    WHERE ItemId = 1
    GROUP BY SalesId
),
TotalQuantity AS (
    SELECT
        SalesId,
        SUM(Quantity) AS Quantity
    FROM SalesLines
    GROUP BY SalesId
),
PaxTable AS (
    SELECT
        SaleId,
        MAX(TotalPax) AS TotalPax
    FROM TrnPaxTable
    WHERE SaleId IN (SELECT Id FROM FilteredSales)
    GROUP BY SaleId
),

VatCalculations AS (
    SELECT
        v.SalesId,
        SUM(CASE
            WHEN v.TaxRate > 0
                 THEN v.TaxAmount
            ELSE 0
        END) AS vat,
        SUM(CASE
            WHEN v.TaxRate > 0 
                 AND v.Tax = 'LOCAL TAX'
                 THEN v.TaxAmount
            ELSE 0
        END) AS localtax,
        SUM(CASE
            WHEN v.TaxRate > 0
                 AND v.Tax = 'AMUSEMENT TAX'
                 THEN v.TaxAmount
            ELSE 0
        END) AS amusement
	FROM (
        SELECT DISTINCT
            sl.SalesId,
			sl.TaxRate,
			sl.TaxAmount,
			mstTax.Tax
        FROM SalesLines sl
        LEFT JOIN FilteredSales s ON sl.SalesId = s.Id
		LEFT JOIN Collections c ON s.Id = c.SalesId
		LEFT JOIN MstTax mstTax ON sl.TaxId = mstTax.Id
        WHERE (c.CollectionIsReturn = 0 OR s.IsCancelled = 1)
    ) v
    GROUP BY v.SalesId
)
SELECT
    REPLACE(c.CollectionNumber, '-', '') AS receiptno,
    SUM(CASE WHEN s.IsCancelled = 1 THEN ROUND(sl.Amount, 2) ELSE 0 END) AS void,
    pa.cash,
    pa.credit,
    pa.charge,
    pa.giftcheck,
    pa.othertender,
    SUM(DISTINCT CASE
        WHEN c.CollectionIsCancelled = 0 AND c.CollectionIsReturn = 0 
             THEN c.CollectionAmount
        ELSE 0
    END) AS subtotal,
    da.linesenior AS senior,
    da.linepwd AS pwd,
    da.linediplomat AS diplomat,
    vc.vat,
    0 AS exvat,
    vc.vat AS incvat,
    vc.localtax,
    vc.amusement,
    0 AS ewt,
    sc.ServiceCharge AS service,
    SUM(DISTINCT CASE
        WHEN c.CollectionIsCancelled = 0 AND c.CollectionIsReturn = 0 
             AND sl.TaxAmount > 0
             THEN sl.Amount
        ELSE 0
    END) AS taxsale,
    SUM(DISTINCT CASE
        WHEN c.CollectionIsCancelled = 0 AND c.CollectionIsReturn = 0 
             AND sl.TaxAmount <= 0
             THEN c.CollectionAmount
        ELSE 0
    END) AS notaxsale,
    0 AS taxexsale,
    SUM(DISTINCT CASE
        WHEN sl.TaxAmount > 0 AND (c.CollectionIsReturn = 0 AND s.IsCancelled = 0)
             THEN c.CollectionAmount
        ELSE 0
    END) AS taxincsale,
    0 AS zerosale,
    SUM(DISTINCT CASE
        WHEN sl.Price2 > 0 AND (c.CollectionIsReturn = 0 AND s.IsCancelled = 0)
             THEN sl.Quantity * (sl.Price2LessTax - (sl.Price2LessTax * (sl.DiscountRate / 100)))
        ELSE CASE WHEN sl.TaxId = 5 THEN sl.Amount ELSE 0 END
    END) AS vatexempt,
    MAX(pt.TotalPax) AS customercnt,
    SUM(DISTINCT CASE
        WHEN (s.IsReturn = 2 OR s.IsCancelled = 1) THEN 0
        ELSE (CASE WHEN sl.Discount NOT IN ('Senior Citizen Discount', 'PWD') 
                   THEN sl.Price 
                   ELSE (sl.Price1 + sl.Price2LessTax) 
              END) * sl.Quantity
    END) AS gross,
    SUM(CASE WHEN s.IsReturn = 2 THEN sl.Amount ELSE 0 END) AS refund,
    MAX(CASE
        WHEN c.CollectionIsCancelled = 0 AND c.CollectionIsReturn = 0 
             AND sl.Discount NOT IN ('Senior Citizen Discount', 'PWD')
             THEN sl.TaxRate
        ELSE 0
    END) AS taxrate,
    MIN(REPLACE(CONVERT(varchar, s.SalesDate, 23) 
             + REPLACE(CONVERT(varchar, sl.SalesLineTimeStamp, 8), ':', ''), '-', '')) AS posted,
    tq.Quantity AS qty,
    1 AS created,
    'NA' AS memo
FROM FilteredSales s
LEFT JOIN SalesLines sl ON s.Id = sl.SalesId
LEFT JOIN Collections c ON s.Id = c.SalesId
LEFT JOIN PaymentAggregates pa ON c.SalesId = pa.SalesId 
                              AND c.CollectionNumber = pa.CollectionNumber
LEFT JOIN DiscountAggregates da ON s.Id = da.SalesId
LEFT JOIN ServiceChargeAgg sc ON s.Id = sc.SalesId
LEFT JOIN TotalQuantity tq ON s.Id = tq.SalesId
LEFT JOIN PaxTable pt ON s.Id = pt.SaleId
LEFT JOIN VatCalculations vc ON s.Id = vc.SalesId
GROUP BY 
    c.CollectionNumber,
    tq.Quantity,
    sc.ServiceCharge,
    pa.cash,
    pa.credit,
    pa.charge,
    pa.giftcheck,
    pa.othertender,
    da.TotalDiscountAmount,
    da.linesenior,
    da.linepwd,
    da.linediplomat,
    vc.vat,
    vc.localtax,
    vc.amusement,
    sc.ServiceCharge;

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
