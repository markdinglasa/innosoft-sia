import { Input } from '@shared/components'
import { Error, Success } from '@shared/messages'
import { getActiveDBConfig } from '@shared/selectors'
import { setActiveDatabaseConfig, setSnackbar } from '@shared/store/manager'
import {
  ButtonColor,
  ButtonType,
  DBConfig as Config,
  SFC,
  Snackbar,
  SqlChannel,
  Theme,
  ToastType,
  WindowDispatch
} from '@shared/types'
import yup from '@shared/utils/yup'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as S from './Styles'


interface DatabaseModalProps {
  close(): void
  theme?: Theme
}

export const DatabaseModal: SFC<DatabaseModalProps> = ({ className, close, theme }) => {
  const dispatch = useDispatch<WindowDispatch>()
  const config = useSelector(getActiveDBConfig)
  const initialValues: Config = {
    server: config?.server || '',
    name: config?.name || '',
    user: config?.user || '',
    password: config?.password || '',
    port: config?.port || 0
  }
  type FormValues = typeof initialValues
  let sb: Snackbar, message: string, type: ToastType;
  const handleSubmit = async (values: FormValues) => {

    const config: Config = {
      server: values.server,
      name: values.name,
      user: values.user,
      password: values.password,
      port: values.port
    }
    try {
      const response = await window.electron.sql.post(SqlChannel.setConnection, config)
      const isConnected: boolean = await window.electron.sql.get(SqlChannel.isConnected)
      if (response.IsSomething && isConnected) {
        dispatch(setActiveDatabaseConfig(config))
        close();
        message=Success.s00x00
        type=ToastType.success
      } else {
        dispatch(setActiveDatabaseConfig(null))
        close();
        message=Error.e00x01
        type=ToastType.error
      }
    } catch (error: any) {
      dispatch(setActiveDatabaseConfig(null))
      close();
      message=Error.e00x02
      type=ToastType.error
    }
    sb = {display: true, message: message, type: type}
    dispatch(setSnackbar(sb))
  }

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      server: yup.string().required('Required'),
      name: yup.string().required('Required'),
      user: yup.string().required('Required'),
      password: yup.string().required('Required'),
      port: yup.number().integer().required('Required').notOneOf([0], 'Port cannot be 0')
    })
  }, [])
  return (
    <>
      <S.UModal className={className} close={close} header="Select Database" theme={theme}>
      <S.Container className={className}>
        <S.CardBody>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnMount={false}
            validationSchema={validationSchema}
            enableReinitialize={true} // Add this line
          >
            {({ dirty, errors, isSubmitting, touched, isValid, values, handleChange }) => (
              <Form>
                <Input
                  theme={theme}
                  errors={errors}
                  type="text"
                  label="Server"
                  name="server"
                  value={values.server}
                  onChange={handleChange}
                  touched={touched}
                />
                <Input
                  theme={theme}
                  errors={errors}
                  type="text"
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  touched={touched}
                />
                <Input
                  theme={theme}
                  errors={errors}
                  type="text"
                  label="User"
                  name="user"
                  value={values.user}
                  onChange={handleChange}
                  touched={touched}
                />
                <Input
                  theme={theme}
                  errors={errors}
                  type="password"
                  label="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  touched={touched}
                />
                <Input
                  theme={theme}
                  errors={errors}
                  type="number"
                  label="Port"
                  name="port"
                  value={values.port.toString()}
                  onChange={handleChange}
                  touched={touched}
                />
                <S.Button
                  className={'width:100% !important;'}
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
      </S.Container>
    </S.UModal>
    </>
  )
}
