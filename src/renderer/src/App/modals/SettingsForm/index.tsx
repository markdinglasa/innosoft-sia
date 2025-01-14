import { SwitchButton } from '@shared/components'
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
    IsDateRange: settings.IsDateRange || false
  }
  type FormValues = typeof initialValues
  const handleSubmit = async (values: FormValues) => {
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
      IsDarkMode: yup.boolean().required('Dark Mode is required')
    })
  }, [])

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
              {({ dirty, errors, isSubmitting, touched, isValid, values, handleChange }) => (
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
                      OnChange={handleChange}
                      Values={values.IsDateRange}
                      Errors={errors}
                      Touched={touched}
                    />
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
