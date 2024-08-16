import { mdiDatabase } from '@mdi/js';
import { CardFooter, Input } from '@shared/components';
import { getActiveDBConfig } from '@shared/selectors';
import { setActiveDatabaseConfig } from '@shared/store/manager';
import {
  ButtonColor,
  ButtonType,
  DBConfig as Config,
  SFC,
  SqlChannel,
  Theme,
  ToastType,
  WindowDispatch
} from '@shared/types';
import { displayToast } from '@shared/utils';
import yup from '@shared/utils/yup';
import { Form, Formik } from 'formik';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as S from './Styles';

export const DBConfigForm: SFC = ({ className }) => {
  const theme = Theme.light
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
        displayToast('Connection failed', ToastType.error)
      }
    } catch (error: any) {
      displayToast(`${error}`, ToastType.error)
    }
  }

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      server: yup.string().required('Server is required'),
      name: yup.string().required('Name is required'),
      user: yup.string().required('User is required'),
      password: yup.string().required('Password is required'),
      port: yup.number().integer().required('Port is required').notOneOf([0], 'Port cannot be 0')
    })
  }, [])
  return (
    <>
      <S.Container>
        <S.CardContainer className={className} theme={theme}>
          <S.CardHeader>
            <S.Icon path={mdiDatabase} size="40px" theme={theme} />
            <S.CardTitle theme={theme}> Database Configuration</S.CardTitle>
          </S.CardHeader>
          <S.CardBody>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validateOnMount={false}
              validationSchema={validationSchema}
              enableReinitialize={true}
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
          <CardFooter />
        </S.CardContainer>
      </S.Container>
    </>
  )
}
