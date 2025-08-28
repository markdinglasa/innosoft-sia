import { Reducer } from '@reduxjs/toolkit'
import { AppDispatch, Block, Dict, LocalElectronStore } from '..'

export type AppDataHandler = (block: Block, dispatch: AppDispatch, networkId: string) => void
export type AppDataHandlers = Dict<AppDataHandler>

export interface AppPayload {
  fn: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any
  pid: string
}

export interface AppProps {
  display: boolean
}

export interface AppRegistration {
  appId: string
  initializer?: (dispatch: AppDispatch, store: LocalElectronStore) => void
  isSystemApp: boolean
  reducer?: Reducer
  router?: AppDataHandler
}

export interface SystemAppRegistration extends AppRegistration {
  isSystemApp: true
}

export enum Apps {
  dbConfig = 'database-configuration',
  license = 'license',
  login = 'login',
  sia = 'sia'
}
