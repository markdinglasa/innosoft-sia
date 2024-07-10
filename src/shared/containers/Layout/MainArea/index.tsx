import { DraggableTopBar, Splash } from '@shared/components'
import { Snackbar as CSnackbar } from '@shared/components/Snackbar'
import { getActiveLicense, getSnackbar } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { SFC, SqlChannel, ToastType, Snackbar as TSnackbar, WindowDispatch } from '@shared/types'
import { displayToast } from '@shared/utils'
import { License } from '@shared/window'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Windows as App } from '../../../../renderer/src/registry'
import * as S from './Styles'
export const MainArea: SFC = ({ className }) => {
  const dispatch = useDispatch<WindowDispatch>()
  const license = useSelector(getActiveLicense)
  const snackbar = useSelector(getSnackbar)
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

    const handleCloseSnackbar = () => {
        const sb: TSnackbar = {
            display: false,
            message: '',
            type: ToastType.error,
        };
        dispatch(setSnackbar(sb));
    };

    const renderSnackbar = () => {
        if (snackbar && snackbar.display) {
            return <CSnackbar message={snackbar.message} type={snackbar.type} onClose={handleCloseSnackbar} />;
        }
        return null;
    };
  return (
    <S.Container className={className}>
      <DraggableTopBar />
      {renderContent()}
      {renderSnackbar()}
    </S.Container>
  )
}
