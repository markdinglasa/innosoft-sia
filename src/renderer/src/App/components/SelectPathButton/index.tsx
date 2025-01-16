import { mdiFolder } from '@mdi/js'
import { Error } from '@shared/messages'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, ButtonColor, ButtonType, SFC, ToastType } from '@shared/types'
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
  const dispatch = useDispatch<AppDispatch>()
  const pathSelector = useSelector(getPath)
  const [_path, setPaths] = useState<string | null>(pathSelector)
  const initialized = useSelector(getInitialize)
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
      dispatch(setSnackbar({ display: true, message: Error.e00x01, type: ToastType.error }))
    }
  }

  useEffect(() => {
    if (pathSelector) {
      setPaths(pathSelector)
    }
  }, [pathSelector])

  return (
    <S.Container className={className}>
      {/*<S.Text>
        <S.Icon path={mdiInformation} size="30px" />
        <S.Span> Select a location where to save the reports</S.Span>
      </S.Text>*/}
      <S.UButton
        iconLeft={mdiFolder}
        onClick={handleSelectPath}
        text={pathSelector ? `Selected path: ${truncate(pathSelector, 30)}` : 'Select Path'}
        color={ButtonColor.blue}
        type={ButtonType.button}
        disabled={initialized}
      />
      {/*path && <S.PathDisplay>{truncate(path, 40)}</S.PathDisplay>*/}
    </S.Container>
  )
}
