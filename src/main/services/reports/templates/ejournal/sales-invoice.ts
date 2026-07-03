import { calculateAge, formatDateFD, formatDateSlash, formatNumber } from '../../../../functions'
import { Details, Sale, VATAnalysis } from './types'

interface SalesInvoiceProps {
  title: string
  collectionNumber: string
  saleItems: Sale[]
  payments: string
  details: Details
  VATAnalysis: VATAnalysis
  totalItem: number
}

export const SalesInvoice = ({
  title = 'SALES INVOICE',
  collectionNumber,
  saleItems,
  payments,
  details,
  VATAnalysis,
  totalItem
}: SalesInvoiceProps): string => {
  let va: string = ''
  let less: string = ''

  switch (VATAnalysis?.Tax) {
    case 'VAT':
      less = `LESS: 12% VAT                       ${formatNumber(VATAnalysis?.TaxAmount ?? '0')}`
      va = `VAT ANALYSIS
VATatable Sales                             ${formatNumber(VATAnalysis?.VATSales) ?? 0}
VAT                                   ${formatNumber(VATAnalysis?.TaxAmount) ?? 0}
VAT-Exempt Sales                      ${formatNumber(VATAnalysis?.VATExempt) ?? 0}
Zero-Rated Sales                      ${formatNumber(VATAnalysis?.ZeroRated) ?? 0}
`
      break
    case 'NON-VAT':
    case 'VAT EXEMPT':
      va = `           EXEMPT`
      break
    case 'ZERO RATED':
      break
    default:
      va = `VAT ANALYSIS
VATatable Sales                             ${formatNumber(VATAnalysis?.VATSales) ?? 0}
VAT                                   ${formatNumber(VATAnalysis?.TaxAmount) ?? 0}
VAT-Exempt Sales                      ${formatNumber(VATAnalysis?.VATExempt) ?? 0}
Zero-Rated Sales                      ${formatNumber(VATAnalysis?.ZeroRated) ?? 0}
`
      break
  }

  const childAge = details?.SeniorCitizenChildBirthdate
    ? calculateAge(details?.SeniorCitizenChildBirthdate ?? '')
    : 'NA'
  const childBirthDate = details?.SeniorCitizenChildBirthdate
    ? formatDateSlash(new Date(details?.SeniorCitizenChildBirthdate ?? ''))
    : 'NA'
  const items: string = saleItems
    .map(
      (item) =>
        `${item?.ItemDescription ?? ''}                                   ${formatNumber(item?.Amount)}\n${item?.ItemDetails ?? ''}`
    )
    .join('\n')

  try {
    return `

                ${title}
              ${collectionNumber}
            ${formatDateFD(new Date(details?.DateCreated))}
--------------------------------------------
ITEM                                  AMOUNT
${items}
--------------------------------------------
TOTAL SALES                           ${formatNumber(VATAnalysis?.GrossSales ?? '0')}

${less}
LESS: DISCOUNT
(SC/PWD/NAAC/SP)                      ${formatNumber(VATAnalysis?.DiscountAmount ?? '0')}

TOTAL AMOUNT DUE                      ${formatNumber(VATAnalysis?.NetSales ?? '0')}

${payments}   
CHANGE                                ${formatNumber(VATAnalysis?.ChangeAmount ?? '0')}
# OF ITEMS                             ${totalItem}
--------------------------------------------
${va}
${
  details?.SeniorCitizenId === 'NA'
    ? ''
    : `--------------------------------------------
SENIOR / PWD / NAAC / SP INFORMATION
--------------------------------------------
TIN NO.                         ${details?.SeniorCitizenTINNumber ?? ''}
ID NO.                          ${details?.SeniorCitizenId ?? ''}
NAME                            ${details?.SeniorCitizenName ?? ''}
CHILD NAME                      ${details?.SeniorCitizenChildName ?? 'NA'}
CHILD AGE                       ${childAge}
BIRTHDATE                       ${childBirthDate}
SIGNATURE                       ${'________________________'}
`
}
--------------------------------------------
TRN. NO.                       ${details?.TransactionNumber ?? ''}
CASHIER                        ${details?.PreparedBy ?? ''}
TERMINAL                       ${details?.Terminal ?? ''}
SERVED BY                      ${details?.ServedBy ?? ''}
TABLE                          ${details?.TableCode ?? ''}
NO. PAX                        ${details?.PaxNumber ?? ''}
REWARD                         ${details?.IsReward ?? ''}
NAME                           ${details?.Customer ?? '________________________'}
ADDRESS                        ${details?.CustomerAddress ?? '________________________'}
                                ________________________
TIN                            ${details?.CustomerTIN ?? '________________________'}
TIME                           ${formatDateFD(new Date(details?.DateCreated))}
BUSINESS STYLE                 ${details?.BusinessStyle ?? '________________________'}

`
  } catch (error: unknown) {
    return `${(error as Error).message}`
  }
}
