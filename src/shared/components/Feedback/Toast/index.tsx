import { mdiAlertCircleOutline, mdiCheckCircle, mdiInformation, mdiTriangle } from '@mdi/js'
import MdiIcon from '@mdi/react'
import { SFC, ToastType } from '@shared/types'
import { ReactNode } from 'react'
import * as S from './Styles'

export interface ToastProps {
  children: ReactNode
  type: ToastType
}

export const Toast: SFC<ToastProps> = ({ children, className, type = ToastType.error }) => {
  const Icon = () => {
    switch (type) {
      case ToastType.success:
        return <MdiIcon path={mdiCheckCircle} size={1} className="text-green-500"/>
      case ToastType.info:
        return <MdiIcon path={mdiInformation} size={1} className="text-blue-500"/>
      case ToastType.warning:
        return <MdiIcon path={mdiTriangle} size={1} className="text-orange-500"/>
      case ToastType.error:
      default:
        return <MdiIcon path={mdiAlertCircleOutline} size={1} className="text-red-500"/>
    }
  }

  return (
    <S.Container className={className} type={type}>
      <Icon/>
      <S.Text className="text-sm text-slate-900">{children}</S.Text>
    </S.Container>
  )
}
