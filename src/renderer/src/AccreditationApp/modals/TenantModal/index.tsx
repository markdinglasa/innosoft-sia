import { Input } from '@shared/components'
import { Error, Success } from '@shared/messages'
import { setSnackbar } from '@shared/store/manager'
import {
  AppDispatch,
  ButtonColor,
  ButtonType,
  SFC,
  Snackbar,
  Theme,
  ToastType
} from '@shared/types'
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

export const TenantModal: SFC<TenantModalProps> = ({ className, close, theme }) => {
  const dispatch = useDispatch<AppDispatch>()
  const tenant = useSelector(getTenant)

  const initialValues: Tenant = {
    BranchCode: tenant?.BranchCode || '',
    TenantCode: tenant?.TenantCode || '',
    SMSalesType: tenant?.SMSalesType || '',
    Terminal: tenant?.Terminal || 0,
    POSSerialNumber: tenant?.POSSerialNumber || '',
    SMClassCode: tenant?.SMClassCode || '',
    StoreNumber: tenant?.StoreNumber || '',
    POSMachineNumber: tenant?.POSMachineNumber || '',
    POSKey: tenant?.POSKey || ''
  }

  type FormValues = typeof initialValues
  let sb: Snackbar, message: string, type: ToastType
  const handleSubmit = (values: FormValues) => {
    try {
      const data: Tenant = {
        BranchCode: values.BranchCode,
        TenantCode: values.TenantCode,
        SMClassCode: values.SMClassCode,
        StoreNumber: values.StoreNumber,
        SMSalesType: values.SMSalesType,
        POSMachineNumber: values.POSMachineNumber,
        POSSerialNumber: values.POSSerialNumber,
        POSKey: values.POSKey,
        Terminal: values.Terminal
      }
      dispatch(setTenant(data))
      close()
      message = Success.s00x00
      type = ToastType.success
    } catch (error: any) {
      message = Error.e00x01
      type = ToastType.error
    }
    sb = { display: true, message: message, type: type }
    dispatch(setSnackbar(sb))
  }
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      BranchCode: yup.string().nullable().optional(),
      TenantCode: yup.string().required('Required'),
      SMClassCode: yup.string().nullable().optional(),
      StoreNumber: yup.string().required('Required'),
      SMSalesType: yup.string().required('Required'),
      POSMachineNumber: yup.string().required('Required'),
      POSSerialNumber: yup.string().required('Required'),
      POSKey: yup.string().nullable().optional(),
      Terminal: yup.number().integer().required('Required').notOneOf([0], 'Terminal cannot be 0')
    })
  }, [])

  return (
    <S.UModal className={className} close={close} header="Select Tenant" theme={theme}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnMount={false}
        validationSchema={validationSchema}
        enableReinitialize={true} // Add this line
      >
        {({ dirty, errors, isSubmitting, touched, isValid, values, handleChange }) => (
          <S.Form>
            <Input
              theme={theme}
              errors={errors}
              type="text"
              label="Branch Code (Optional)"
              name="BranchCode"
              touched={touched}
              value={values.BranchCode}
              onChange={handleChange}
            />
            <Input
              theme={theme}
              errors={errors}
              type="text"
              label="Tenant Code"
              name="TenantCode"
              touched={touched}
              value={values.TenantCode}
              onChange={handleChange}
            />
            <Input
              theme={theme}
              errors={errors}
              type="text"
              label="Class Code (Optional)"
              name="SMClassCode"
              touched={touched}
              value={values.SMClassCode}
              onChange={handleChange}
            />
            <Input
              theme={theme}
              errors={errors}
              type="text"
              label="Store Number"
              name="StoreNumber"
              touched={touched}
              value={values.StoreNumber}
              onChange={handleChange}
            />
            <Input
              theme={theme}
              errors={errors}
              type="text"
              label="Sales Type"
              name="SMSalesType"
              touched={touched}
              value={values.SMSalesType}
              onChange={handleChange}
            />
            <Input
              theme={theme}
              errors={errors}
              type="text"
              label="POS Machine Number"
              name="POSMachineNumber"
              touched={touched}
              value={values.POSMachineNumber}
              onChange={handleChange}
            />
            <Input
              theme={theme}
              errors={errors}
              type="text"
              label="POS Serial Number"
              name="POSSerialNumber"
              touched={touched}
              value={values.POSSerialNumber}
              onChange={handleChange}
            />
            <Input
              theme={theme}
              errors={errors}
              type="text"
              label="POS Key (optional)"
              name="POSKey"
              touched={touched}
              value={values.POSKey}
              onChange={handleChange}
            />
            <Input
              theme={theme}
              errors={errors}
              type="number"
              label="Terminal"
              name="Terminal"
              touched={touched}
              value={String(values.Terminal)} // Ensure value is a string
              onChange={handleChange}
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
          </S.Form>
        )}
      </Formik>
    </S.UModal>
  )
}
