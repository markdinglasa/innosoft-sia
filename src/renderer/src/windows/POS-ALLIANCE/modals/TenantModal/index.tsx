import { Input } from '@shared/components'
import { Error, Success } from '@shared/messages'
import { setSnackbar } from '@shared/store/manager'
import { ButtonColor, ButtonType, SFC, Snackbar, Theme, ToastType, WindowDispatch } from '@shared/types'
import yup from '@shared/utils/yup'
import { Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTenant } from '../../selectors'
import { setTenant } from '../../store/manager'
import { Tenant } from '../../types'
import * as S from './Styles'

interface TenantModalProps {
  close(): void
  theme?: Theme
}

export const TenantModal: SFC<TenantModalProps> = ({ className, close, theme}) => {
  const dispatch = useDispatch<WindowDispatch>()
  const tenant = useSelector(getTenant)
  const initialValues: Tenant = {
    tenantId: tenant?.tenantId || '',
    tenantName: tenant?.tenantName || '',
    terminalId: tenant?.terminalId || 0,
  }
  type FormValues = typeof initialValues
  let sb: Snackbar, message: string, type: ToastType
  
  const handleSubmit = (values: FormValues) => {
    try {
      const data: Tenant = {
        tenantId: values.tenantId,
        tenantName: values.tenantName,
        terminalId: values.terminalId,
      }
      dispatch(setTenant(data))
      close();
      message=Success.s00x00
      type=ToastType.success
    } catch (error: any) {
      message=Error.e00x01
      type=ToastType.error
    }
    sb = {display: true, message: message, type: type}
    dispatch(setSnackbar(sb))
  }

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      tenantId: yup.number().integer().required('Required').notOneOf([0], 'Tenant Id cannot 0'),
      tenantName: yup.string().required('Required'),
      terminalId: yup.number().integer().required('Required').notOneOf([0], 'Terminal cannot be 0')
    })
  }, [])

  return (
    <S.UModal className={className} back={close} header="Select Tenant" theme={theme}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnMount={false}
        validationSchema={validationSchema}
        enableReinitialize={true} // Add this line
      >
        {({ dirty, errors, isSubmitting, touched, isValid, values, handleChange }) => (
          <S.Form>
            <S.FormControl>
              <S.FormInput>
                  <Input
                    errors={errors}
                    type="number"
                    label="Tenant Id"
                    name="tenantId"
                    touched={touched}
                    value={values.tenantId}
                    onChange={handleChange}
                  />
              </S.FormInput>
              <S.FormInput>
                <Input
                  errors={errors}
                  type="text"
                  label="Tenant Name"
                  name="tenantName"
                  touched={touched}
                  value={values.tenantName}
                  onChange={handleChange}
                />
              </S.FormInput>
            </S.FormControl>
            <S.FormControl>
              <S.FormInput>
                <Input
                  errors={errors}
                  type="number"
                  label="Terminal Id"
                  name="terminalId"
                  touched={touched}
                  value={String(values.terminalId)} // Ensure value is a string
                  onChange={handleChange}
                />
              </S.FormInput>
            </S.FormControl>
            <S.Button
              dirty={dirty}
              disabled={isSubmitting}
              isSubmitting={isSubmitting}
              isValid={isValid}
              text="Submit"
              color={ButtonColor.blue}
              type={ButtonType.submit}
            />
          </S.Form>
        )}
      </Formik>
    </S.UModal>
  )
}
