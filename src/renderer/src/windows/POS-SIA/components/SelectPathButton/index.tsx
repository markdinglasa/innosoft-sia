import { mdiFolder, mdiInformation } from '@mdi/js'
import { ButtonColor, ButtonType, SFC, WindowDispatch } from '@shared/types'
import { truncate } from '@shared/utils'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPath } from '../../selectors'
import { setPath } from '../../store/manager'
import * as S from './Styles'

interface SelectPathButtonProps {
  onSelect: (path: string) => void
}

export const SelectPathButton: SFC<SelectPathButtonProps> = ({ className, onSelect }) => {
  const dispatch = useDispatch<WindowDispatch>()
  const pathSelector = useSelector(getPath)
  const [path, setPaths] = useState<string | null>(pathSelector)

  const handleSelectPath = async () => {
    const result = await window.electron.dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      const selectedPath = result.filePaths[0]
      dispatch(setPath(`${selectedPath}`)) // Update with the correct action type and payload
      onSelect(selectedPath)
      setPaths(selectedPath)
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
          <S.Icon path={mdiInformation} size="30px"/> 
          <S.Span> Select a location where to save the SIA transactions</S.Span>
        </S.Text>
      <S.UButton iconLeft={mdiFolder} onClick={handleSelectPath} text="Select Path" color={ButtonColor.blue} type={ButtonType.button}/>
      {path && <S.PathDisplay>{truncate(path, 40)}</S.PathDisplay>}
    </S.Container>
  )
}