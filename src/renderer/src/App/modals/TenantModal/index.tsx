import { Input, SelectOption } from '@shared/components'
import { Error as ErrorMsg, Success } from '@shared/messages'
import { setSnackbar } from '@shared/store/manager'
import {
  AppDispatch,
  ButtonColor,
  ButtonType,
  SFC,
  Snackbar,
  Theme,
  ToastType,
  SqlChannel
} from '@shared/types'
import yup from '@shared/utils/yup'
import { Formik } from 'formik'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveTenant, getTenant, getTerminals } from '../../selectors'
import { setTenant, setTerminals } from '../../store/manager'
import { Tenant, Tenants } from '../../types'
import * as S from './Styles'

interface TenantModalProps {
  close(): void
  theme?: Theme
}

export const TenantModal: SFC<TenantModalProps> = ({ className, close, theme }) => {
  const dispatch = useDispatch<AppDispatch>()
  const tenant = useSelector(getTenant)
  const activeTenant = useSelector(getActiveTenant)
  const terminals = useSelector(getTerminals)

  useEffect(() => {
    if (terminals.length === 0) {
      const fetchTerminals = async () => {
        try {
          const response = await window.electron.sql.get(SqlChannel.getTerminals)
          if (response?.Data) {
            const list = response.Data.map((item: any) => ({
              id: item.id ?? item.Id,
              terminal: item.terminal ?? item.Terminal
            }))
            dispatch(setTerminals(list))
          }
        } catch (error) {
          console.error('Failed to fetch terminals:', error)
        }
      }
      fetchTerminals()
    }
  }, [dispatch, terminals])

  const terminalOptions = useMemo(() => {
    return [
      { label: 'Select Terminal', value: '0' },
      ...terminals.map((t) => ({
        label: t.terminal,
        value: String(t.id)
      }))
    ]
  }, [terminals])

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
        BranchCode: activeTenant === Tenants.SM ? values.BranchCode : '',
        TenantCode: values.TenantCode,
        SMClassCode: activeTenant === Tenants.SM ? values.SMClassCode : '',
        StoreNumber: activeTenant === Tenants.SM ? values.StoreNumber : '',
        SMSalesType: activeTenant === Tenants.SM ? values.SMSalesType : '',
        POSMachineNumber: activeTenant === Tenants.SM ? values.POSMachineNumber : '',
        POSSerialNumber: activeTenant === Tenants.SM ? values.POSSerialNumber : '',
        POSKey: (activeTenant === Tenants.SM || activeTenant === Tenants.ALLIANCE) ? values.POSKey : '',
        Terminal: String(values.Terminal)
      }
      dispatch(setTenant(data))
      close()
      message = Success.s00x00
      type = ToastType.success
    } catch (error: unknown) {
      console.log('Tenant Modal ERROR: ', (error as Error)?.message)
      message = ErrorMsg.e00x01
      type = ToastType.error
    }
    sb = { display: true, message: message, type: type }
    dispatch(setSnackbar(sb))
  }

  const validationSchema = useMemo(() => {
    if (activeTenant === Tenants.MW) {
      return yup.object().shape({
        TenantCode: yup.string().required('Required'),
        Terminal: yup.number().integer().required('Required').notOneOf([0], 'Terminal cannot be 0')
      })
    } else if (activeTenant === Tenants.ALLIANCE) {
      return yup.object().shape({
        TenantCode: yup.string().required('Required'),
        POSKey: yup.string().nullable().optional(),
        Terminal: yup.number().integer().required('Required').notOneOf([0], 'Terminal cannot be 0')
      })
    } else {
      // Tenants.SM (and default fallback)
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
    }
  }, [activeTenant])

  return (
    <S.UModal className={className} close={close} header="Select Tenant" theme={theme}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnMount={false}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {({ dirty, errors, isSubmitting, touched, isValid, values, handleChange }) => (
          <S.Form>
            {activeTenant === Tenants.SM && (
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
            )}
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
            {activeTenant === Tenants.SM && (
              <>
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
              </>
            )}
            {(activeTenant === Tenants.SM || activeTenant === Tenants.ALLIANCE) && (
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
            )}
            <SelectOption
              label="Terminal"
              name="Terminal"
              value={String(values.Terminal)}
              onChange={handleChange}
              options={terminalOptions}
              disabled={isSubmitting}
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
