import { RootState } from '@shared/types'

//APPS
export const getManager = (state: RootState) => state.system.manager

//CONFIGURATION
export const getActiveDBConfig = (state: RootState) => state.system.manager.activeDBConfig
export const getActiveWindow = (state: RootState) => state.system.manager.activeWindow
export const getActiveLicense = (state: RootState) => state.system.manager.activeLicense
export const getActiveKey = (state: RootState) => state.system.manager.activeKey

//UTILITIES
export const getBalances = (state: RootState) => state.system.balances
export const getStoreLoaded = (state: RootState) => state.system.internal.storeLoaded

//UTILITY
export const getSnackbar = (state: RootState) => state.system.manager.activeSnackbar
