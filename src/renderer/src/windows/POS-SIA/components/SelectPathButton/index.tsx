import { mdiFolder, mdiInformation } from '@mdi/js'
import { Error } from '@shared/messages'
import { setSnackbar } from '@shared/store/manager'
import { ButtonColor, ButtonType, SFC, Snackbar, ToastType, WindowDispatch } from '@shared/types'
import { truncate } from '@shared/utils'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getInitialize, getPath } from '../../selectors'
import { setPath } from '../../store/manager'
import * as S from './Styles'

interface SelectPathButtonProps {
  onSelect: (path: string) => void
}

export const SelectPathButton: SFC<SelectPathButtonProps> = ({ className, onSelect }) => {
  const dispatch = useDispatch<WindowDispatch>()
  const pathSelector = useSelector(getPath)
  const [path, setPaths] = useState<string | null>(pathSelector)
  const initialized = useSelector(getInitialize)
  let sb: Snackbar
  const handleSelectPath = async () => {
    try {
      const result = await window.electron.dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
      })

      if (!result.canceled && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0]
        dispatch(setPath(`${selectedPath}`)) // Update with the correct action type and payload
        onSelect(selectedPath)
        setPaths(selectedPath)
      }
    } catch (error: any) {
      sb = { display: true, message: Error.e00x01, type: ToastType.error }
      dispatch(setSnackbar(sb))
    }
  }

  useEffect(() => {
    if (pathSelector) {
      setPaths(pathSelector)
    }
  }, [pathSelector])

  return (
    <S.Container className={className}>
      <S.Text>
        <S.Icon path={mdiInformation} size="30px" />
        <S.Span> Select a location where to save the SIA transactions</S.Span>
      </S.Text>
      <S.UButton
        iconLeft={mdiFolder}
        onClick={handleSelectPath}
        text="Select Path"
        color={ButtonColor.blue}
        type={ButtonType.button}
        disabled={initialized}
      />
      {path && <S.PathDisplay>{truncate(path, 40)}</S.PathDisplay>}
    </S.Container>
  )
}
