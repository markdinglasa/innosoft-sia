import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { IpcChannel } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'
import { SIA_SETTINGS } from '../constants'
import { settingsInitial, SettingsTable } from '../types'

const settiingsStore = createSlice({
  name: SIA_SETTINGS,
  initialState: settingsInitial,
  reducers: {
    setIsDarkMode: (state: SettingsTable, { payload: IsDarkMode }: PayloadAction<boolean>) => {
      state.IsDarkMode = IsDarkMode
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_SETTINGS,
        state: current(state)
      })
    },
    setIsDateRange: (state: SettingsTable, { payload: IsDateRange }: PayloadAction<boolean>) => {
      state.IsDateRange = IsDateRange
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_SETTINGS,
        state: current(state)
      })
    },
    setDateStart: (state: SettingsTable, { payload: DateStart }: PayloadAction<string | null>) => {
      state.DateStart = DateStart
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_SETTINGS,
        state: current(state)
      })
    },
    setDateEnd: (state: SettingsTable, { payload: DateEnd }: PayloadAction<string | null>) => {
      state.DateEnd = DateEnd
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_SETTINGS,
        state: current(state)
      })
    },
    setIsDailyReport: (
      state: SettingsTable,
      { payload: IsDailyReport }: PayloadAction<boolean>
    ) => {
      state.IsDailyReport = IsDailyReport
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_SETTINGS,
        state: current(state)
      })
    },
    setSettings: setLocalAndStateReducer<SettingsTable>(SIA_SETTINGS)
  }
})

export const {
  setIsDarkMode,
  setDateStart,
  setDateEnd,
  setIsDateRange,
  setIsDailyReport,
  setSettings
} = settiingsStore.actions

export default settiingsStore.reducer
