export const generateSMFileName = (IsDetails: boolean = false) => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return IsDetails ? `${month}_${year}_TransactionDetails.csv` : `${month}_${year}_Transactions.csv`
}
