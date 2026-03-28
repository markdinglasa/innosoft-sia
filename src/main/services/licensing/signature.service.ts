import { createVerify } from 'crypto';

export class SignatureService {
  /**
   * Verifies the digital signature of a payload.
   * @param payload The data that was signed.
   * @param signature The base64-encoded signature.
   * @param publicKey The PEM-encoded RSA public key.
   */
  static verifySignature(payload: string, signature: string, publicKey: string): boolean {
    if (!signature) return false;
    try {
      const verifier = createVerify('SHA256');
      verifier.update(payload);
      return verifier.verify(publicKey, signature, 'base64');
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }
}
