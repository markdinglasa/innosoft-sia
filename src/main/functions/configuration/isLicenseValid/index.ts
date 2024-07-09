import { CODE_KEY } from '@shared/constants'
import { Error, Success } from '@shared/messages'
import { Response } from '@shared/types'
import { XORDecryption, XOREncryption, businessType, licenseDuration, licenseKey, roleType } from '../..'
export const isLicenseValid = async (license: string): Promise<Response> => {
  try {
    const k = await licenseKey()
    if (!k) return { IsSomething: false, Message: Error.e00x37 }
    const prts = String(await XORDecryption(CODE_KEY, license)).split('.')
    if (k !== prts[0]) return { IsSomething:false, Message: Error.e00x38 }
    const lt = await businessType(prts[1])
    const rt = await roleType(prts[2])
    const ld = await licenseDuration(prts[3])
    const sd = new Date(prts[4])
    const ed = new Date(sd.getTime() + ld * 24 * 60 * 60 * 1000)
    const cd = new Date()
    const formatter = new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const [{ value: m }, , { value: d }, , { value: y }] = formatter.formatToParts(sd)
    const fd = `${y}/${m}/${d}`
    if (cd >= ed) return { IsSomething:false, Message: Error.e00x39 }
    const el = await XOREncryption(CODE_KEY, `${k}.${lt}.${rt}.${ld}.${fd}`)
    return (el === license)?{ IsSomething:true, Message: Success.s00x00 } : { IsSomething:false, Message: Error.e00x40 }
    } catch (error) {
      return { IsSomething:false, Message: Error.e00x02 }
    }
}
