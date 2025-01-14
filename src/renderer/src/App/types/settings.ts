export interface SettingsTable {
  IsDarkMode: boolean
  IsDateRange: boolean
  IsDailyReport?: boolean
  DateStart?: string | null
  DateEnd?: string | null
}

export const settingsInitial: SettingsTable = {
  IsDarkMode: false,
  IsDateRange: false,
  IsDailyReport: false,
  DateStart: null,
  DateEnd: null
}
