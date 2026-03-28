import { mdiKey } from '@mdi/js'
import { Input, Key } from '@shared/components'
import { APP_VERSION } from "@shared/constants"
import { Error, Success } from '@shared/messages'
import { setActiveLicense, setActiveLicenseStatus, setActiveWindow, setSnackbar } from '@shared/store/manager'
import {
  AppDispatch,
  ButtonColor,
  ButtonType,
  Manager,
  SFC,
  Snackbar,
  SqlChannel,
  Theme,
  ToastType
} from '@shared/types'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import * as S from './Styles'

export const License: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { activeLicenseStatus } = useSelector((state: { manager: Manager }) => state.manager)

  const initialValues = {
    licenseKey: ''
  }
  type FormValues = typeof initialValues

  let sb: Snackbar, message: string, type: ToastType
  const handleSubmit = async (values: FormValues) => {
    const data = {
      licenseKey: values.licenseKey
    }
    try {
      const response = await window.electron.sql.post(SqlChannel.isLicense, data.licenseKey)
      console.log('response', response)
      if (response.IsSomething) {
        dispatch(setActiveLicense(data.licenseKey))
        dispatch(setActiveLicenseStatus(response.Option || 'ACTIVE'))
        message = response.Message === 'GRACE' ? 'License is in GRACE period.' : Success.s00x00
        type = ToastType.success
      } else {
        dispatch(setActiveLicenseStatus(response.Option || 'INVALID'))
        message = response.Message
        type = ToastType.error
      }
    } catch (error: any) {
      message = Error.e00x02
      type = ToastType.error
    }
    sb = { display: true, message: message, type: type }
    dispatch(setSnackbar(sb))
  }

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      licenseKey: yup.string().required('Required')
    })
  }, [])


  return (
    <>
      <S.Container>
        <S.CardContainer>
          <S.CardHeader className={className}>
            <S.Icon path={mdiKey} size="40px" />
            <S.CardTitle>License Key</S.CardTitle>
          </S.CardHeader>
          <S.CardBody className={className}>
            <Key theme={Theme.dark} />
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validateOnMount={false}
              validationSchema={validationSchema}
            >
              {({ dirty, errors, isSubmitting, touched, isValid, handleChange }) => (
                <Form>
                  <Input
                    theme={Theme.dark}
                    errors={errors}
                    type="text"
                    label="License"
                    name="licenseKey"
                    touched={touched}
                    onChange={handleChange}
                  />
                  <S.Button
                    dirty={dirty}
                    disabled={isSubmitting}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                    text="Submit"
                    color={ButtonColor.blue}
                    type={ButtonType.submit}
                  />
                </Form>
              )}
            </Formik>
            {activeLicenseStatus === 'DEVICE_MISMATCH' && (
              <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #dc3545', borderRadius: '4px', background: 'rgba(220, 53, 69, 0.1)' }}>
                <h4 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>Device Mismatch Detected</h4>
                <p style={{ fontSize: '12px', color: '#ccc' }}>Your license is bound to another device. Please contact support for recovery.</p>
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '11px', marginBottom: '4px' }}><strong>Support Code:</strong> {Math.random().toString().slice(2, 10)}</p>
                  <p style={{ fontSize: '11px' }}><strong>Device Signature:</strong> {window.btoa(navigator.userAgent).slice(0, 16)}...</p>
                </div>
                <button 
                  onClick={() => alert('Recovery request sent to support.')}
                  style={{ marginTop: '10px', background: '#14263E', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Request Recovery
                </button>
              </div>
            )}
          </S.CardBody>

          <S.CardFooter>
            <S.Span> { new Date().getFullYear() } @ Cebu Innosoft Solution Services Inc.</S.Span>
            <S.Span> iPOS {APP_VERSION}</S.Span>
            <button onClick={() => dispatch(setActiveWindow('pos-manager'))} style={{ marginTop: '8px', padding: '6px 16px', cursor: 'pointer' }}>Go to POS App</button>
          </S.CardFooter>
        </S.CardContainer>
      </S.Container>
    </>
  )
}
