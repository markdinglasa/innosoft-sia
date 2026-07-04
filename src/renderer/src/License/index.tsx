import { mdiKey } from '@mdi/js'
import { Input, Key } from '@shared/components'
import { APP_VERSION } from '@shared/constants'
import { Error, Success } from '@shared/messages'
import { setActiveLicense, setSnackbar } from '@shared/store/manager'
import {
  AppDispatch,
  ButtonColor,
  ButtonType,
  SFC,
  Snackbar,
  SqlChannel,
  Theme,
  ToastType
} from '@shared/types'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'
import * as S from './Styles'

export const License: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
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
      console.log('resonse', response)
      if (response.IsSomething) {
        dispatch(setActiveLicense(data.licenseKey))
        message = Success.s00x00
        type = ToastType.success
      } else {
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
          </S.CardBody>
          <S.CardFooter>
            <S.Span> {new Date().getFullYear()} @ Cebu Innosoft Solution Services Inc.</S.Span>
            <S.Span> iSIA {APP_VERSION}</S.Span>
          </S.CardFooter>
        </S.CardContainer>
      </S.Container>
    </>
  )
}
