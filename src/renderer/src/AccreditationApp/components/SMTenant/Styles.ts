import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import styled from 'styled-components'

export const FormControl = styled.div`
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: start;
  flex-direction: row;
  gap: 8px;
`
export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
`
export const InputDate = styled.input`
  border-radius: 6px;
  outline: none;
  border: none;
  padding: 8px 12px;
  width: 100%;
  background: ${colors.palette.neutral['100']};
`
export const Label = styled.label`
  font-size: 12px;
  color: ${colors.palette.neutral['100']};
  margin-bottom: 6px;
`
export const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`
export const Button = styled(UButton)`
  border: none;
  border-radius: 8px;
  color: ${colors.primary};
  padding: 8px 12px;
  transition: all 0.15s;
  width: 100%;
`
