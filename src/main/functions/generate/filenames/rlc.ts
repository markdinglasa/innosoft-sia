export const tidert = 's'
export const generateRLCFilename = (
  tenantId: string = '0000', // 8 digit
  terminal: string = '01',
  batchNo = 0,
  date: Date = new Date()
): string => {
  try {
    if (typeof tenantId !== 'string') {
      throw new Error('Invalid partnerCode: must be a number between 0 and 9999.')
    }

    if (typeof terminal !== 'number' || terminal < 0 || terminal > 99) {
      throw new Error('Invalid terminal: must be a number between 0 and 99.')
    }

    if (typeof batchNo !== 'number' || batchNo < 0) {
      throw new Error('Invalid batchNo: must be a single digit (0-9).')
    }

    const formattedPartnerCode = String(tenantId)
      .slice(0, 4)
      .replace(/[^a-zA-Z0-9]/g, '')
      .padStart(4, '0')
    const formattedTerminal = String(terminal).padStart(2, '0')

    const currentDate = new Date(date)
    if (isNaN(currentDate.getTime())) {
      throw new Error('Invalid date: Unable to retrieve the current date.')
    }

    const month = currentDate.getMonth() + 1
    const monthCode = month > 9 ? String.fromCharCode(64 + month - 9) : String(month)
    const day = String(currentDate.getDate()).padStart(2, '0')
    return `${formattedPartnerCode}${monthCode}${day}.${formattedTerminal}${batchNo}`
  } catch (error: any) {
    console.error(error.message)
    return 'error.txt'
  }
}
