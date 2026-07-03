export const AllianceTransactionDiscountsQuery: Function = ({ Terminal, Dates }): string => {
  return `
      WITH FilteredSales AS (
      SELECT s.*
      FROM TrnSales AS s
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
               ISNULL(c.IsCancelled,0) AS CollectionIsCancelled,
              ISNULL(c.IsReturn,0) AS CollectionIsReturn,
              ISNULL(c.Amount,0) AS CollectionAmount,
              ISNULL(cl.Amount,0) AS CollectionLineAmount,
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
              SUM(CASE WHEN d.Discount = 'Diplomat Discount' THEN d.DiscTotal ELSE 0 END) AS linediplomat,
              SUM(CASE WHEN d.Discount LIKE '%National Athlete%' OR d.Discount LIKE '%Coach%' THEN d.DiscTotal ELSE 0 END) AS linenac,
              SUM(CASE WHEN d.Discount LIKE '%Solo Parent%' THEN d.DiscTotal ELSE 0 END) AS linespd
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
          ISNULL(da.disc, 0) AS linedisc,
          0 AS linesenior,
          0 AS linepwd,
          0 AS linediplomat,
          da.disc AS disc,
          da.linesenior AS senior,
          da.linepwd AS pwd,
          da.linediplomat AS diplomat,
          da.linenac AS nac,
          da.linespd AS spd
      FROM FilteredSales s
      LEFT JOIN SalesLines sl ON s.Id = sl.SalesId
      LEFT JOIN Collections c ON s.Id = c.SalesId
      LEFT JOIN DiscountAggregates da ON s.Id = da.SalesId
      GROUP BY 
          c.CollectionNumber,
          da.disc,
          da.linesenior,
          da.linepwd,
          da.linediplomat,
          da.linenac,
          da.linespd
    `
}
