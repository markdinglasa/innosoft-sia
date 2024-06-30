import { RootState } from '@shared/types'

export const getManager = (state: RootState) => state.system.manager
export const getStoreLoaded = (state: RootState) => state.system.internal.storeLoaded
