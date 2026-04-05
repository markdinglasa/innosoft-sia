import { ReactNode } from 'react'
import { toast } from 'react-toastify'
import { Toast } from '../components'
import { ToastType } from '../types'

export const displayErrorToast = (error: unknown) => {
  let errorStr: string

  switch (error) {
    case typeof error === 'string':
      errorStr = String(error)
      break
    case (error as { response: { data: string } })?.response?.data:
      errorStr = JSON.stringify((error as { response?: { data?: string } })?.response?.data)
      break
    case (error as Error)?.message:
      errorStr = (error as unknown as Error).message
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
    </Toast>,
    {
      position: 'bottom-left'
    }
  )
}

export const loadStoreFailToast = (_: unknown, errorMessage: string) => {
  displayErrorToast(`Could not load store data: ${errorMessage}`)
}
