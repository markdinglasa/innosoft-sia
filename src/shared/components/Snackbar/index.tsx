import { SFC, ToastType } from '@shared/types'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import * as S from './Styles'

interface SnackbarProps {
  message: string
  type: ToastType
  onClose: () => void // Add onClose prop
}

export const Snackbar: SFC<SnackbarProps> = ({ className, message, type, onClose }) => {
  const [visible, setVisible] = useState(true)

  const renderIcon = useCallback((): ReactNode => {
    switch (type) {
      case ToastType.success:
        return <S.CheckCircleIcon />
      case ToastType.warning:
        return <S.WarningIcon />
      default:
        return <S.AlertCircleOutlineIcon />
    }
  }, [type])

  // Hide Snackbar after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // Allow time for the exit animation
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return createPortal(
    <>
      <S.Container className={className} visible={visible}>
        <S.Card type={type} visible={visible}>
          {renderIcon()}
          <S.Span>{message}</S.Span>
        </S.Card>
      </S.Container>
    </>,
    document.getElementById('modal-root')!
  )
}
