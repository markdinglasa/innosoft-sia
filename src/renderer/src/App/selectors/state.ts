import { RootState } from '@shared/types'

export const getTenant = (state: RootState) => state.SIA.manager.tenant
export const getActiveTenant = (state: RootState) => state.SIA.manager.activeTenant
export const getPath = (state: RootState) => state.SIA.manager.path
export const getIsConnected = (state: RootState) => state.SIA.manager.isConnected
export const getInitialize = (state: RootState) => state.SIA.manager.initialize
export const getSnackbar = (state: RootState) => state.SIA.manager.snackbar
export const getAccumulatedTotal = (state: RootState) => state.SIA.manager.accumulatedTotal
