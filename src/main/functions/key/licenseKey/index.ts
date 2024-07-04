import { CODE_KEY } from '@shared/constants';
import { alphanumeric, getBiosSerialNumber, getStorageSerialNumber, XOREncryption } from '../..';

export const licenseKey = async (): Promise<string> => {
  try {
    const bios: string = await getBiosSerialNumber()
    const strg: string = await getStorageSerialNumber()
    return await XOREncryption(CODE_KEY, alphanumeric(`${bios}${strg}`))
  } catch (error: any) {
    return 'internal server error'
  }
}
