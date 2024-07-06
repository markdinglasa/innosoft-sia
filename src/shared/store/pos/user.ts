import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { POS_MASTER_USER } from '@shared/constants'
import { IpcChannel, User, UserManager } from '@shared/types'
import { setLocalAndStateReducer } from '@shared/utils'

const initialState: UserManager = {
    UserTable: []
}

const userManager = createSlice({
  name: POS_MASTER_USER,
  initialState: initialState,
  reducers: {
    setUserTable: (
      state: UserManager,
      { payload: UserTable }: PayloadAction<Array<User> | []>
    ) => {
      state.UserTable = UserTable
      window.electron.ipc.send(IpcChannel.setStoreValue, {
        key: POS_MASTER_USER,
        state: current(state)
      })
    },
    setUserManager: setLocalAndStateReducer<UserManager>(POS_MASTER_USER)
  },
})

export const { setUserTable, setUserManager } = userManager.actions
export default userManager.reducer
