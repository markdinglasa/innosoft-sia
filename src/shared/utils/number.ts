export const formatNumber = (number: number): string => {
  if (typeof number !== 'number') {
    throw new Error('Input must be a number')
  }

  return number
    .toFixed(2) // Ensure two decimal places
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    .toString() // Add commas
}
