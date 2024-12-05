import { VerifySignatureParams } from '@shared/types'
import { SignKeyPair } from 'tweetnacl'

export interface KeyPairDetails {
  publicKey: Uint8Array
  publicKeyHex: string
  signingKey: Uint8Array
  signingKeyHex: string
}

export interface FnApi {
  generateAccount(): KeyPairDetails
  generateSignature(message: string, signingKey: Uint8Array): string
  getKeyPairDetails(keyPair: SignKeyPair): KeyPairDetails
  stringToUint8Array(str: string): Uint8Array
  verifyBlockSignature(block: any): boolean
  verifySignature({ accountNumber, signature, unsignedData }: VerifySignatureParams): boolean
}
