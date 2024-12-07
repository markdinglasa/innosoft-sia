import { SystemElectronStore } from '@shared/types'
import { AppElectronStore } from '../../../renderer/src/registry' // main renderer

export interface LocalElectronStore extends AppElectronStore, SystemElectronStore {}
