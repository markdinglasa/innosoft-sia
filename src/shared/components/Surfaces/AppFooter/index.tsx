import { mdiFileDocumentAlertOutline } from '@mdi/js'
import MdiIcon from '@mdi/react'
import { APP_VERSION } from '@shared/constants'
import { SFC } from '@shared/types'
import { useState } from 'react'
import logo from '../../../../../resources/innosoftlogo.svg'
import { LogViewer } from '../../../../renderer/src/App/components/LogViewer'
import * as S from './Styles'

export const AppFooter: SFC = ({ className }) => {
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false)
  return (
    <S.Container className={className}>
      <S.LogoContainer>
        <S.Image src={logo} />
      </S.LogoContainer>
      <S.TextContainer>
        <S.Span>iSIA {APP_VERSION}</S.Span>
        <S.Span>{new Date().getFullYear()} &copy; Cebu Innosoft Solution Services Inc.</S.Span>
        <S.Span>Call Support: (032) 263-2912 | 0927 864 5960</S.Span>
      </S.TextContainer>
      <button
        onClick={() => setIsLogViewerOpen(true)}
        style={{
          fontSize: '12px',
          color: '#888',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0 10px'
        }}
      >
        <MdiIcon path={mdiFileDocumentAlertOutline} size={`${25}px`} color={'#93CDDD'} />
      </button>
      <LogViewer isOpen={isLogViewerOpen} onClose={() => setIsLogViewerOpen(false)} />
    </S.Container>
  )
}
