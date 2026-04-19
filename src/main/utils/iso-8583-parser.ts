/**
 * Simplified ISO 8583 Parser for Debit/Credit Memo logging.
 * Maps standard ISO 8583 fields to the internal MemoRecord structure.
 */
export interface Iso8583Message {
  mti: string
  fields: Record<number, string>
}

export interface ParsedMemoData {
  amount: number
  terminalId: string
  particulars: string
  cardType: string
  authorizationCode: string
  memoType: 'DEBIT' | 'CREDIT'
}

export class Iso8583Parser {
  /**
   * Maps a raw ISO 8583 message object to internal domain data.
   * In a real implementation, this would handle byte-level parsing of the message.
   */
  static parse(message: Iso8583Message): ParsedMemoData {
    // Field 4: Transaction Amount (n 12, usually cents)
    const rawAmount = message.fields[4] || '0'
    const amount = Number.parseInt(rawAmount, 10) / 100

    // Field 42: Card Acceptor Terminal Identification (ans 8)
    const terminalId = message.fields[42] || 'UNKNOWN'

    // Field 43: Card Acceptor Name/Location (ans 40)
    const particulars = message.fields[43]?.trim() || 'POS TRANSACTION'

    // Field 2: Primary Account Number (PAN) - used to determine Card Type
    const pan = message.fields[2] || ''
    const cardType = this.identifyCardType(pan)

    // Field 38: Authorization Identification Response (an 6)
    const authorizationCode = message.fields[38] || ''

    // MTI 0200/0210/0100/0110 generally represent financial transactions
    // For this implementation, we distinguish DEBIT/CREDIT based on transaction type codes
    // if available, otherwise default to DEBIT for card purchases.
    const memoType = this.determineMemoType(message.mti, message.fields[3])

    return {
      amount,
      terminalId,
      particulars,
      cardType,
      authorizationCode,
      memoType
    }
  }

  private static identifyCardType(pan: string): string {
    if (pan.startsWith('4')) return 'VISA'
    if (pan.startsWith('5')) return 'MASTERCARD'
    if (pan.startsWith('34') || pan.startsWith('37')) return 'AMEX'
    if (pan.startsWith('6011')) return 'DISCOVER'
    return 'OTHER'
  }

  private static determineMemoType(_mti: string, processingCode?: string): 'DEBIT' | 'CREDIT' {
    // Simplified logic: 0200 with processing code 00 (Purchase) is a DEBIT to the merchant (money in)
    // or DEBIT to the customer (money out).
    // In our context, 'DEBIT' increases a balance, 'CREDIT' decreases it.
    // We'll follow the business requirement for memo types.
    if (processingCode?.startsWith('20')) return 'CREDIT' // Refund
    return 'DEBIT' // Purchase
  }
}

