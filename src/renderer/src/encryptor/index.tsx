import { mdiLockPlus } from '@mdi/js'
import { Input, Key } from '@shared/components'
import { APP_VERSION } from "@shared/constants"
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
import { Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'
import * as S from './Styles'
import { encryptInput } from "./encryption"

export const Encryptor: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [encryptedKey, setEncryptedKey] = useState('')
  const initialValues = {
    inputKey: ''
  }
  type FormValues = typeof initialValues

  let sb: Snackbar, message: string, type: ToastType
  const handleSubmit = async (values: FormValues) => {
    const data = {
      inputKey: values.inputKey
    }
    try {
      const ENCRYPTION_PASSPHRASE = 'clrpSecretK3y';
     const response = encryptInput(data.inputKey, ENCRYPTION_PASSPHRASE)
      console.log('resonse', response)
      if (response) {
        setEncryptedKey(response)
        message = Success.s00x00
        type = ToastType.success
      } else {
        message = 'Input is now encrypted'
        type = ToastType.error
      }
    } catch (error: any) {
      message = Error.e00x02
      type = ToastType.error
    }
    sb = { display: true, message: message, type: type }
    dispatch(setSnackbar(sb))
  }

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      inputKey: yup.string().required('Required')
    })
  }, [])

  return (
    <>
      <S.Container>
        <S.CardContainer>
          <S.CardHeader className={className}>
            <S.Icon path={mdiLockPlus} size="40px" />
            <S.CardTitle>Encrypt</S.CardTitle>
          </S.CardHeader>
          <S.CardBody className={className}>
           {
             encryptedKey && <Key theme={Theme.dark} encryptedKey={encryptedKey} />
           }
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validateOnMount={false}
              validationSchema={validationSchema}
            >
              {({ dirty, errors, isSubmitting, touched, isValid, handleChange }) => (
                <Form>
                  <Input
                    theme={Theme.dark}
                    errors={errors}
                    type="text"
                    label="Environment Variable"
                    name="inputKey"
                    touched={touched}
                    onChange={handleChange}
                  />
                  <S.Button
                    dirty={dirty}
                    disabled={isSubmitting}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                    text="Submit"
                    color={ButtonColor.green}
                    type={ButtonType.submit}
                  />
                </Form>
              )}
            </Formik>
          </S.CardBody>
          <S.CardFooter>
            <S.Span> { new Date().getFullYear() } @ Questnova Solutions Inc.</S.Span>
            <S.Span> Encryptor {APP_VERSION}</S.Span>
          </S.CardFooter>
        </S.CardContainer>
      </S.Container>
    </>
  )
}
