export const generateSMFileName = (IsDetails: boolean = false, Dates?: string) => {
  const date = new Date(Dates ?? '')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return IsDetails ? `${month}_${year}_TransactionDetails.csv` : `${month}_${year}_Transactions.csv`
}
