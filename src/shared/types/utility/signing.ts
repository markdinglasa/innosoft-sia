export interface AccountNumber {
    accountNumber: string;
  }
  
export interface SigningKey {
  signingKey: string;
}

export interface KeyPair extends AccountNumber, SigningKey {}

export interface VerifySignatureParams {
  accountNumber: string;
  signature: string;
  unsignedData: any;
}
