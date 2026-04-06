import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { IpcChannel } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'
import {
  MstBranchEntity,
  MstTerminalEntity,
  MstUserEntity
} from '../../../../main/entities/masterfiles'
import { POS_MANAGER } from '../constants'

// Define the shape of the POS Manager state
export interface POSManagerState {
  initialize: boolean
  activePage: string | null
  activeUser: MstUserEntity | null
  activePermissions: string[]
  activeBranches: MstBranchEntity[] | null
  activeBranch: MstBranchEntity | null
  loginDate: string | null
  activeTerminal: MstTerminalEntity | null
}

export const initialState: POSManagerState = {
  initialize: false,
  activePage: null,
  activeUser: null,
  activePermissions: [],
  activeBranches: [],
  activeBranch: null,
  activeTerminal: null,
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
    setActiveUser: (
      state: POSManagerState,
      { payload: user }: PayloadAction<MstUserEntity | null>
    ) => {
      state.activeUser = user
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: POS_MANAGER,
        state: current(state)
      })
    },
    setActiveBranches: (
      state: POSManagerState,
      { payload: branches }: PayloadAction<MstBranchEntity[] | null>
    ) => {
      state.activeBranches = branches
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: POS_MANAGER,
        state: current(state)
      })
    },
    setActiveTerminal: (
      state: POSManagerState,
      { payload: terminal }: PayloadAction<MstTerminalEntity | null>
    ) => {
      state.activeTerminal = terminal
      if (terminal?.branch) {
        state.activeBranch = terminal.branch
      }
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: POS_MANAGER,
        state: current(state)
      })
    },
    setActiveBranch: (
      state: POSManagerState,
      { payload: branch }: PayloadAction<MstBranchEntity | null>
    ) => {
      state.activeBranch = branch
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: POS_MANAGER,
        state: current(state)
      })
    }
  }
})

export const {
  setInitialize,
  setManager,
  setActivePage,
  setActiveUser,
  setActiveBranches,
  setActiveBranch,
  setActiveTerminal
} = manager.actions

export default manager.reducer

