import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import { Form as UForm } from 'formik'
import styled from 'styled-components'
import { Modal } from '../../components'
export const UModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  min-width: 380px;
  background: ${colors.primary};
`
export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const CardBody = styled.div`
  width: 100%;
`
export const Button = styled(UButton)`
  width: 100%;
`
export const Form = styled(UForm)`
  max-height: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
