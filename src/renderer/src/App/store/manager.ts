import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { IpcChannel } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'
import { SIA_MANAGER } from '../constants'
import { Manager, Tenants } from '../types'

export const initialState: Manager = {
  tenant: null,
  path: null,
  isConnected: false,
  initialize: false,
  snackbar: false,
  activeTenant: null,
  accumulatedTotal: 0,
  controlNumber: 0
}

const manager = createSlice({
  name: SIA_MANAGER,
  initialState,
  reducers: {
    setControlNumber: (state: Manager, { payload: controlNumber }: PayloadAction<number>) => {
      state.controlNumber = controlNumber
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setAccumulatedTotal: (state: Manager, { payload: accumulatedTotal }: PayloadAction<number>) => {
      state.accumulatedTotal = accumulatedTotal
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setTenant: (state: Manager, { payload: tenant }: PayloadAction<any | null>) => {
      state.tenant = tenant
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setActiveTenant: (state: Manager, { payload: activeTenant }: PayloadAction<Tenants | null>) => {
      state.activeTenant = activeTenant
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
  setAccumulatedTotal,
  setTenant,
  setPath,
  setIsConnected,
  setActiveTenant,
  setInitialize,
  setManager
} = manager.actions

export default manager.reducer
