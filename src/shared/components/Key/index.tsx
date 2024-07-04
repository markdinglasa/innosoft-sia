import { mdiClipboardCheckMultipleOutline, mdiContentCopy } from '@mdi/js'
import { setActiveKey } from '@shared/store/manager'
import { ButtonColor, ButtonType, SFC, SqlChannel, WindowDispatch } from '@shared/types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as S from './Styles'

export const Key: SFC = ({ className }) => {
  const [key, setKey] = useState('')
  const dispatch = useDispatch<WindowDispatch>()
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const response = await window.electron.sql.get(SqlChannel.getKey)
        if (response.key === null) {
          setKey('none')
          dispatch(setActiveKey(null))
        } else {
          setKey(response)
          dispatch(setActiveKey(response))
        }
      } catch (error) {
        setKey('Internal Server Error')
      }
    }
    fetchKey()
  }, [])

  const [copyStatus, setCopyStatus] = useState('Copy')
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(key)
      .then(() => {
        setCopyStatus('Copied')
        setTimeout(() => setCopyStatus('Copy'), 4000)
      })
      .catch((error) => console.error('Error copying to clipboard:', error))
  }
  return (
    <S.Container className={className}>
      <S.ButtonCon>
        <S.Label>Key</S.Label>
        <S.Button
          onClick={copyToClipboard}
          iconLeft={copyStatus === 'Copy' ? mdiContentCopy : mdiClipboardCheckMultipleOutline}
          color={ButtonColor.blue}
          type={ButtonType.button}
          text={copyStatus}
        />
      </S.ButtonCon>
      <S.Input type="text" value={key} readOnly />
    </S.Container>
  )
}
