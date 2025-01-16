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
export const Div = styled.div`
  margin-bottom: 10px;
`
export const ZReadingCon = styled.div`
  height: 500px;
  overflow: auto;
`
