import { Details, Sale, VATAnalysis } from '.'
import { calculateAge, formatDateFD, formatDateSlash, formatNumber } from '../../../functions'

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

  switch (VATAnalysis?.Tax) {
    case 'VAT':
      va = `VAT ANALYSIS
VATatable SALES                             ${formatNumber(VATAnalysis?.VATSales) ?? 0}
VAT                                   ${formatNumber(VATAnalysis?.TaxAmount) ?? 0}`
      break
    case 'NON-VAT':
    case 'VAT EXEMPT':
      va = `VAT EXEMPT SALES                      ${formatNumber(VATAnalysis?.VATExempt) ?? 0}
${VATAnalysis?.ServiceCharge > 0 ? `SERVICE CHARGE                        ${formatNumber(VATAnalysis?.ServiceCharge) ?? 0}` : ''}
THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX
`
      break
    case 'ZERO RATED':
      va = ''
      break
    default:
      va = `VAT ANALYSIS
VATatable SALES                             ${formatNumber(VATAnalysis?.VATSales) ?? 0}
VAT                                   ${formatNumber(VATAnalysis?.TaxAmount) ?? 0}`
      break
  }

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
TOTAL SALES                           ${formatNumber(VATAnalysis?.NetSales ?? '0')}
TOTAL DISCOUNT                        ${formatNumber(VATAnalysis?.DiscountAmount ?? '0')}
--------------------------------------------
${payments}   
# OF ITEMS                             ${totalItem}        
--------------------------------------------
CHANGE                                ${formatNumber(VATAnalysis?.ChangeAmount ?? '0')}
--------------------------------------------
${va}
--------------------------------------------
SENIOR / PWD / NAAC / SP INFORMATION
--------------------------------------------
TIN NO.                         ${details?.SeniorCitizenTINNumber ?? ''}
ID NO.                          ${details?.SeniorCitizenId ?? ''}
NAME                            ${details?.SeniorCitizenName ?? ''}
CHILD NAME                      ${details?.SeniorCitizenChildName ?? ''}
CHILD AGE                       ${details?.SeniorCitizenChildBirthdate ? calculateAge(details?.SeniorCitizenChildBirthdate ?? '') : ''}
BIRTHDATE                       ${details?.SeniorCitizenChildBirthdate ? formatDateSlash(new Date(details?.SeniorCitizenChildBirthdate ?? '')) : ''}
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
SIGNATURE                      ${'________________________'}
`
  } catch (error: unknown) {
    return `${(error as Error).message}`
  }
}
