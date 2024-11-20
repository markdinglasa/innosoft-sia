import { ToastType } from '../utility'

export interface Snackbar {
  display: boolean
  message: string
  type: ToastType
}
