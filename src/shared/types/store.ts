import store from '../store'

export type WindowDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
