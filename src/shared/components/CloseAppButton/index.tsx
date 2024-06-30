import { mdiClose } from '@mdi/js'
import { IpcChannel, SFC } from '../../types'
import { Button, Icon } from './styles'

export const CloseAppButton: SFC = ({ className }) => {
  const handleCloseClick = () => {
    window.electron.ipc.send(IpcChannel.closeApp)
  }

  return (
    <Button className={className} onClick={handleCloseClick}>
      <Icon path={mdiClose} size="16px" />
    </Button>
  )
}
