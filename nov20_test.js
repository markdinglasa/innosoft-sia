const sql = require('mssql');
const fs = require('fs');

async function run() {
  const config = {
    user: 'sa',
    password: 'innosoft',
    server: 'localhost',
    database: 'pos13',
    port: 1433,
    options: {
      encrypt: true,
      trustServerCertificate: true,
      cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
      }
    }
  };

  try {
    const pool = await sql.connect(config);
    const r1 = await pool.request().query(`
      SELECT 
        c.TerminalId,
        SUM(sl.Amount) as NetSales,
        SUM(CASE WHEN i.ItemDescription = 'SERVICE CHARGE' OR t.Tax = 'NON-VAT' THEN sl.Amount ELSE 0 END) as NonVatService,
        SUM(CASE WHEN t.Tax = 'VAT' AND i.ItemDescription != 'SERVICE CHARGE' THEN sl.Amount - sl.TaxAmount ELSE 0 END) as VatSales,
        SUM(CASE WHEN t.Tax = 'VAT' AND i.ItemDescription != 'SERVICE CHARGE' THEN sl.TaxAmount ELSE 0 END) as VatAmount,
        SUM(CASE WHEN d.Discount IN ('Senior Citizen Discount', 'PWD') OR t.Tax IN ('VAT EXEMPT', 'VAT EXEMPT SALES') THEN sl.Amount ELSE 0 END) as VatExempt
      FROM TrnSalesLine sl
      INNER JOIN TrnSales s ON sl.SalesId = s.Id
      LEFT JOIN TrnCollection c ON c.SalesId = s.Id
      LEFT JOIN MstTax t ON sl.TaxId = t.Id
      LEFT JOIN MstDiscount d ON sl.DiscountId = d.Id
      LEFT JOIN MstItem i ON sl.ItemId = i.Id
      WHERE CAST(c.CollectionDate AS DATE) = '2024-11-20'
        AND s.IsLocked = 1
        AND c.IsLocked = 1
        AND c.IsCancelled = 0
        AND COALESCE(c.IsReturned, 0) = 0
      GROUP BY c.TerminalId
    `);
    
    fs.writeFileSync('nov20_terminals.txt', JSON.stringify({ raw: r1.recordset }, null, 2));
  } catch (err) {
    fs.writeFileSync('nov20_terminals.txt', String(err));
  } finally {
    sql.close();
  }
}

run();
