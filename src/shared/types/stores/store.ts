import store from '@shared/store'

export type WindowDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
