import { UserHeadCell } from '@shared/types'

export const userHeadCells: UserHeadCell[] = [
  {
    Id: 'UserName',
    numeric: false,
    disablePadding: true,
    label: 'Username'
  },
  {
    Id: 'FullName',
    numeric: false,
    disablePadding: false,
    label: 'Full Name'
  },
  {
    Id: 'UserCardNumber',
    numeric: true,
    disablePadding: false,
    label: 'Card Number'
  },
  {
    Id: 'EntryDateTime',
    numeric: true,
    disablePadding: false,
    label: 'Date Created'
  }
]
