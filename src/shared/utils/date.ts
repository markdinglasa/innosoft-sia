/**
 * Converts an ISO formatted date string to MM/DD/YYYY format.
 * @param isoDate - The ISO formatted date string.
 * @returns The formatted date string in MM/DD/YYYY format.
 */
export const convertDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${month}/${day}/${year}`
}
