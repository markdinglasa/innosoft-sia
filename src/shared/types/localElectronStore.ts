import { WindowElectronStore } from '../../renderer/src/registry' // main renderer
import { SystemElectronStore } from './electronStore'

export interface LocalElectronStore extends WindowElectronStore, SystemElectronStore {}
