import { Input } from '@shared/components'
import { getActiveDBConfig } from '@shared/selectors'
import { setActiveDatabaseConfig } from '@shared/store/manager'
import {
  ButtonColor,
  ButtonType,
  DBConfig as Config,
  SFC,
  SqlChannel,
  ToastType,
  WindowDispatch
} from '@shared/types'
import { displayToast } from '@shared/utils'
import yup from '@shared/utils/yup'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as S from './Styles'

export const DBConfig: SFC = ({ className }) => {
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

  const handleSubmit = async (values: FormValues) => {
    // make the function async
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
        displayToast('Database Connected', ToastType.success)
      } else {
        dispatch(setActiveDatabaseConfig(null))
        displayToast('Connection failed', ToastType.error)
      }
    } catch (error: any) {
      dispatch(setActiveDatabaseConfig(null))
      displayToast(`${error}`, ToastType.error)
    }
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
                  errors={errors}
                  type="text"
                  label="Server"
                  name="server"
                  value={values.server}
                  onChange={handleChange}
                  touched={touched}
                />
                <Input
                  errors={errors}
                  type="text"
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  touched={touched}
                />
                <Input
                  errors={errors}
                  type="text"
                  label="User"
                  name="user"
                  value={values.user}
                  onChange={handleChange}
                  touched={touched}
                />
                <Input
                  errors={errors}
                  type="password"
                  label="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  touched={touched}
                />
                <Input
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
    </>
  )
}
