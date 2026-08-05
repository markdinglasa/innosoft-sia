export const AllianceSalesEODQuery: Function = ({
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
          ${PreviousReading} + SUM(ROUND(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [nrgt],
          '${PreviousTax}' AS [previoustax],
          ${PreviousTax} + SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [newtax],
          '${PreviousTaxSales}' AS [previoustaxsale],
          ${PreviousTaxSales} + SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND ISNULL([TrnSalesLine].[TaxAmount],0)>0 AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [TrnSalesLine].[Amount]-[TrnSalesLine].[TaxAmount] ELSE (0) END),2)) AS [newtaxsale],
          '${PreviousNonTaxSales}' AS [previousnotaxsale],
          ${PreviousNonTaxSales} + SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND (ISNULL([TrnSalesLine].[TaxAmount],0)<1)) THEN [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [newnotaxsale],
          MIN((CONVERT(varchar, [TrnSales].[SalesDate], 23)+ ' '+CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8))) AS [opentime],
          MAX((CONVERT(varchar, [TrnSales].[SalesDate], 23)+ ' '+CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8))) AS [closetime],
          -- NOTE: gross = sum of all non-cancelled, non-returned line amounts.
          -- Z-Reading computes as NetSales + discounts; both should be equivalent.
          SUM(ROUND(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [gross],
          SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [vat],
          SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'LOCAL TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [localtax],
          SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'AMUSEMENT TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [amusement],
          '${EWT}' AS [ewt],
          SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND ISNULL([TrnSalesLine].[TaxAmount],0)>0 AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [TrnSalesLine].[Amount]-[TrnSalesLine].[TaxAmount] ELSE (0) END),2)) AS [taxsale],
          SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND (ISNULL([TrnSalesLine].[TaxAmount],0)<1)) THEN [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [notaxsale],
          '${ZeroRated}' AS [zerosale],
          SUM(ROUND(CASE WHEN([TrnSalesLine].[Price2]>0 AND ((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0))) THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))) ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] ELSE 0 END END,2)) AS [vatexempt],
          SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 3)) AS [void],
          COUNT(DISTINCT (CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSales].[Id] ELSE null END)) AS [voidcnt],
          
          SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND (ISNULL(TrnSalesLine.[DiscountAmount],0)>0) AND ([MstDiscount].[Discount] NOT IN ('Senior Citizen Discount','PWD')) THEN ISNULL((TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity), 0) ELSE 0 END) AS [disc],
          COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND (TrnSalesLine.[DiscountAmount]>0) AND ([MstDiscount].[Discount] NOT IN ('Senior Citizen Discount','PWD')) THEN ISNULL(TrnSalesLine.SalesId, null) ELSE null END) AS [disccnt],

          SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  2) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [refund],
          COUNT((CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  2) THEN  [TrnSalesLine].[Amount] ELSE null END)) AS [refundcnt],

          SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ([MstDiscount].[Discount] IN ('Senior Citizen Discount')) THEN (TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity) ELSE 0 END) AS [senior],
          COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ([MstDiscount].[Discount] IN ('Senior Citizen Discount')) THEN TrnSalesLine.SalesId ELSE null END) AS [seniorcnt],
          SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ([MstDiscount].[Discount] IN ('PWD')) THEN (TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity) ELSE 0 END) AS [pwd],
          COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ([MstDiscount].[Discount] IN ('PWD')) THEN TrnSalesLine.SalesId ELSE null END) AS [pwdcnt],
          SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ([MstDiscount].[Discount] IN ('Diplomat Discount')) THEN (TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity) ELSE 0 END) AS [diplomat],
          COUNT(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ([MstDiscount].[Discount] IN ('Diplomat Discount')) THEN TrnSalesLine.SalesId ELSE null END) AS [diplomatcnt],
          SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ([MstDiscount].[Discount] LIKE '%National Athlete%' OR [MstDiscount].[Discount] LIKE '%Coach%') THEN ROUND((TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity), 2) ELSE 0 END) AS [nac],
          COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND ([MstDiscount].[Discount] LIKE '%National Athlete%' OR [MstDiscount].[Discount] LIKE '%Coach%') THEN TrnSalesLine.SalesId ELSE null END) AS [naccnt],
          SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount] LIKE '%Solo Parent%' THEN ROUND((TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity), 2) ELSE 0 END) AS [spd],
          COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount] LIKE '%Solo Parent%' THEN TrnSalesLine.SalesId ELSE null END) AS [spdcnt],

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
