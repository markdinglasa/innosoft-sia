import { SFC } from '@shared/types'
import { useState } from 'react'
import * as S from './Styles'

interface SelectPathButtonProps {
  onSelect: (path: string) => void
}

export const SelectPathButton: SFC<SelectPathButtonProps> = ({ className, onSelect }) => {
  const [path, setPath] = useState<string | null>(null)

  const handleSelectPath = async () => {
    const result = await window.electron.dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      const selectedPath = result.filePaths[0]
      setPath(selectedPath)
      onSelect(selectedPath)
    }
  }

  return (
    <S.Container className={className}>
      <S.Button onClick={handleSelectPath}>Select Path</S.Button>
      {path && <S.PathDisplay>{path}</S.PathDisplay>}
    </S.Container>
  )
}
