import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { IpcChannel } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'
import { SIA_MANAGER } from '../constants'
import { Manager, Page, User } from '../types'

export const initialState: Manager = {
  activePage: Page.login,
  activeUser: null,
  activeToken: null
}

const manager = createSlice({
  name: SIA_MANAGER,
  initialState,
  reducers: {
    setActivePage: (state: Manager, { payload: activePage }: PayloadAction<Page>) => {
      state.activePage = activePage
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: SIA_MANAGER,
        state: current(state)
      })
    },
    setActiveToken: (state: Manager, { payload: activeToken }: PayloadAction<string | null>) => {
      state.activeToken = activeToken
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
    setManager: setLocalAndStateReducer<Manager>(SIA_MANAGER)
  }
})

export const {
  setActivePage,
  setActiveUser,
  setActiveToken,
  setManager
} = manager.actions

export default manager.reducer
