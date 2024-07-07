import { getActiveDBConfig } from '@shared/selectors'
import { SFC, SqlChannel, ConnectionStatus as Status } from '@shared/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as S from './Styles'

export const ConnectionStatus: SFC = () => {
  const config = useSelector(getActiveDBConfig)
  const [status, setStatus] = useState(Status.disconnected)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await window.electron.sql.post(SqlChannel.isConnected, config)
        if (response) {
          setStatus(Status.connected)
        } else {
          setStatus(Status.disconnected)
        }
      } catch (error) {
        setStatus(Status.invalid)
      }
    }

    checkConnection()
  }, [config])

  return (
    <>
      <S.Container>{status}</S.Container>
    </>
  )
}
