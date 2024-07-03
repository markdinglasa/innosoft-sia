import { Input } from '@shared/components'
import { setActiveToken, setActiveUser, setActiveWindow } from '@shared/store/manager'
import { ButtonColor, ButtonType, SFC, ToastType, WindowDispatch, Windows } from '@shared/types'
import { SqlChannel } from '@shared/types/sql'
import { displayToast } from '@shared/utils/toast'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'
import * as S from './Styles'

export const Login: SFC = ({ className }) => {
  const dispatch = useDispatch<WindowDispatch>()

  const initialValues = {
    UserName: '',
    Password: ''
  }

  type FormValues = typeof initialValues

  const handleSubmit = async (values: FormValues) => {
    const data = {
      UserName: values.UserName,
      Password: values.Password
    }

    try {
        let UserName = data.UserName, Password = data.Password
        const response = await window.electron.sql.post(SqlChannel.login, {UserName, Password});
        if (response.IsLogin) {
          dispatch(setActiveUser(response.User))
          dispatch(setActiveToken(response.AccessToken))
          dispatch(setActiveWindow(Windows.sia))
        }
      else {
        dispatch(setActiveUser(null))
        dispatch(setActiveToken(null))
        dispatch(setActiveWindow(Windows.login))
        displayToast(response.Message, ToastType.error)
      }
    } catch (error: any) {
      displayToast(`${error}`, ToastType.error)
    }
  }
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      UserName: yup.string().required('Username is required'),
      Password: yup.string().required('Password is required')
    })
  }, [])

  return (
    <>
      <S.Container className={className}>
        <S.Left>
          <S.H1>
            INNO<S.SpanH1>SOFT</S.SpanH1>
          </S.H1>
          <S.SpanSub>Grow your business with Innosoft</S.SpanSub>
        </S.Left>
        <S.Right>
          <S.LoginCon>
            <S.LoginConBody>
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
                      label="Username"
                      name="UserName"
                      touched={touched}
                    />
                    <Input
                      errors={errors}
                      type="password"
                      label="Password"
                      name="Password"
                      touched={touched}
                    />
                    <S.Button
                      dirty={dirty}
                      disabled={isSubmitting}
                      isSubmitting={isSubmitting}
                      isValid={isValid}
                      text="Sign In"
                      color={ButtonColor.blue}
                      type={ButtonType.submit}
                    />
                  </Form>
                )}
              </Formik>
            </S.LoginConBody>
            <S.LoginConFooter>
              <S.Span> 2024 @ Cebu Innosoft Solution Services Inc.</S.Span>
              <S.Span> Innosoft SIA v1.0</S.Span>
            </S.LoginConFooter>
          </S.LoginCon>
        </S.Right>
      </S.Container>
    </>
  )
}

