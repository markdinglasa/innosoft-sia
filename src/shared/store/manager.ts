import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { SYSTEM_MANAGER } from '@shared/constants'
import { DBConfig, IpcChannel, Manager, User } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'

export const initialState: Manager = {
  activeWindow: null,
  activeLicense: null,
  activeDBConfig: null,
  activeKey: null,
  activeToken: null,
  activeUser: null
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
    setActiveToken: (state: Manager, { payload: activeToken }: PayloadAction<string | null>) => {
      state.activeToken = activeToken
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SYSTEM_MANAGER,
        state: current(state)
      })
    },
    setActiveUser: (state: Manager, { payload: activeUser }: PayloadAction<User | null>) => {
      state.activeUser = activeUser
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
    setManager: setLocalAndStateReducer<Manager>(SYSTEM_MANAGER)
  }
})

export const {
  setActiveWindow,
  setActiveDatabaseConfig,
  setActiveKey,
  setActiveLicense,
  setActiveToken,
  setActiveUser,
  setManager
} = manager.actions
export default manager.reducer
