import { KeyPairDetails, VerifySignatureParams } from '@shared/types';

export const generateAccount = (): KeyPairDetails => {
  return window.electron.fn.generateAccount();
};

export const generateSignature = (message: string, signingKey: Uint8Array): string => {
  return window.electron.fn.generateSignature(message, signingKey);
};

export const getKeyPairFromSigningKeyHex = (signingKeyHex: string): KeyPairDetails => {
  return window.electron.fn.getKeyPairFromSigningKeyHex(signingKeyHex);
};

export const verifyBlockSignature = (block: any): boolean => {
  return window.electron.fn.verifyBlockSignature(block);
};

export const verifySignature = ({accountNumber, signature, unsignedData}: VerifySignatureParams): boolean => {
  return window.electron.fn.verifySignature({accountNumber, signature, unsignedData});
};
