import { RootState } from '@shared/types'

//APPS
export const getManager = (state: RootState) => state.system.manager

//CONFIGURATION
export const getActiveDBConfig = (state: RootState) => state.system.manager.activeDBConfig
export const getActiveWindow = (state: RootState) => state.system.manager.activeWindow
export const getActiveLicense = (state: RootState) => state.system.manager.activeLicense
export const getActiveKey = (state: RootState) => state.system.manager.activeKey

//UTILITIES
export const getAccountOnlineStatuses = (state: RootState) => state.system.accountOnlineStatuses;
export const getAccounts = (state: RootState) => state.system.accounts;
export const getBalances = (state: RootState) => state.system.balances;
export const getNetworkAccountOnlineStatuses = (state: RootState) => state.system.networkAccountOnlineStatuses;
export const getNetworkBlocks = (state: RootState) => state.system.networkBlocks;
export const getNetworks = (state: RootState) => state.system.networks;
export const getNotificationCounts = (state: RootState) => state.system.notificationCounts;
export const getPeerRequestManager = (state: RootState) => state.system.peerRequestManager;
export const getSelf = (state: RootState) => state.system.self;
export const getSocketStatuses = (state: RootState) => state.system.socketStatuses;
export const getStoreLoaded = (state: RootState) => state.system.internal.storeLoaded;

//POS
export const getUserTable = (state: RootState) => state.pos.posUser.UserTable;
