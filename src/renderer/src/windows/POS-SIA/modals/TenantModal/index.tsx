import { Input } from '@shared/components'
import { ButtonColor, ButtonType, SFC, ToastType, WindowDispatch } from '@shared/types'
import { displayToast } from '@shared/utils'
import yup from '@shared/utils/yup'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTenant } from '../../selectors'
import { setTenant } from '../../store/manager'
import { Tenant } from '../../types'
import * as S from './Styles'

interface TenantModalProps {
  close(): void
}


export const TenantModal: SFC<TenantModalProps> = ({ className, close }) => {
  const dispatch = useDispatch<WindowDispatch>();
  const tenant = useSelector(getTenant);
  const initialValues = {
    BranchCode: '',
    TenantCode: '',
    SMSalesType: '',
    Terminal: ''
  }
  type FormValues = typeof initialValues

  const handleSubmit = (values: FormValues) => {
    try{
      const data: Tenant = {
        BranchCode: values.BranchCode,
        TenantCode: values.TenantCode,
        SMSalesType: values.SMSalesType,
        Terminal: values.Terminal
      }
      dispatch(setTenant(data))
      displayToast('Successful', ToastType.success)
    } catch (error: any) {
      displayToast('Something went wrong', ToastType.error)
    }
    
  }

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      BranchCode: yup.string().required('Required'),
      TenantCode: yup.string().required('Required'),
      SMSalesType: yup.string().required('Required'),
      Terminal: yup.string().required('Required'),
    })
  }, [])
  
  return (
    <S.UModal className={className} close={close} header="Select Tenant">
      <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnMount={false}
            validationSchema={validationSchema}
          >
            {({ dirty, errors, isSubmitting, touched, isValid }) => (
              <Form>
                <Input errors={errors} type="text" label="Branch Code" name="BranchCode" touched={touched} value={tenant?.BranchCode}/>
                <Input errors={errors} type="text" label="Tenant Code" name="TenantCode" touched={touched} value={tenant?.TenantCode}/>
                <Input errors={errors} type="text" label="Sales Type" name="SMSalesType" touched={touched} value={tenant?.SMSalesType}/>
                <Input
                  errors={errors}
                  type="text"
                  label="Terminal"
                  name="Terminal"
                  touched={touched}
                  value={tenant?.Terminal}
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
    </S.UModal>
  )
}
