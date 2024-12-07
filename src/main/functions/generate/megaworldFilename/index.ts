import { MWFileType } from '@shared/types'

export const generateMWFilename = (
  type: MWFileType,
  partnerCode: string = '00000000', // 8 digit
  terminal: string = '01',
  batchNo = 0
): string => {
  try {
    if (typeof type !== 'string' || type.length !== 1) {
      throw new Error('Invalid type: must be a single character string.')
    }

    if (typeof partnerCode !== 'string') {
      throw new Error('Invalid partnerCode: must be a number between 0 and 9999.')
    }

    if (typeof terminal !== 'number' || terminal < 0 || terminal > 99) {
      throw new Error('Invalid terminal: must be a number between 0 and 99.')
    }

    if (typeof batchNo !== 'number' || batchNo < 0 || batchNo > 9) {
      throw new Error('Invalid batchNo: must be a single digit (0-9).')
    }

    const formattedPartnerCode = String(partnerCode).padStart(8, '0')
    const formattedTerminal = String(terminal).padStart(2, '0')
    const formattedBatchNo = String(batchNo)

    const currentDate = new Date()
    if (isNaN(currentDate.getTime())) {
      throw new Error('Invalid date: Unable to retrieve the current date.')
    }

    const month = currentDate.getMonth() + 1
    const monthCode = month > 9 ? String.fromCharCode(64 + month - 9) : String(month)
    const day = String(currentDate.getDate()).padStart(2, '0')
    return `${type}${formattedPartnerCode}${formattedTerminal}${formattedBatchNo}.${monthCode}${day}`
  } catch (error: any) {
    return 'error.txt'
  }
}
