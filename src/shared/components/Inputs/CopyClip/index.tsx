import { mdiClipboardCheckMultipleOutline, mdiContentCopy } from '@mdi/js'
import { ButtonColor, ButtonType, SFC, Theme } from '@shared/types'
import { useEffect, useState } from 'react'
import * as S from './Styles'

export interface CopyClipProps {
  Value: string
  Label: string
  Theme?: Theme
}

export const CopyClip: SFC<CopyClipProps> = ({ className, Value, Label, Theme }) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(Value)
  }, [Value])

  const [copyStatus, setCopyStatus] = useState('Copy')
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopyStatus('Copied')
        setTimeout(() => setCopyStatus('Copy'), 4000)
      })
      .catch((error) => console.error('Error copying to clipboard:', error))
  }
  return (
    <S.Container className={className}>
      <S.ButtonCon>
        <S.Label theme={Theme}>{Label}</S.Label>
        <S.Button
          onClick={copyToClipboard}
          iconLeft={copyStatus === 'Copy' ? mdiContentCopy : mdiClipboardCheckMultipleOutline}
          color={ButtonColor.blue}
          type={ButtonType.button}
          text={copyStatus}
        />
      </S.ButtonCon>
      <S.Input type="text" value={value} readOnly theme={Theme} />
    </S.Container>
  )
}
