import { Id } from './generic'

export interface UnsignedBlock extends Id {
  signature: string
}

export interface Block {
  amount: number
  payload: any
  recipient: string
  sender: string
  transaction_fee: number
}
