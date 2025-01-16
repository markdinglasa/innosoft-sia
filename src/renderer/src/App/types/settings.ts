export interface ZReadingTable {
  Name: string
  Address: string
  Operator: string
  PermitNumber: string
  TIN: string
  AccreditationNumber: string
  SerialNumber: string
  MachineNumber: string
}

export interface SettingsTable {
  IsDarkMode: boolean
  IsDateRange: boolean
  IsDailyReport?: boolean
  DateStart?: string | null
  DateEnd?: string | null
  IsZReading: boolean
  Name: string | null
  Address: string | null
  Operator: string | null
  PermitNumber: string | null
  TIN: string | null
  AccreditationNumber: string | null
  SerialNumber: string | null
  MachineNumber: string | null
}

export const settingsInitial: SettingsTable = {
  IsDarkMode: false,
  IsDateRange: false,
  IsDailyReport: false,
  DateStart: null,
  DateEnd: null,
  IsZReading: false,
  Name: null,
  Address: null,
  Operator: null,
  PermitNumber: null,
  TIN: null,
  AccreditationNumber: null,
  SerialNumber: null,
  MachineNumber: null
}
