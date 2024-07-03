import { Reducer } from '@reduxjs/toolkit'
import { Block, Dict, LocalElectronStore, WindowDispatch } from '.'

export type WindowDataHandler = (block: Block, dispatch: WindowDispatch, networkId: string) => void
export type WindowDataHandlers = Dict<WindowDataHandler>

export interface WindowPayload {
  fn: string
  params: any
  pid: string
}

export interface WindowProps {
  display: boolean
}

export interface WindowRegistration {
  windowId: string
  initializer?: (dispatch: WindowDispatch, store: LocalElectronStore) => void
  isSystemWindow: boolean
  reducer?: Reducer
  router?: WindowDataHandler
}

export interface SystemWindowRegistration extends WindowRegistration {
  isSystemWindow: true
}

export enum Windows {
  dbConfig = 'database-configuration',
  license = 'license',
  login = 'login',
  sia = 'sia',
}