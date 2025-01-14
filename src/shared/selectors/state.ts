import { RootState } from '@shared/types'

//APPS
export const getManager = (state: RootState) => state.system.manager

//CONFIGURATION
export const getActiveDBConfig = (state: RootState) => state.system.manager.activeDBConfig
export const getActiveWindow = (state: RootState) => state.system.manager.activeWindow
export const getActiveLicense = (state: RootState) => state.system.manager.activeLicense
export const getActiveKey = (state: RootState) => state.system.manager.activeKey

export const getSettings = (state: RootState) => state.SIA.settings
//UTILITIES
export const getStoreLoaded = (state: RootState) => state.system.internal.storeLoaded
export const getSnackbar = (state: RootState) => state.system.manager.activeSnackbar
