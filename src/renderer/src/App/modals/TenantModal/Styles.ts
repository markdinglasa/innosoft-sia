import { Button as UButton } from '@shared/components'
import { Form as F } from 'formik'
import styled from 'styled-components'
import { Modal } from '../../components'
export const UModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  min-width: 380px;
`
export const Button = styled(UButton)`
  width: 100%;
`
export const Form = styled(F)`
  height: 500px;
  overflow: auto;
`
