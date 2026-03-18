import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, Snackbar, ToastType } from '@shared/types'
import { useDispatch } from 'react-redux'

export const dislpaySnackbar = (message: string, type: ToastType) => {
  const dispatch = useDispatch<AppDispatch>()
  const sb: Snackbar = {
    display: true,
    message: message,
    type: type
  }
  dispatch(setSnackbar(sb))
}
