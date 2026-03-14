import { mdiCog } from "@mdi/js"
import { SettingsModal } from "@renderer/App/modals"
import { useToggle } from "@shared/hooks"
import { ButtonColor, ButtonType, SFC, Theme } from "@shared/types"
import * as S from './Styles'


interface SettingsProps  {
    
}
export const Settings: SFC<SettingsProps> = ({  }) => {
    const [modalIsOpen, toggleModal] = useToggle(false)
  return (
    <>
        <S.Button iconLeft={mdiCog} onClick={() => toggleModal()} text="Settings" color={ButtonColor.blue} type={ButtonType.button} />
        {modalIsOpen && <SettingsModal close={toggleModal} theme={Theme.dark} />}
    </>
  )
}