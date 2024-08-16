import { mdiKey } from '@mdi/js'
import { CardFooter, Input, Key } from '@shared/components'
import { Error, Success } from '@shared/messages'
import { getActiveLicense } from '@shared/selectors'
import { setActiveLicense } from '@shared/store/manager'
import {
  ButtonColor,
  ButtonType,
  SFC,
  SqlChannel,
  Theme,
  ToastType,
  WindowDispatch
} from '@shared/types'
import { displayToast } from '@shared/utils'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import * as S from './Styles'

export const LicenseForm: SFC = ({ className }) => {
  const dispatch = useDispatch<WindowDispatch>()
  const theme = Theme.light
  const licenseKey = useSelector(getActiveLicense)
  const initialValues = {
    licenseKey: licenseKey || ''
  }
  type FormValues = typeof initialValues
  const handleSubmit = async (values: FormValues) => {
    const data = {
      licenseKey: values.licenseKey
    }
    try {
      const response = await window.electron.sql.post(SqlChannel.isLicense, data.licenseKey)
      if (response.IsSomething) {
        dispatch(setActiveLicense(data.licenseKey))
        displayToast(Success.s00x00, ToastType.success)
      } else {
        dispatch(setActiveLicense(null))
        displayToast(response.Message, ToastType.error)
      }
    } catch (error: any) {
      dispatch(setActiveLicense(null))
      displayToast(Error.e00x02, ToastType.error)
    }
  }

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      licenseKey: yup.string().required('Required')
    })
  }, [])

  return (
    <>
      <S.Container theme={theme}>
        <S.CardContainer theme={theme}>
          <S.CardHeader className={className}>
            <S.Icon path={mdiKey} size="40px" theme={theme} />
            <S.CardTitle theme={theme}> License Key</S.CardTitle>
          </S.CardHeader>
          <S.CardBody className={className}>
            <Key theme={theme} />
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validateOnMount={false}
              validationSchema={validationSchema}
            >
              {({ dirty, errors, isSubmitting, touched, isValid, values, handleChange }) => (
                <Form>
                  <Input
                    theme={theme}
                    errors={errors}
                    type="text"
                    label="License"
                    name="licenseKey"
                    touched={touched}
                    value={values.licenseKey}
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
          <CardFooter />
        </S.CardContainer>
      </S.Container>
    </>
  )
}
