import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { IpcChannel } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'
import { SIA_MANAGER } from '../constants'
import { Manager, Tenant } from '../types'

export const initialState: Manager = {
  tenant: null,
  path: null,
  isConnected: false,
  initialize: false,
  snackbar: false,
}

const manager = createSlice({
  name: SIA_MANAGER,
  initialState,
  reducers: {
    setTenant: (state: Manager, { payload: tenant }: PayloadAction<Tenant | null>) => {
      state.tenant = tenant
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setPath: (state: Manager, { payload: path }: PayloadAction<string | null>) => {
      state.path = path
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setIsConnected: (state: Manager, { payload: isConnected }: PayloadAction<boolean>) => {
      state.isConnected = isConnected
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setInitialize: (state: Manager, { payload: initialize }: PayloadAction<boolean>) => {
      state.initialize = initialize
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setManager: setLocalAndStateReducer<Manager>(SIA_MANAGER)
  }
})

export const {
  setTenant,
  setPath,
  setIsConnected,
  setInitialize,
  setManager
} = manager.actions

export default manager.reducer
