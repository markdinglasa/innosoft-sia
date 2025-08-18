export const AllianceTenderPerSalesQuery: Function = ({ Terminal, Dates }: any): string => {
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
