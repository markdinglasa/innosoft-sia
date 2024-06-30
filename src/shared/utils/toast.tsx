import { ReactNode } from 'react'
import { toast } from 'react-toastify'

import Toast from '../components/Toast'
import { ToastType } from '../types'

export const displayErrorToast = (error: any) => {
  let errorStr: string

  switch (error) {
    case typeof error === 'string':
      errorStr = error
      break
    case error?.response?.data:
      errorStr = JSON.stringify(error.response.data)
      break
    case error?.message:
      errorStr = error.message
      break
    default:
      errorStr = JSON.stringify(error)
      break
  }

  displayToast(errorStr, ToastType.error)
}

export const displayToast = (message: ReactNode, type: ToastType, className?: string): void => {
  toast(
    <Toast className={className} type={type}>
      {message}
    </Toast>
  )
}

export const loadStoreFailToast = (_: any, errorMessage: string) => {
  displayErrorToast(`Could not load store data: ${errorMessage}`)
}
