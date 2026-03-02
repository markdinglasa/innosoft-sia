import CryptoJS from 'crypto-js'

export function decryptInput(input: string, encryptionPhrase: string): string {
  if (!input || typeof input !== 'string') return input || ''

  const trimmedInput = input.trim()
  if (!trimmedInput) return ''

  const iterations = 1000
  const keySize = 256 / 32

  try {
    const decodedBuffer = CryptoJS.enc.Base64.parse(trimmedInput)

    if (decodedBuffer.sigBytes < 32) {
      return trimmedInput
    }

    // Extract salt, iv, and ciphertext
    const salt = CryptoJS.lib.WordArray.create(decodedBuffer.words.slice(0, 4), 16)
    const iv = CryptoJS.lib.WordArray.create(decodedBuffer.words.slice(4, 8), 16)
    const encryptedText = CryptoJS.lib.WordArray.create(
      decodedBuffer.words.slice(8),
      decodedBuffer.sigBytes - 32
    )

    // Derive same key
    const key = CryptoJS.PBKDF2(encryptionPhrase.trim(), salt, {
      keySize: keySize,
      iterations: iterations,
      hasher: CryptoJS.algo.SHA512
    })

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedText } as any, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
    if (!decryptedStr) return trimmedInput

    return decryptedStr
  } catch (error) {
    return trimmedInput
  }
}

export function encryptInput(input: string, encryptionPhrase: string): string {
  if (!input.trim() || typeof input !== 'string' || input.length < 1) return 'missing-input'
  const iterations = 1000
  const keySize = 256 / 32

  // Generate random salt and IV
  const salt = CryptoJS.lib.WordArray.random(16)
  const iv = CryptoJS.lib.WordArray.random(16)

  // Derive key using PBKDF2
  const key = CryptoJS.PBKDF2(encryptionPhrase, salt, {
    keySize: keySize,
    iterations: iterations,
    hasher: CryptoJS.algo.SHA512
  })

  // Encrypt
  const encrypted = CryptoJS.AES.encrypt(input, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  // Combine salt + iv + encrypted text
  const result = salt.clone().concat(iv).concat(encrypted.ciphertext)

  // Return as base64 string
  return result.toString(CryptoJS.enc.Base64)
}
