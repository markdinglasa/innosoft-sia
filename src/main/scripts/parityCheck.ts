import ElectronStore from 'electron-store'
import fs from 'fs'
import os from 'os'
import path from 'path'
import {
  AllianceProductLineQuery,
  AllianceProductsQuery,
  AllianceTransactionOtherQuery,
  PreviousAmountsQuery,
  ZControlNumber
} from '../../shared/query'
import { AllianceSalesEOD, AllianceSalesProduct, AllianceSalesTrx, AllianceSalesTrxline, AllianceType } from '../../shared/types'
import {
  formatDateDash,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDHHMMSS,
  generateAllianceFilename
} from '../functions'
import { recordByQuery } from '../model'
import { AllianceReportService } from '../services/reports/AllianceReportService'
import { AppDataSource } from '../typeORM/configurations'
import { formatNumber } from '../utils/format'

async function setupDb() {
  const store = new ElectronStore({
    cwd: path.join(os.homedir(), 'Library', 'Application Support', 'innosoft-sia')
  })
  const config: any = store.get('database-configuration')
  if (!config) {
    throw new Error('Database config not found in electron-store. Please run the iSIA app first to configure connection.')
  }

  Object.assign(AppDataSource.options, {
    host: config.server,
    port: Number.parseInt(config.port || '1433', 10),
    username: config.user,
    password: config.password,
    database: config.name,
    synchronize: false
  })

  await AppDataSource.initialize()
  console.log('Database connected successfully for parity check!')
}

// Generate old XML format output
async function generateOldXml(
  dates: string,
  category: string,
  data: { Terminal: number; TenantCode: string; POSKey: string }
): Promise<string> {
  const Terminal = data.Terminal
  const Dates = formatDateDash(new Date(dates))
  
  // Re-run old controller queries
  const ControlNumber = await recordByQuery(ZControlNumber({ Dates, Terminal }))
  const controlNumber = ControlNumber?.List?.[0]?.ControlNumber ?? 0
  
  // Re-fetch salesQ (this is AllianceSalesEODQuery)
  // We need to fetch details to feed into AllianceSalesEODQuery
  const prevAmount = await recordByQuery(PreviousAmountsQuery({ Dates, Terminal }))
  const PreviousReading = prevAmount?.List?.[0]?.PreviousReading ?? 0
  const PreviousTax = prevAmount?.List?.[0]?.previoustax ?? 0
  const PreviousTaxSale = prevAmount?.List?.[0]?.previoustaxsale ?? 0
  const PreviousNoTaxSale = prevAmount?.List?.[0]?.previousnotaxsale ?? 0

  // We need daily aggregates (Tender totals, service charge, etc.)
  // Let's call the database to fetch these for the old query inputs
  const TenderResponse = await recordByQuery(`
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
    FROM [TrnSales] 
    LEFT JOIN TrnCollection ON [TrnSales].[Id] = [TrnCollection].[SalesId]
    LEFT JOIN TrnCollectionLine ON [TrnCollectionLine].[CollectionId] = [TrnCollection].[Id]
    LEFT JOIN [MstPayType] ON [MstPayType].Id = [TrnCollectionLine].[PayTypeId]
    WHERE [TrnSales].[IsLocked] = 1 AND [TrnCollection].[IsLocked] = 1 AND [TrnCollectionLine].[Amount] > 0 AND ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn],0) = 0 AND [TrnSales].[TerminalId] = ${Terminal} AND CAST([TrnSales].[SalesDate] AS DATE) = '${Dates}'
  `)

  const ServiceChargeResponse = await recordByQuery(`
    SELECT SUM([TrnSalesLine].[Amount]) AS [ServiceCharge], COUNT([TrnSalesLine].[Amount]) AS [ServiceChargeCount]
    FROM TrnSalesLine
    LEFT JOIN TrnCollection ON TrnCollection.[SalesId] = [TrnSalesLine].[SalesId]
    WHERE [ItemId] = 1 AND TrnCollection.[IsLocked] = 1 AND TrnCollection.[TerminalId] = ${Terminal} AND CAST(TrnCollection.CollectionDate AS DATE) = '${Dates}'
  `)

  const TenderData = TenderResponse?.List?.[0] || {}
  const ServiceData = ServiceChargeResponse?.List?.[0] || {}

  const salesQ = `
    SELECT 
    MIN((REPLACE(CONVERT(varchar, [TrnSales].[SalesDate], 23),'-','')+''+REPLACE(CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8),':',''))) AS [date],
    '${controlNumber}' AS [zcounter],
    '${PreviousReading}' AS [previousnrgt],
    ${PreviousReading} + SUM(ROUND(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [nrgt],
    '${PreviousTax}' AS [previoustax],
    ${PreviousTax} + SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [newtax],
    '${PreviousTaxSale}' AS [previoustaxsale],
    ${PreviousTaxSale} + SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND ISNULL([TrnSalesLine].[TaxAmount],0)>0 AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [TrnSalesLine].[Amount]-[TrnSalesLine].[TaxAmount] ELSE (0) END),2)) AS [newtaxsale],
    '${PreviousNoTaxSale}' AS [previousnotaxsale],
    ${PreviousNoTaxSale} + SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND (ISNULL([TrnSalesLine].[TaxAmount],0)<1)) THEN [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [newnotaxsale],
    MIN((CONVERT(varchar, [TrnSales].[SalesDate], 23)+ ' '+CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8))) AS [opentime],
    MAX((CONVERT(varchar, [TrnSales].[SalesDate], 23)+ ' '+CONVERT(varchar, [TrnSalesLine].[SalesLineTimeStamp], 8))) AS [closetime],
    SUM(ROUND(CASE WHEN( ISNULL([TrnCollection].[IsCancelled],0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) = 0) THEN [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [gross],
    SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) ) THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [vat],
    SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'LOCAL TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [localtax],
    SUM(ROUND(CASE WHEN(([TrnSalesLine].[TaxRate] > 0) AND (ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstTax].[Tax] = 'AMUSEMENT TAX') THEN [TrnSalesLine].[TaxAmount] ELSE 0 END, 2)) AS [amusement],
    '0' AS [ewt],
    SUM(ROUND((CASE WHEN((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0) AND [MstDiscount].[Discount]<>'Senior Citizen Discount' And [MstDiscount].[Discount]<>'PWD' AND ISNULL([TrnSalesLine].[TaxAmount],0)>0 AND (ISNULL([TrnCollection].[IsReturn], 0) = 0)) THEN [TrnSalesLine].[Amount]-[TrnSalesLine].[TaxAmount] ELSE (0) END),2)) AS [taxsale],
    SUM(ROUND(CASE WHEN(((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0)) AND (ISNULL([TrnSalesLine].[TaxAmount],0)<1)) THEN [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [notaxsale],
    '0' AS [zerosale],
    SUM(ROUND(CASE WHEN([TrnSalesLine].[Price2]>0 AND ((ISNULL([TrnCollection].[IsReturn], 0) =  0 AND ISNULL([TrnSales].[IsCancelled],0) = 0))) THEN [TrnSalesLine].[quantity]*([TrnSalesLine].[price2lesstax]-([TrnSalesLine].[price2lesstax]*([TrnSalesLine].[DiscountRate]/100))) ELSE CASE WHEN ([TrnSalesLine].[TaxId]=5) THEN [TrnSalesLine].[Amount] ELSE 0 END END,2)) AS [vatexempt],
    SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 3)) AS [void],
    COUNT(DISTINCT (CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 1) THEN  [TrnSalesLine].[Amount] ELSE null END)) AS [voidcnt],
    
    SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND (ISNULL(TrnSalesLine.[DiscountAmount],0)>0) AND ([MstDiscount].[Discount] NOT IN ('Senior Citizen Discount','PWD')) THEN ISNULL((TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity), 0) ELSE 0 END) AS [disc],
    COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND (TrnSalesLine.[DiscountAmount]>0) AND ([MstDiscount].[Discount] NOT IN ('Senior Citizen Discount','PWD')) THEN ISNULL(TrnSalesLine.SalesId, null) ELSE null END) AS [disccnt],

    SUM(ROUND(CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  2) THEN  [TrnSalesLine].[Amount] ELSE 0 END, 2)) AS [refund],
    COUNT((CASE WHEN(ISNULL([TrnSales].[IsCancelled], 0) = 0 AND ISNULL([TrnCollection].[IsReturn], 0) =  2) THEN  [TrnSalesLine].[Amount] ELSE null END)) AS [refundcnt],

    SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Senior Citizen Discount')) THEN (TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity) ELSE 0 END) AS [senior],
    COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Senior Citizen Discount')) THEN TrnSalesLine.SalesId ELSE null END) AS [seniorcnt],
    SUM(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('PWD')) THEN (TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity) ELSE 0 END) AS [pwd],
    COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('PWD')) THEN TrnSalesLine.SalesId ELSE null END) AS [pwdcnt],
    SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Diplomat Discount')) THEN (TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity) ELSE 0 END) AS [diplomat],
    COUNT(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] IN ('Diplomat Discount')) THEN TrnSalesLine.SalesId ELSE null END) AS [diplomatcnt],
    SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] LIKE '%National Athlete%' OR [MstDiscount].[Discount] LIKE '%Coach%') THEN ROUND((TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity), 2) ELSE 0 END) AS [nac],
    COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND ([MstDiscount].[Discount] LIKE '%National Athlete%' OR [MstDiscount].[Discount] LIKE '%Coach%') THEN TrnSalesLine.SalesId ELSE null END) AS [naccnt],
    SUM(CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND [MstDiscount].[Discount] LIKE '%Solo Parent%' THEN ROUND((TrnSalesLine.DiscountAmount * TrnSalesLine.Quantity), 2) ELSE 0 END) AS [spd],
    COUNT(DISTINCT CASE WHEN (ISNULL([TrnCollection].[IsReturn],0) = 0 OR ISNULL([TrnSales].[IsCancelled],0) = 1) AND [MstDiscount].[Discount] LIKE '%Solo Parent%' THEN TrnSalesLine.SalesId ELSE null END) AS [spdcnt],

    '${ServiceData.ServiceCharge ?? 0}' AS [service],
    '${ServiceData.ServiceChargeCount ?? 0}' AS [servicecnt],
    MIN(REPLACE([TrnCollection].[CollectionNumber], '-', '') ) AS [receiptstart],
    MAX(REPLACE([TrnCollection].[CollectionNumber], '-', '') ) AS [receiptend],
    COUNT(DISTINCT [TrnSales].[Id]) AS [trxcnt],
    '${TenderData.CashSales ?? 0}' AS [cash],
    '${TenderData.CashSalesCount ?? 0}' AS [cashcnt],
    '${TenderData.CreditSales ?? 0}' AS [credit],
    '${TenderData.CreditSalesCount ?? 0}' AS [creditcnt],
    '${TenderData.ChargeSales ?? 0}' AS [charge],
    '${TenderData.ChargeSalesCount ?? 0}' AS [chargecnt],
    '${TenderData.GiftCertificateSales ?? 0}' AS [giftcheck],
    '${TenderData.GiftCertificateSalesCount ?? 0}' AS [giftcheckcnt],
    '${TenderData.OtherTenderSales ?? 0}' AS [othertender],
    '${TenderData.OtherTenderSalesCount ?? 0}' AS [othertendercnt]
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

  const salesResponse = await recordByQuery(salesQ)
  const trxQ = AllianceTransactionOtherQuery({ Terminal, Dates })
  const trxR = await recordByQuery(trxQ)
  const merge2 = trxR.List || []

  const SalesId = `
  <id>
    <tenantid>${data.TenantCode ?? 'NA'}</tenantid>
    <key>${data.POSKey ?? 'NA'}</key>
    <tmid>${data.Terminal.toString().padStart(4, '0') ?? 1}</tmid>
    <doc>SALES_EOD</doc>
  </id>
  `
  const products = AllianceProductsQuery({ Terminal, Dates })
  const productsResponse = await recordByQuery(products)

  const Master = (productsResponse?.List || [])
    .map((item: AllianceSalesProduct) => {
      return [
        `<product>
          <sku>${item?.sku ?? 0}</sku>
          <name>${item?.name ?? 'NA'}</name>
          <inventory>${item?.inventory ?? 0}</inventory>
          <price>${Number(item?.price ?? 0).toFixed(2)}</price>
          <category>${category ?? '01'}</category>
        </product>`
      ].join('\n')
    })
    .join('\n')

  let sales = (salesResponse?.List || [])
    .map((item: AllianceSalesEOD) => {
      return [
        `<date>${formatDateYYYYMMDD(new Date(dates)) ?? ''}</date>`,
        `<zcounter>${item?.zcounter ?? '0'}</zcounter>`,
        `<previousnrgt>${formatNumber(item.previousnrgt)}</previousnrgt>`,
        `<nrgt>${formatNumber(item.nrgt)}</nrgt>`,
        `<previoustax>${formatNumber(item.previoustax)}</previoustax>`,
        `<newtax>${formatNumber(item.newtax)}</newtax>`,
        `<previoustaxsale>${formatNumber(item.previoustaxsale)}</previoustaxsale>`,
        `<newtaxsale>${formatNumber(item.newtaxsale)}</newtaxsale>`,
        `<previousnotaxsale>${formatNumber(item.previousnotaxsale)}</previousnotaxsale>`,
        `<newnotaxsale>${formatNumber(item.newnotaxsale)}</newnotaxsale>`,
        `<opentime>${formatDateYYYYMMDDHHMMSS(new Date(item.opentime))}</opentime>`,
        `<closetime>${formatDateYYYYMMDDHHMMSS(new Date(item.closetime))}</closetime>`,
        `<gross>${formatNumber(item.gross)}</gross>`,
        `<vat>${formatNumber(item.vat)}</vat>`,
        `<localtax>${formatNumber(item.localtax)}</localtax>`,
        `<amusement>${formatNumber(item.amusement)}</amusement>`,
        `<ewt>${formatNumber(item.ewt)}</ewt>`,
        `<taxsale>${formatNumber(item.taxsale)}</taxsale>`,
        `<notaxsale>${formatNumber(item.notaxsale)}</notaxsale>`,
        `<zerosale>${formatNumber(item.zerosale)}</zerosale>`,
        `<void>${formatNumber(item.void)}</void>`,
        `<voidcnt>${Number(item.voidcnt)}</voidcnt>`,
        `<disc>${formatNumber(item.disc)}</disc>`,
        `<disccnt>${Number(item.disccnt)}</disccnt>`,
        `<refund>${formatNumber(item.refund)}</refund>`,
        `<refundcnt>${Number(item.refundcnt)}</refundcnt>`,
        `<senior>${formatNumber(item.senior)}</senior>`,
        `<seniorcnt>${Number(item.seniorcnt)}</seniorcnt>`,
        `<pwd>${formatNumber(item.pwd)}</pwd>`,
        `<pwdcnt>${Number(item.pwdcnt)}</pwdcnt>`,
        `<diplomat>${formatNumber(item.diplomat)}</diplomat>`,
        `<diplomatcnt>${Number(item.diplomatcnt)}</diplomatcnt>`,
        `<nac>${formatNumber(item.nac ?? 0)}</nac>`,
        `<naccnt>${Number(item.naccnt ?? 0)}</naccnt>`,
        `<spd>${formatNumber(item.spd ?? 0)}</spd>`,
        `<spdcnt>${Number(item.spdcnt ?? 0)}</spdcnt>`,
        `<service>${formatNumber(item.service)}</service>`,
        `<servicecnt>${Number(item.servicecnt)}</servicecnt>`,
        `<receiptstart>${item.receiptstart ?? 'NA'}</receiptstart>`,
        `<receiptend>${item.receiptend ?? 'NA'}</receiptend>`,
        `<trxcnt>${Number(item.trxcnt)}</trxcnt>`,
        `<cash>${formatNumber(item.cash)}</cash>`,
        `<cashcnt>${Number(item.cashcnt)}</cashcnt>`,
        `<credit>${formatNumber(item.credit)}</credit>`,
        `<creditcnt>${Number(item.creditcnt)}</creditcnt>`,
        `<charge>${formatNumber(item.charge)}</charge>`,
        `<chargecnt>${Number(item.chargecnt)}</chargecnt>`,
        `<giftcheck>${formatNumber(item.giftcheck)}</giftcheck>`,
        `<giftcheckcnt>${Number(item.giftcheckcnt)}</giftcheckcnt>`,
        `<othertender>${formatNumber(item.othertender)}</othertender>`,
        `<othertendercnt>${Number(item.othertendercnt)}</othertendercnt>`
      ].join('\n')
    })
    .join('\n')

  const trx = await Promise.all(
    merge2.map(async (item: AllianceSalesTrx) => {
      const ReceiptNumber = item?.receiptno
      const trxline = AllianceProductLineQuery({ Terminal, Dates, ReceiptNumber })
      const trxlineResponse = await recordByQuery(trxline)
      const SalesLine = (trxlineResponse?.List || [])
        .map((lineItem: AllianceSalesTrxline) => {
          return `
          <line>
            <sku>${lineItem?.sku ?? 'NA'}</sku>
            <qty>${lineItem?.qty ?? 0}</qty>
            <unitprice>${formatNumber(lineItem?.unitprice)}</unitprice>
            <disc>${formatNumber(lineItem?.disc)}</disc>
            <senior>${formatNumber(lineItem?.senior)}</senior>
            <pwd>${formatNumber(lineItem?.pwd)}</pwd>
            <diplomat>${formatNumber(lineItem?.diplomat)}</diplomat>
            <nac>${formatNumber(lineItem?.nac ?? 0)}</nac>
            <spd>${formatNumber(lineItem?.spd ?? 0)}</spd>
            <taxtype>${lineItem?.taxtype ?? 'NA'}</taxtype>
            <tax>${formatNumber(lineItem?.tax)}</tax>
            <memo>${lineItem?.memo ?? 'NA'}</memo>
            <total>${formatNumber(lineItem?.total)}</total>
            <choicetype></choicetype>
          </line>`
        })
        .join('\n')
      return [
        `
        <trx>
          <receiptno>${item?.receiptno}</receiptno>
          <void>${formatNumber(item?.void)}</void>
          <cash>${formatNumber(item?.cash)}</cash>
          <credit>${formatNumber(item?.credit)}</credit>
          <charge>${formatNumber(item?.charge)}</charge>
          <giftcheck>${formatNumber(item?.giftcheck)}</giftcheck>
          <othertender>${formatNumber(item?.othertender)}</othertender>
          <linedisc>${formatNumber(item?.linedisc)}</linedisc>
          <linesenior>${formatNumber(item?.linesenior)}</linesenior>
          <evat>${formatNumber(item?.evat)}</evat>
          <linepwd>${formatNumber(item?.linepwd)}</linepwd>
          <linediplomat>${formatNumber(item?.linediplomat)}</linediplomat>
          <nac>${formatNumber(item?.nac ?? 0)}</nac>
          <spd>${formatNumber(item?.spd ?? 0)}</spd>
          <subtotal>${formatNumber(item?.subtotal)}</subtotal>
          <disc>${formatNumber(item?.disc)}</disc>
          <senior>${formatNumber(item?.senior)}</senior>
          <pwd>${formatNumber(item?.pwd)}</pwd>
          <diplomat>${formatNumber(item?.diplomat)}</diplomat>
          <vat>${formatNumber(item?.vat)}</vat>
          <exvat>${formatNumber(item?.exvat)}</exvat>
          <incvat>${formatNumber(item?.incvat)}</incvat>
          <localtax>${formatNumber(item?.localtax)}</localtax>
          <amusement>${formatNumber(item?.amusement)}</amusement>
          <service>${formatNumber(item?.service)}</service>
          <taxsale>${formatNumber(item?.taxsale)}</taxsale>
          <notaxsale>${formatNumber(item?.notaxsale)}</notaxsale>
          <taxexsale>${formatNumber(item?.taxexsale)}</taxexsale>
          <taxincsale>${formatNumber(item.taxincsale)}</taxincsale>
          <zerosale>${formatNumber(item?.zerosale)}</zerosale>
          <customercount>${item?.customercnt ?? 1}</customercount>
          <gross>${formatNumber(item?.gross)}</gross>
          <refund>${formatNumber(item?.refund)}</refund>
          <taxrate>${formatNumber(item?.taxrate)}</taxrate>
          <posted>${item?.posted ?? 'NA'}</posted>
          <qty>${item?.qty ?? 0}</qty>
          <created>${formatNumber(item?.created ?? 0)}</created>
          <memo>${item?.memo && item.memo !== 'NA' ? item.memo : ''}</memo>
          ${SalesLine}
        </trx>`
      ].join('\n')
    })
  )

  if (!sales || sales.length === 0) {
    sales = [
      `<date>${formatDateYYYYMMDD(new Date(Dates))}</date>`,
      `<zcounter>${controlNumber}</zcounter>`,
      `<previousnrgt>${Number(PreviousReading).toFixed(2) ?? '0.00'}</previousnrgt>`,
      `<nrgt>${Number(PreviousReading).toFixed(2) ?? '0.00'}</nrgt>`,
      `<previoustax>${Number(PreviousTax).toFixed(2) ?? '0.00'}</previoustax>`,
      `<newtax>${Number(PreviousTax).toFixed(2) ?? '0.00'}</newtax>`,
      `<previoustaxsale>${Number(PreviousTaxSale).toFixed(2) ?? '0.00'}</previoustaxsale>`,
      `<newtaxsale>${Number(PreviousTaxSale).toFixed(2) ?? '0.00'}</newtaxsale>`,
      `<previousnotaxsale>${Number(PreviousNoTaxSale).toFixed(2) ?? '0.00'}</previousnotaxsale>`,
      `<newnotaxsale>${Number(PreviousNoTaxSale).toFixed(2) ?? '0.00'}</newnotaxsale>`,
      `<opentime>${formatDateYYYYMMDDHHMMSS(new Date(Dates)) ?? 'NA'}</opentime>`,
      `<closetime>${formatDateYYYYMMDDHHMMSS(new Date(Dates)) ?? 'NA'}</closetime>`,
      `<gross>${Number(0).toFixed(2) ?? '0.00'}</gross>`,
      `<vat>${Number(0).toFixed(2) ?? '0.00'}</vat>`,
      `<localtax>${Number(0).toFixed(2) ?? '0.00'}</localtax>`,
      `<amusement>${Number(0).toFixed(2) ?? '0.00'}</amusement>`,
      `<ewt>${Number(0).toFixed(2) ?? '0.00'}</ewt>`,
      `<taxsale>${Number(0).toFixed(2) ?? '0.00'}</taxsale>`,
      `<notaxsale>${Number(0).toFixed(2) ?? '0.00'}</notaxsale>`,
      `<zerosale>${Number(0).toFixed(2) ?? '0.00'}</zerosale>`,
      `<void>${Number(0).toFixed(2) ?? '0.00'}</void>`,
      `<voidcnt>${Number(0)}</voidcnt>`,
      `<disc>${Number(0).toFixed(2) ?? '0.00'}</disc>`,
      `<disccnt>${Number(0)}</disccnt>`,
      `<refund>${Number(0).toFixed(2) ?? '0.00'}</refund>`,
      `<refundcnt>${Number(0)}</refundcnt>`,
      `<senior>${Number(0).toFixed(2) ?? '0.00'}</senior>`,
      `<seniorcnt>${Number(0)}</seniorcnt>`,
      `<pwd>${Number(0).toFixed(2) ?? '0.00'}</pwd>`,
      `<pwdcnt>${Number(0)}</pwdcnt>`,
      `<diplomat>${Number(0).toFixed(2) ?? '0.00'}</diplomat>`,
      `<diplomatcnt>${Number(0)}</diplomatcnt>`,
      `<nac>${Number(0).toFixed(2)}</nac>`,
      `<naccnt>${Number(0)}</naccnt>`,
      `<spd>${Number(0).toFixed(2)}</spd>`,
      `<spdcnt>${Number(0)}</spdcnt>`,
      `<service>${Number(0).toFixed(2) ?? '0.00'}</service>`,
      `<servicecnt>${Number(0)}</servicecnt>`,
      `<receiptstart>${'0'}</receiptstart>`,
      `<receiptend>${'0'}</receiptend>`,
      `<trxcnt>${Number(0)}</trxcnt>`,
      `<cash>${Number(0).toFixed(2) ?? '0.00'}</cash>`,
      `<cashcnt>${Number(0)}</cashcnt>`,
      `<credit>${Number(0).toFixed(2) ?? '0.00'}</credit>`,
      `<creditcnt>${Number(0)}</creditcnt>`,
      `<charge>${Number(0).toFixed(2) ?? '0.00'}</charge>`,
      `<chargecnt>${Number(0)}</chargecnt>`,
      `<giftcheck>${Number(0).toFixed(2) ?? '0.00'}</giftcheck>`,
      `<giftcheckcnt>${Number(0)}</giftcheckcnt>`,
      `<othertender>${Number(0).toFixed(2) ?? '0.00'}</othertender>`,
      `<othertendercnt>${Number(0)}</othertendercnt>`
    ].join('\n')
  }

  return `
  <root>
    ${SalesId}
    <sales>
    ${sales}
    ${trx.join('\n') ?? ''}
    </sales>
    <master>
    ${Master}
    </master>
  </root>
  `
}

async function runParityCheck() {
  try {
    await setupDb()

    // Test settings (use a test date where you have sales data, e.g. '2026-07-03')
    const dates = '2026-07-03'
    const category = '01'
    const data = {
      Terminal: 1,
      TenantCode: 'TESTTENANT',
      POSKey: 'TESTPOSKEY'
    }

    console.log(`\n--- Starting Parity Check for Date: ${dates} ---`)

    // 1. Generate old XML
    console.log('Generating Old XML using direct SQL queries...')
    const oldXml = await generateOldXml(dates, category, data)
    const oldFilePath = path.join(__dirname, 'old_sales_eod_parity.xml')
    fs.writeFileSync(oldFilePath, oldXml, 'utf8')
    console.log(`Saved Old XML to: ${oldFilePath}`)

    // 2. Generate new XML
    console.log('Generating New XML using TypeORM service...')
    const tempDir = __dirname
    const newFileName = generateAllianceFilename(
      AllianceType.salesEOD,
      data.TenantCode,
      data.Terminal,
      await AllianceReportService.getControlNumber(data.Terminal, dates),
      dates
    )
    const newFilePath = path.join(tempDir, newFileName)
    
    // Call the service class to write the new XML
    await AllianceReportService.generateSalesEOD(tempDir, dates, category, data)
    console.log(`Saved New XML to: ${newFilePath}`)

    const newXml = fs.readFileSync(newFilePath, 'utf8')

    // 3. String comparison
    const cleanStr = (str: string) => str.replace(/\s+/g, '')
    const isMatched = cleanStr(oldXml) === cleanStr(newXml)

    if (isMatched) {
      console.log('\n✅ SUCCESS: XML outputs match perfectly (ignoring whitespace differences)!')
    } else {
      console.error('\n❌ FAILURE: XML outputs do not match.')
      console.log('\n--- Old XML Snippet (First 500 chars) ---')
      console.log(oldXml.substring(0, 500))
      console.log('\n--- New XML Snippet (First 500 chars) ---')
      console.log(newXml.substring(0, 500))
      process.exit(1)
    }

    process.exit(0)
  } catch (error) {
    console.error('Error running parity check:', error)
    process.exit(1)
  }
}

runParityCheck()
