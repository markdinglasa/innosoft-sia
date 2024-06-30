import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SYSTEM_MANAGER } from '../constants'
import { Manager } from '../interfaces/manager'
import { setLocalAndStateReducer } from '../utils/ipc'

export const initialState: Manager = {
  activeWindow: null
}

const manager = createSlice({
  name: SYSTEM_MANAGER,
  initialState: initialState,
  reducers: {
    setActiveWindow: (state: Manager, { payload: windowId }: PayloadAction<string>) => {
      state.activeWindow = windowId === state.activeWindow ? null : windowId
    },
    setManager: setLocalAndStateReducer<Manager>(SYSTEM_MANAGER)
  }
})

export const { setActiveWindow, setManager } = manager.actions
export default manager.reducer
