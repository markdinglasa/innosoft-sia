import { DraggableTopBar, Splash } from '@shared/components'
import { getActiveLicense } from '@shared/selectors'
import { SFC, SqlChannel, ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import { License } from '@shared/window'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Windows as App } from '../../../../renderer/src/registry'
import * as S from './Styles'
export const MainArea: SFC = ({ className }) => {
  const license = useSelector(getActiveLicense)
  const [isLicenseValid, setIsLicenseValid] = useState<boolean | null>(null)
  useEffect(() => {
    const checkLicense = async () => {
      try {
        const response = await window.electron.sql.post(SqlChannel.isLicense, license)
        if (response.IsSomething) {
          setIsLicenseValid(true)
        } else {
          setIsLicenseValid(false)
          displayToast(response.Message, ToastType.error)
        }
      } catch (err) {
        setIsLicenseValid(false)
        displayToast(`${err}`, ToastType.error)
      }
    }
    checkLicense()
  }, [license])
  const renderContent = () => {
    if (isLicenseValid === null) {
      return <Splash message={'Please wait...'}/>
    }
    return isLicenseValid ? <App /> : <License />
  }
  return (
    <S.Container className={className}>
      <DraggableTopBar />
      {renderContent()}
    </S.Container>
  )
}
