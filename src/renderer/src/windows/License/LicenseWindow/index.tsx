import { Splash } from '@shared/components'
import { Error } from '@shared/messages'
import { getActiveLicense } from '@shared/selectors'
import { Response, SFC, SqlChannel, ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LicenseForm, SelectorWindow } from '../..'
import * as S from './Styles'

export const LicenseWindow: SFC = ({ className }) => {
  const license = useSelector(getActiveLicense)
  const [isLicenseValid, setIsLicenseValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (!license || license === null) {
      setIsLicenseValid(false)
      return
    }
    const checkLicense = async () => {
      try {
        const response: Response = await window.electron.sql.post(SqlChannel.isLicense, license)
        setIsLicenseValid(response.IsSomething!)
        if (!response.IsSomething) {
          displayToast(Error.e00x47, ToastType.error)
        }
      } catch (error: any) {
        setIsLicenseValid(false)
        displayToast(Error.e00x02, ToastType.error)
      }
    }
    checkLicense()
  }, [license])

  const renderContent = () => {
    if (isLicenseValid === null ) return <Splash message="Please wait..." />
    return isLicenseValid ? <SelectorWindow /> : <LicenseForm />
  }
  return (
    <>
      <S.Container className={className}>{renderContent()}</S.Container>
    </>
  )
}
