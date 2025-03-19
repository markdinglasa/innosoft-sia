import { AllianceType } from '@shared/types'
import { formatDateYYYYMMDDHHMMSS } from '../../utility'

export const generateAllianceFilename = (
  SalesType: AllianceType = AllianceType.salesEOD,
  TenantId: string = '00000000',
  Terminal: number = 1,
  ZCounter: number = 0,
  Dates: string = ''
): string => {
  try {
    if (!SalesType) return 'SalesType is missing'
    if (!TenantId) return 'TenantId is missing'
    if (!Terminal) return 'Terminal is missing'
    //if (!ZCounter) return 'ZCounter is missing'
    return `${SalesType}_${TenantId}_${String(Terminal).toString().padStart(4, '0')}_${SalesType === AllianceType.salesEOD ? String(ZCounter).toString().padStart(5, '0') : formatDateYYYYMMDDHHMMSS(new Date(Dates))}.xml`
  } catch (error: any) {
    console.log('[generateAllianceFilename] Error:', error.message)
    return error.message.toString()
  }
}
