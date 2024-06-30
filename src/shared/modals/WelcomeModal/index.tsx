import { mdiQrcodeScan } from '@mdi/js'
import { Icon, Modal } from '../../components'
import { SFC } from '../../types'
import * as S from './Styles'
import Arrow from './assets/arrow.png'

interface WelcomeModalProps {
  close(): void
}

export const WelcomeModal: SFC<WelcomeModalProps> = ({ className, close }) => {
  const renderFooter = () => (
    <S.Footer>
      <S.FooterLeft>
        You can always view your account number by clicking this icon on your toolbar.
      </S.FooterLeft>
      <S.FooterRight>
        <S.Arrow alt="arrow" src={Arrow} />
        <Icon icon={mdiQrcodeScan} unfocusable />
      </S.FooterRight>
    </S.Footer>
  )

  return (
    <Modal className={className} close={close} footer={renderFooter()} header="Getting Started">
      <S.GettingStartedText>
        To <b>get started</b>, share your account number with an existing user so that they can then
        send you credits.
      </S.GettingStartedText>
    </Modal>
  )
}
