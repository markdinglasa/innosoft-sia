import { Splash } from '@shared/components'
import { Error } from '@shared/messages'
import { getActiveDBConfig } from '@shared/selectors'
import { SFC, SqlChannel, ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DBConfigForm, LicenseWindow } from '../..'
import * as S from './Styles'

export const DBConfigWindow: SFC = ({ className }) => {
  const config = useSelector(getActiveDBConfig)
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    if (!config) {
      setIsConfigured(false)
      return
    }

    const checkConnection = async () => {
      try {
        const response = await window.electron.sql.get(SqlChannel.isConnected)
        setIsConfigured(response)
        if (!response) displayToast(Error.e00x14, ToastType.error)
      } catch (error: any) {
        setIsConfigured(false)
        displayToast(Error.e00x02, ToastType.error)
      }
    }

    checkConnection()
  }, [config])

  const renderContent = () => {
    if (isConfigured === null) return <Splash message="Please wait..." />
    return isConfigured ? <LicenseWindow /> : <DBConfigForm />
  }

  return <S.Container className={className}>{renderContent()}</S.Container>
}
