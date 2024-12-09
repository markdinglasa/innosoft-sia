export const mwDailySales = ({ Dates, Terminal, MallParnterCodeId }: any): string => {
  return `SELECT 
        '${MallParnterCodeId}' AS [MallParnterCodeId],
        [TrnSales].[TerminalId] AS [Terminal],
        '${Dates}' AS [Date]
    FROM  [TrnSales]

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
