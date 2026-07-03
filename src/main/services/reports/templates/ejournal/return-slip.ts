import { formatDateFD, formatNumber } from '../../../../functions'
import { Details, Sale } from './types'

interface ReturnSlipProps {
  title: string
  saleItems: Sale[]
  details: Details
  grossSales: number
}

export const ReturnSlip = ({
  title = 'RETURN SLIP',
  saleItems,
  details,
  grossSales
}: ReturnSlipProps): string => {
  const items: string = saleItems
    .filter((item) => {
      return item.IsReturn
    })
    .map((item) => {
      return `${item?.ItemDescription ?? ''}                            ${formatNumber(item?.Amount)}\n${item?.ItemDetails ?? ''}`
    })
    .join('\n')
  try {
    return `

          ${title}
TERMINAL                       ${details?.Terminal ?? ''}
DOC. REF NO.                   ${details?.TransactionNumber ?? ''}
PREPARED BY                    ${details?.ReturnNumber}
RETURN DATE                    ${formatDateFD(new Date(details?.DateCreated))}
CUSTOMER                       ${details?.Customer ?? ''}
--------------------------------------------
ITEM                                  AMOUNT
${items}                          
--------------------------------------------
TOTAL                          ${formatNumber(Number(grossSales ?? '0'))}
    `
  } catch (error: unknown) {
    return `${(error as Error).message}`
  }
}
