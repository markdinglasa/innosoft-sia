import { AllianceType } from '@shared/types'
import { formatDateYYYYMMDDHHMMSS } from '../../utility'

export const generateAllianceFilename = (
  SalesType: AllianceType = AllianceType.salesEOD,
  TenantId: string = '00000000',
  Terminal: number = 1,
  CurrentDate: Date = new Date()
): string => {
  try {
    if (!SalesType) return 'SalesType is missing'
    if (!TenantId) return 'TenantId is missing'
    if (!Terminal) return 'Terminal is missing'
    const date = formatDateYYYYMMDDHHMMSS(CurrentDate)
    return `${SalesType}_${TenantId}_${String(Terminal).toString().padStart(4, '0')}_${date}.xml`
  } catch (error: any) {
    console.log('[generateAllianceFilename] Error:', error.message)
    return error.message.toString()
  }
}
