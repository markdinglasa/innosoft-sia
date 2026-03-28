import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { IpcChannel } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'
import { MstUserEntity } from "src/main/entities"
import { POS_MANAGER } from '../constants'

// Define the shape of the POS Manager state
export interface POSManagerState {
  initialize: boolean
  activePage: string | null
  activeUser: MstUserEntity | null
  activePermissions: string[]
  loginDate: string | null
}

export const initialState: POSManagerState = {
  initialize: false,
  activePage: null,
  activeUser: null,
  activePermissions: [],
  loginDate: null
}

const manager = createSlice({
  name: POS_MANAGER,
  initialState,
  reducers: {
    setInitialize: (state: POSManagerState, { payload: initialize }: PayloadAction<boolean>) => {
      state.initialize = initialize
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: POS_MANAGER,
        state: current(state)
      })
    },
    setManager: setLocalAndStateReducer<POSManagerState>(POS_MANAGER),

      setActivePage: (state: POSManagerState, { payload: page }: PayloadAction<string>) => {
        state.activePage = page === state.activePage ? null : page
        window.electron.ipc.send(IpcChannel.setStoreValue, {
          key: POS_MANAGER,
          state: current(state)
        })
      },
        },
})

export const {
  setInitialize,
  setManager,
  setActivePage
} = manager.actions

export default manager.reducer
