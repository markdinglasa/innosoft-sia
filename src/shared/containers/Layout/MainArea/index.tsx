import { DraggableTopBar, Splash } from '@shared/components'
import { Snackbar as CSnackbar } from '@shared/components/Snackbar'
import { getActiveLicense, getSnackbar } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { Response, SFC, Snackbar, SqlChannel, ToastType, Snackbar as TSnackbar, WindowDispatch } from '@shared/types'
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
  let sb: Snackbar, message: string, type:ToastType, response: Response
  useEffect(() => {
    const checkLicense = async () => {
      try {
        response = await window.electron.sql.post(SqlChannel.isLicense, license)
        if (response.IsSomething) {
          setIsLicenseValid(true)
          message=response.Message
          type=ToastType.success
        } else {
          setIsLicenseValid(false)
          message = response.Message
          type = ToastType.error
        }
      } catch (error: any) {
        setIsLicenseValid(false)
        message = error
        type = ToastType.error
      }
      sb = {display: true, message: message, type: type}
      dispatch(setSnackbar(sb))
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
