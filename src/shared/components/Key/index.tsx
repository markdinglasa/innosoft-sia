import { setActiveKey } from '@shared/store/manager'
import { SFC, SqlChannel, Theme, WindowDispatch } from '@shared/types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CopyClip } from '../CopyClip'

export interface KeyProps {
  theme: Theme
}

export const Key: SFC<KeyProps> = ({ className, theme }) => {
  const [key, setKey] = useState('')
  const dispatch = useDispatch<WindowDispatch>()
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const response = await window.electron.sql.get(SqlChannel.getLicenseKey)
        if (response === null) {
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

  return <CopyClip Value={key} className={className} Label="Key" Theme={theme} />
}
