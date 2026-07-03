import { Input, SwitchButton, TextArea } from '@shared/components'
import { useToggle } from '@shared/hooks'
import { Error, Success } from '@shared/messages'
import { getSettings } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, ButtonColor, ButtonType, SFC, Theme, ToastType } from '@shared/types'
import yup from '@shared/utils/yup'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UpdateChecker } from '../../components'
import { setSettings } from '../../store/settings'
import { settingsInitial, SettingsTable } from '../../types'
import * as S from './Styles'

interface DatabaseModalProps {
  close(): void
  theme?: Theme
}
export const InvoiceFooter = `
--------------------------------------------
    Cebu Innosoft Solutions Services Inc.
    V. Rama Ave. Cebu City, Philippines
          TIN: 261-481-387-000
      ACCR: 082-261481387-000375-24583
        ACCR Date: August 20, 2020
        Date Issued: January 01, 2026
        PTU:FP032024-074-0438792-00000
--------------------------------------------`
export const SettingsModal: SFC<DatabaseModalProps> = ({ className, close, theme }) => {
  const dispatch = useDispatch<AppDispatch>()
  const settings = useSelector(getSettings)

  const initialValues: SettingsTable = {
    IsDarkMode: settings.IsDarkMode || false,
    IsDateRange: settings.IsDateRange || false,
    DateStart: settings.DateStart || null,
    DateEnd: settings.DateEnd || null,
    IsZReading: settings.IsZReading || false,
    Name: settings.Name || null,
    Address: settings.Address || null,
    Operator: settings.Operator || null,
    PermitNumber: settings.PermitNumber || null,
    TIN: settings.TIN || null,
    AccreditationNumber: settings.AccreditationNumber || null,
    SerialNumber: settings.SerialNumber || null,
    MachineNumber: settings.MachineNumber || null,
    InvoiceFooter: settings?.InvoiceFooter || InvoiceFooter
  }

  //type FormValues = typeof initialValues
  const handleSubmit = async (values: any) => {
    try {
      dispatch(setSettings(values))
      dispatch(setSnackbar({ display: true, message: Success.s00x00, type: ToastType.success }))
    } catch {
      dispatch(setSettings(settingsInitial))
      close()
      dispatch(setSnackbar({ display: true, message: Error.e00x02, type: ToastType.error }))
    }
  }
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      IsDateRange: yup.boolean().required('Date Range is required'),
      IsDarkMode: yup.boolean().required('Dark Mode is required'),
      IsZReading: yup.boolean().required('IsZReading is required'),
      Name: yup.string().required('Store Name is required'),
      Address: yup.string().required('Store Address is required'),
      Operator: yup.string().required('Operator is required'),
      PermitNumber: yup.string().required('Permit Number is required'),
      TIN: yup.string().required('TIN is required'),
      AccreditationNumber: yup.string().required('Accreditation Number is required'),
      SerialNumber: yup.string().required('Serial Number is required'),
      MachineNumber: yup.string().required('Machine Number is required'),
      InvoiceFooter: yup.string().nullable().optional()
    })
  }, [])
  const [IsDateRange, toggleDateRange] = useToggle(false)
  const [IsZReading, toggleZReading] = useToggle(false)
  return (
    <S.UModal className={className} close={close} header="Settings" theme={theme}>
      <S.Container className={className}>
        <S.CardBody>
          <UpdateChecker />
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnMount={false}
            validationSchema={validationSchema}
            enableReinitialize={true} // Add this line
          >
            {({
              dirty,
              errors,
              isSubmitting,
              touched,
              isValid,
              values,
              handleChange,
              handleBlur,
              setFieldValue
            }) => (
              <Form>
                <S.Div>
                  <SwitchButton
                    Name="IsDateRange"
                    Label="Date Range"
                    Disabled={false}
                    OnChange={(_: any, _value: any) => {
                      toggleDateRange() // toggle first
                      setTimeout(() => {
                        //setFieldValue('IsZReading', false)
                        setFieldValue('IsDateRange', !IsDateRange) // use updated state
                      }, 0)
                    }}
                    Values={values.IsDateRange}
                    Errors={errors}
                    Touched={touched}
                  />
                  <SwitchButton
                    Name="IsZReading"
                    Label="Include Z Reading"
                    Disabled={false}
                    OnChange={(_: any, _value: any) => {
                      toggleZReading() // toggle first
                      setTimeout(() => {
                        setFieldValue('IsZReading', !IsZReading) // use updated state
                        //setFieldValue('IsDateRange', false)
                      }, 0)
                    }}
                    Values={values.IsZReading}
                    Errors={errors}
                    Touched={touched}
                  />
                </S.Div>

                {values.IsZReading && (
                  <S.ZReadingCon>
                    <S.Title>Z Reading Headers</S.Title>
                    <div>
                      <Input
                        theme={theme}
                        errors={errors}
                        type="text"
                        label="Store Name"
                        name="Name"
                        value={values?.Name || ''}
                        onChange={handleChange}
                        touched={touched}
                      />
                    </div>
                    <Input
                      theme={theme}
                      errors={errors}
                      type="text"
                      label="Store Address"
                      name="Address"
                      value={values?.Address || ''}
                      onChange={handleChange}
                      touched={touched}
                    />
                    <Input
                      theme={theme}
                      errors={errors}
                      type="text"
                      label="Operator"
                      name="Operator"
                      value={values?.Operator || ''}
                      onChange={handleChange}
                      touched={touched}
                    />
                    <Input
                      theme={theme}
                      errors={errors}
                      type="text"
                      label="Permit Number"
                      name="PermitNumber"
                      value={values?.PermitNumber || ''}
                      onChange={handleChange}
                      touched={touched}
                    />
                    <Input
                      theme={theme}
                      errors={errors}
                      type="text"
                      label="TIN"
                      name="TIN"
                      value={values?.TIN || ''}
                      onChange={handleChange}
                      touched={touched}
                    />
                    <Input
                      theme={theme}
                      errors={errors}
                      type="text"
                      label="Accreditation Number"
                      name="AccreditationNumber"
                      value={values?.AccreditationNumber || ''}
                      onChange={handleChange}
                      touched={touched}
                    />
                    <Input
                      theme={theme}
                      errors={errors}
                      type="text"
                      label="Serial Number"
                      name="SerialNumber"
                      value={values?.SerialNumber || ''}
                      onChange={handleChange}
                      touched={touched}
                    />
                    <Input
                      theme={theme}
                      errors={errors}
                      type="text"
                      label="Machine Number"
                      name="MachineNumber"
                      value={values?.MachineNumber || ''}
                      onChange={handleChange}
                      touched={touched}
                    />
                    <S.TextAreaContainer>
                      <TextArea
                        label="Invoice Footer"
                        value={values?.InvoiceFooter || ''}
                        errors={errors}
                        touched={touched}
                        name="InvoiceFooter"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </S.TextAreaContainer>
                  </S.ZReadingCon>
                )}
                <S.ButtonContainer>
                  <S.Button
                    dirty={dirty}
                    disabled={isSubmitting}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                    text="Submit"
                    color={ButtonColor.blue}
                    type={ButtonType.submit}
                  />
                </S.ButtonContainer>
              </Form>
            )}
          </Formik>
        </S.CardBody>
      </S.Container>
    </S.UModal>
  )
}
