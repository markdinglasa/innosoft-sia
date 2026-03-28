import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { SYSTEM_MANAGER } from '@shared/constants'
import { DBConfig, IpcChannel, Manager, Snackbar } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'

export const initialState: Manager = {
  activeWindow: null,
  activeLicense: null,
  activeLicenseStatus: null,
  activeDBConfig: null,
  activeKey: null,
  activeSnackbar: null
}

const manager = createSlice({
  name: SYSTEM_MANAGER,
  initialState: initialState,
  reducers: {
    setActiveLicense: (
      state: Manager,
      { payload: activeLicense }: PayloadAction<string | null>
    ) => {
      state.activeLicense = activeLicense
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SYSTEM_MANAGER,
        state: current(state)
      })
    },
    setActiveLicenseStatus: (
      state: Manager,
      { payload: activeLicenseStatus }: PayloadAction<string | null>
    ) => {
      state.activeLicenseStatus = activeLicenseStatus
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SYSTEM_MANAGER,
        state: current(state)
      })
    },
    setActiveDatabaseConfig: (
      state: Manager,
      { payload: databaseConfig }: PayloadAction<DBConfig | null>
    ) => {
      state.activeDBConfig = databaseConfig
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SYSTEM_MANAGER,
        state: current(state)
      })
    },
    setActiveKey: (state: Manager, { payload: activeKey }: PayloadAction<string | null>) => {
      state.activeKey = activeKey
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SYSTEM_MANAGER,
        state: current(state)
      })
    },
    setActiveWindow: (state: Manager, { payload: windowId }: PayloadAction<string>) => {
      state.activeWindow = windowId === state.activeWindow ? null : windowId
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SYSTEM_MANAGER,
        state: current(state)
      })
    },
    setSnackbar: (state: Manager, { payload: activeSnackbar }: PayloadAction<Snackbar | null>) => {
      state.activeSnackbar = activeSnackbar === state.activeSnackbar ? null : activeSnackbar
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SYSTEM_MANAGER,
        state: current(state)
      })
    },
    setManager: setLocalAndStateReducer<Manager>(SYSTEM_MANAGER)
  }
})

export const {
  setActiveWindow,
  setActiveDatabaseConfig,
  setActiveKey,
  setActiveLicense,
  setActiveLicenseStatus,
  setSnackbar,
  setManager
} = manager.actions
export default manager.reducer

