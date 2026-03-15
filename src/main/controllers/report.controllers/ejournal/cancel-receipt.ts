import { Details, Sale, VATAnalysis } from '.'
import { formatDateFD, formatNumber } from '../../../functions'

interface CancelReceiptProps {
  title: string
  collectionNumber: string
  saleItems: Sale[]
  details: Details
  VATAnalysis: VATAnalysis
  totalItem: number
}

export const CancelReceipt = ({
  title = 'Cancelled Sales Receipt',
  collectionNumber,
  saleItems,
  details,
  VATAnalysis,
  totalItem
}: CancelReceiptProps): string => {
  const items: string = saleItems
    .map(
      (item) =>
        `${item?.ItemDescription ?? ''}                            ${formatNumber(item?.Amount)}\n${item?.ItemDetails ?? ''}`
    )
    .join('\n')

  try {
    return `

        ${title}
${formatDateFD(new Date(details?.DateCreated))}
TERMINAL                       ${details?.Terminal ?? ''}
SALES NUMBER                   ${details?.TransactionNumber ?? ''}
O.R. NUMBER                    ${collectionNumber}
CUSTOMER                       ${details?.Customer ?? ''}
TERMS                          ${details?.Terms ?? 'COD'}
USER                           ${details?.PreparedBy ?? ''}
CANCELLED BY                   ${details?.UpdatedBy ?? ''}
--------------------------------------------
ITEM                                  AMOUNT
${items}                          
--------------------------------------------
${totalItem}                          ${formatNumber(VATAnalysis?.GrossSales ?? '0')}`
  } catch (error: unknown) {
    return `${(error as Error).message}`
  }
}
