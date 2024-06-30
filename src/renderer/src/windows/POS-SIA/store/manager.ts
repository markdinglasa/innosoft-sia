import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { IpcChannel } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'
import { SIA_MANAGER } from '../constants'
import { DBConfig, Manager, Page, User } from '../types'

export const initialState: Manager = {
  activeDBConfig: null,
  activeKey: null,
  activeLicense: null,
  activePage: Page.database_configuration,
  activeUser: null,
  activeToken: null
}

const manager = createSlice({
  name: SIA_MANAGER,
  initialState,
  reducers: {
    setActiveToken: (state: Manager, { payload: activeToken }: PayloadAction<string | null>) => {
      state.activeToken = activeToken
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setActivePage: (state: Manager, { payload: activePage }: PayloadAction<Page>) => {
      state.activePage = activePage
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setActiveUser: (state: Manager, { payload: activeUser }: PayloadAction<User | null>) => {
      state.activeUser = activeUser
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setActiveKey: (state: Manager, { payload: activeKey }: PayloadAction<string | null>) => {
      state.activeKey = activeKey
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setActiveLicense: (
      state: Manager,
      { payload: activeLicense }: PayloadAction<string | null>
    ) => {
      state.activeLicense = activeLicense
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setActiveDatabaseConfig: (
      state: Manager,
      { payload: databaseConfig }: PayloadAction<DBConfig | null>
    ) => {
      state.activeDBConfig = databaseConfig
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setManager: setLocalAndStateReducer<Manager>(SIA_MANAGER)
  }
})

export const {
  setActiveDatabaseConfig,
  setActiveLicense,
  setActiveKey,
  setActivePage,
  setActiveUser,
  setActiveToken,
  setManager
} = manager.actions

export default manager.reducer
