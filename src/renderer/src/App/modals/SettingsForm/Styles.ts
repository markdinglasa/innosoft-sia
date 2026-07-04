import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import { Form as UForm } from 'formik'
import styled from 'styled-components'
import { Modal } from '../../components'

export const UModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  max-width: 40rem;
  min-width: 38rem;
  background: ${colors.primary};
  max-height: 85vh;
  min-height: fit;
`
export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: calc(80vh - 5rem);
`
export const Title = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  padding-bottom: 1rem;
  color: ${colors.white};
`
export const CardBody = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5rem;
`
export const Button = styled(UButton)`
  width: 100%;
`
export const Div = styled.div`
  padding-left: 5px;
`
export const ZReadingCon = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem 0;
  gap: 2rem;
`
export const TextAreaContainer = styled.div`
  padding: 0 0 1rem 0;
`
export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  height: 5rem;
`
export const Form = styled(UForm)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`
