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
        SUM(DISTINCT pa.cash + pa.credit + pa.charge + pa.giftcheck + pa.othertender) AS subtotal,
        vc.vat,
        0 AS exvat,
        vc.vat AS incvat,
        vc.localtax,
        vc.amusement,
        ISNULL(da.linenac, 0) AS nac,
        ISNULL(da.linespd, 0) AS spd,
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
                THEN sl.Amount
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
        ISNULL(s.Remarks,'NA') AS memo
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
        da.linenac,
        da.linespd,
        vc.vat,
        vc.localtax,
        vc.amusement,
        sc.ServiceCharge,
        s.Remarks
`
}
