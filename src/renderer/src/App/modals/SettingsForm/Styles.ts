import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import styled from 'styled-components'
import { Modal } from '../../components'

export const UModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  min-width: 380px;
  background: ${colors.primary};
  max-height: 85vh;
  min-height: fit;
`
export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
`
export const CardBody = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`
export const Button = styled(UButton)`
  width: 100%;
`
export const Div = styled.div`
  padding-left: 5px;
`
export const ZReadingCon = styled.div`
  position: relative;
  height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
  height: 50px;
`
