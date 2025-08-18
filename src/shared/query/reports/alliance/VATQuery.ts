export const AllianceTransactionVATQuery: Function = ({ Terminal, Dates }): string => {
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
