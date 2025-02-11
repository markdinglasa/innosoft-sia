import { Input, SwitchButton } from '@shared/components'
import { useToggle } from '@shared/hooks'
import { Error, Success } from '@shared/messages'
import { getSettings } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, ButtonColor, ButtonType, SFC, Theme, ToastType } from '@shared/types'
import yup from '@shared/utils/yup'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSettings } from '../../store/settings'
import { settingsInitial, SettingsTable } from '../../types'
import * as S from './Styles'

interface DatabaseModalProps {
  close(): void
  theme?: Theme
}

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
    MachineNumber: settings.MachineNumber || null
  }

  //type FormValues = typeof initialValues
  const handleSubmit = async (values: any) => {
    try {
      dispatch(setSettings(values))
      dispatch(setSnackbar({ display: true, message: Success.s00x00, type: ToastType.success }))
    } catch (error: any) {
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
      MachineNumber: yup.string().required('Machine Number is required')
    })
  }, [])
  const [IsDateRange, toggleDateRange] = useToggle(false)
  const [IsZReading, toggleZReading] = useToggle(false)
  return (
    <>
      <S.UModal className={className} close={close} header="Settings" theme={theme}>
        <S.Container className={className}>
          <S.CardBody>
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
                setFieldValue
              }) => (
                <Form>
                  <S.Div>
                    <SwitchButton
                      Name="IsDarkMode"
                      Label="Dark Mode"
                      Disabled={false}
                      OnChange={handleChange}
                      Values={values.IsDarkMode}
                      Errors={errors}
                      Touched={touched}
                    />
                    <SwitchButton
                      Name="IsDateRange"
                      Label="Date Range"
                      Disabled={false}
                      OnChange={(_: any, _value: any) => {
                        toggleDateRange() // toggle first
                        setTimeout(() => {
                          setFieldValue('IsZReading', false)
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
                          setFieldValue('IsDateRange', false)
                        }, 0)
                      }}
                      Values={values.IsZReading}
                      Errors={errors}
                      Touched={touched}
                    />
                  </S.Div>
                  <S.Div>
                    {values.IsZReading && (
                      <>
                        <S.ZReadingCon>
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
                            label="PermitNumber"
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
                        </S.ZReadingCon>
                      </>
                    )}
                  </S.Div>
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
