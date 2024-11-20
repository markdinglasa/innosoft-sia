import { SystemElectronStore } from '@shared/types'
import { WindowElectronStore } from '../../../renderer/src/registry' // main renderer

export interface LocalElectronStore extends WindowElectronStore, SystemElectronStore {}
