import { ConStatus } from '@shared/components'
import { getActiveDBConfig } from '@shared/selectors'
import { AppDispatch, SFC, SqlChannel, ConnectionStatus as Status } from '@shared/types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsConnected } from '../../store/manager'
export const ConnectionStatus: SFC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const config = useSelector(getActiveDBConfig)
  const [status, setStatus] = useState(Status.disconnected)
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await window.electron.sql.post(SqlChannel.isConnected, config)
        if (response) {
          setStatus(Status.connected)
          dispatch(setIsConnected(true))
        } else {
          setStatus(Status.disconnected)
          dispatch(setIsConnected(false))
        }
      } catch (error) {
        setStatus(Status.invalid)
        dispatch(setIsConnected(false))
      }
    }
    checkConnection()
  }, [config])
  return (
    <>
      <ConStatus type={status}>{status}</ConStatus>
    </>
  )
}
