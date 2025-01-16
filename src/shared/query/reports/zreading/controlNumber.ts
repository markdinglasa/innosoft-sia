export const ZControlNumber = ({ Dates, Terminal }: any): string => {
  return `
        SELECT  
    COUNT([SalesDate]) AS [ControlNumber]
FROM (
    SELECT 
        CAST([TrnSales].[SalesDate] AS DATE) AS [SalesDate],
        SUM(ROUND(
            CASE 
                WHEN 
                    (
                    [MstDiscount].[Discount] NOT IN ('Senior Citizen Discount', 'PWD')) 
                THEN [Price] 
                ELSE ([Price1] + [Price2LessTax]) 
            END * [Quantity], 2)) AS [GrossSales]
    FROM 
        [TrnSales]
    LEFT JOIN 
        [TrnSalesLine] ON [TrnSalesLine].[SalesId] = [TrnSales].[Id]
    INNER JOIN 
        [MstDiscount] ON [TrnSalesLine].[DiscountId] = [MstDiscount].[Id]
    WHERE 
        [TerminalId] = ${Terminal}
        AND CAST([TrnSales].[SalesDate] AS DATE) <= '${Dates}'
    GROUP BY 
        [TrnSales].[SalesDate]
) AS DailyGrossSales
WHERE 
    [GrossSales] > 0

        `
}
