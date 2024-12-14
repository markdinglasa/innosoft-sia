export const roleType = async (T: string): Promise<string> => {
  const types: { [key: string]: string } = {
    administrator: 'administrator',
    cashier: 'cashier',
    teller: 'teller'
  }
  return types[T] || 'none'
}
export const licenseDuration = async (Day: string): Promise<number> => {
  const durations: { [key: string]: number } = {
    '7': 7,
    '14': 14,
    '30': 30,
    '90': 90,
    '365': 365
  }
  return durations[Day] || 0
}
export const businessType = async (T: string): Promise<string> => {
  const businessTypes: { [key: string]: string } = {
    retail: 'retail',
    restaurant: 'restaurant',
    hotel: 'hotel'
  }
  return businessTypes[T] || 'none'
}
export const alphanumeric = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9]/g, '')
}

export const generateSMFileName = (IsDetails: boolean = false) => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return IsDetails ? `${month}_${year}_TransactionDetails.csv` : `${month}_${year}_Transactions.csv`
}

export const formatDateYYYYMMDDHHMMSS = (CurrentDate: Date) => {
  const month = String(CurrentDate.getMonth() + 1).padStart(2, '0') // Months are 0-based, add 1
  const day = String(CurrentDate.getDate()).padStart(2, '0')
  const year = CurrentDate.getFullYear()
  const hour = String(CurrentDate.getHours()).padStart(2, '0')
  const min = String(CurrentDate.getMinutes()).padStart(2, '0')
  const sec = String(CurrentDate.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hour}${min}${sec}`
}
