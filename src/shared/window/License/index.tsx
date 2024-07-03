import { mdiKey } from '@mdi/js'
import { Input, Key } from '@shared/components'
import { setActiveLicense, setActiveWindow } from '@shared/store/manager'
import { ButtonColor, ButtonType, SFC, ToastType, WindowDispatch, Windows } from '@shared/types'
import { SqlChannel } from '@shared/types/sql'
import { displayToast } from '@shared/utils/toast'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'
import * as S from './Styles'

export const License: SFC = ({ className }) => {
  const dispatch = useDispatch<WindowDispatch>()
  const initialValues = {
    license: ''
  }
  type FormValues = typeof initialValues

  const handleSubmit = async (values: FormValues) => {
    const data = {
      license: values.license
    }

    try {
      const response = await window.electron.sql.post(SqlChannel.isLicense, data.license)
      console.log('resonse', response);
      if (response.IsLicense) {
        dispatch(setActiveLicense(data.license));
        dispatch(setActiveWindow(Windows.login));
        displayToast('Success', ToastType.success)
      } else {
        displayToast(response.Message, ToastType.error);
      }
    } catch (error) {
      displayToast('License Error!', ToastType.error)
    }
  }

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      license: yup.string().required('Server is required')
    })
  }, [])

  return (
    <>
      <S.Container>
        <S.CardContainer>
          <S.CardHeader className={className}>
            <S.Icon path={mdiKey} size="40px" />
            <S.CardTitle> License Key</S.CardTitle>
          </S.CardHeader>
          <S.CardBody className={className}>
            <Key />
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validateOnMount={false}
              validationSchema={validationSchema}
            >
              {({ dirty, errors, isSubmitting, touched, isValid }) => (
                <Form>
                  <Input
                    errors={errors}
                    type="text"
                    label="License"
                    name="license"
                    touched={touched}
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
            <S.Span> 2024 @ Cebu Innosoft Solution Services Inc.</S.Span>
            <S.Span> Innosoft SIA v1.0</S.Span>
          </S.CardFooter>
        </S.CardContainer>
      </S.Container>
    </>
  )
}
