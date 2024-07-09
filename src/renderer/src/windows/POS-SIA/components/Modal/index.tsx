import { mdiClose } from '@mdi/js'
import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { SFC, Theme } from '@shared/types'
import * as S from './Styles'

export interface ModalProps {
  children: ReactNode
  close(): void
  header: string
  theme: Theme
}

export const Modal: SFC<ModalProps> = ({ children, className, close, header, theme }) => {
  return createPortal(
    <>
      <S.Overlay onClick={close} />
      <S.Modal className={className} theme={theme}>
        <S.Header theme={theme}>
          <span>{header}</span>
          <S.Icon theme={theme} icon={mdiClose} onClick={close} size={16} unfocusable />
        </S.Header>
        <S.Content theme={theme}>{children}</S.Content>
      </S.Modal>
    </>,
    document.getElementById('modal-root')!
  )
}
