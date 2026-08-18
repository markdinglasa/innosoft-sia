import { License } from '@renderer/License'
import { AppMain } from '@renderer/registry'
import { Splash } from '@shared/components'
import { Error } from '@shared/messages'
import { getActiveLicense } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, Response, SFC, Snackbar, SqlChannel, ToastType } from '@shared/types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as S from './Styles'
export const MainArea: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const license = useSelector(getActiveLicense)
  const [isLicenseValid, setIsLicenseValid] = useState<boolean | null>(null)

  useEffect(() => {
    const checkLicense = async () => {
      try {
        const response: Response = await globalThis.electron.sql.post(SqlChannel.isLicense, license)
        setIsLicenseValid(response.IsSomething!)
        if (!response.IsSomething && response.IsSomething === false) {
          const snackbar: Snackbar = {
            display: true,
            message: response.Message,
            type: ToastType.error
          }
          dispatch(setSnackbar(snackbar))
        }
      } catch {
        setIsLicenseValid(false)
        const snackbar: Snackbar = {
          display: true,
          message: Error.e00x02,
          type: ToastType.error
        }
        dispatch(setSnackbar(snackbar))
      }
    }
    checkLicense()
  }, [license, dispatch])

  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false)
    }, 5000)

    // Cleanup timeout when component unmounts
    return () => clearTimeout(splashTimeout)
  }, [])

  const Content = () => {
    if (showSplash || isLicenseValid === null) {
      return <Splash message="Please wait..." />
    }
    return isLicenseValid ? <AppMain /> : <License />
  }

  return (
    <S.Container className={className}>
      <Content />
    </S.Container>
  )
}
