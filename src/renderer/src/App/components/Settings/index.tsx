import { mdiCog } from '@mdi/js'
import { useToggle } from '@shared/hooks'
import { ButtonColor, ButtonType, SFC, Theme } from '@shared/types'
import { SettingsModal } from '../../modals/SettingsForm'
import * as S from './Styles'

export const Settings: SFC = () => {
  const [modalIsOpen, toggleModal] = useToggle(false)
  return (
    <>
      <S.Button
        iconLeft={mdiCog}
        onClick={() => toggleModal()}
        text="Settings"
        color={ButtonColor.blue}
        type={ButtonType.button}
      />
      {modalIsOpen && <SettingsModal close={toggleModal} theme={Theme.dark} />}
    </>
  )
}
