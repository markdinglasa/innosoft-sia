import { mdiKey } from '@mdi/js';
import { GeneratedLicense, Input, SelectInput } from '@shared/components';
import {
  ButtonColor,
  ButtonType,
  GenerateLicense as IGenerateLicense,
  SFC,
  SqlChannel,
  ToastType
} from '@shared/types';
import { displayToast } from '@shared/utils';
import yup from '@shared/utils/yup';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import * as S from './Styles';

export const GenerateLicense: SFC = ({ className }) => {
  //const dispatch = useDispatch<WindowDispatch>()
  const [licenseKey, setLicenseKey] = useState('')
  const initialValues = { 
    Key: '',
    BusinessType: '',
    LicenseType: '',
    Duration: 0,
  }
  type FormValues = typeof initialValues

  const handleSubmit = async (values: FormValues) => {
    const data: IGenerateLicense = {
      Key: values.Key,
      BusinessType: values.BusinessType,
      LicenseType: values.LicenseType,
      Duration: values.Duration,
    }

    try {
      const response = await window.electron.sql.post(SqlChannel.generateLicense, data)
      //console.log('resonse', response.Data)
      if (response.Data) {
        setLicenseKey(response.Data)
        displayToast('Success', ToastType.success)
      } else {
        displayToast(response.Message, ToastType.error)
      }
    } catch (error) {1
      displayToast('License Error!', ToastType.error)
    }
  }


  const businessType = [
    { value: '', label: 'Choose an option' },
    { value: 'retail', label: 'Retail' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'hotel', label: 'Hotel' },
  ];
  const licenseType = [
    { value: '', label: 'Choose an option' },
    { value: 'administrator', label: 'Administrator' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'teller', label: 'Teller' },
  ];
  const durationOps = [
    { value: '', label: 'Choose an option' },
    { value: '365', label: 'Annual' },
    { value: '90', label: 'Quarter' },
    { value: '30', label: 'Monthly' },
    { value: '14', label: 'Trial' },
  ];
  const validationSchema = yup.object({
    Key: yup.string().required('Required'),
    BusinessType: yup.string().required('Required'),
    LicenseType: yup.string().required('Required'),
    Duration: yup.string().required('Required'),
  });
  
  return (
    <>
      <S.Container>
        <S.CardContainer>
          <S.CardHeader className={className}>
            <S.Icon path={mdiKey} size="40px" />
            <S.CardTitle> Generate License</S.CardTitle>
          </S.CardHeader>
          <S.CardBody className={className}>
            <GeneratedLicense license={licenseKey} />
            <Formik
             initialValues={initialValues}
              onSubmit={handleSubmit}
              validateOnMount={false}
              validationSchema={validationSchema}
            >
              {({ dirty, errors, isSubmitting, touched, isValid }) => (
                <Form>
                  <Input
                    errors={errors}
                    type="text"
                    label="Key"
                    name="Key"
                    touched={touched}
                  />
                  <SelectInput
                    label="Business Type"
                    name="BusinessType"
                    options={businessType}
                    errors={errors}
                    touched={touched}
                  />
                  <SelectInput
                    label="License Type"
                    name="LicenseType"
                    options={licenseType}
                    errors={errors}
                    touched={touched}
                  />
                  <SelectInput
                    label="Duration"
                    name="Duration"
                    options={durationOps}
                    errors={errors}
                    touched={touched}
                  />
                  <S.Button
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
          <S.CardFooter>
            <S.Span> 2024 @ Cebu Innosoft Solution Services Inc.</S.Span>
            <S.Span> Innosoft SIA v1.0</S.Span>
          </S.CardFooter>
        </S.CardContainer>
      </S.Container>
    </>
  )
}
