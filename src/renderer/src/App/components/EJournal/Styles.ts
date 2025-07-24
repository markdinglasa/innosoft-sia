import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const DateCon = styled.div`
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: start;
  flex-direction: column;
`
export const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`
export const Label = styled.label`
  font-size: 11px;
  margin-bottom: 8px;
  color: #fff;
`
export const InputDate = styled.input`
  border-radius: 6px;
  outline: none;
  border: none;
  padding: 8px 12px;
  width: 100%;
  background: ${colors.palette.neutral['100']};
`
export const Button = styled(UButton)`
  background: ${colors.secondary};
  border: none;
  border-radius: 8px;
  color: ${colors.primary};
  padding: 8px 12px;
  transition: all 0.15s;
  width: 100%;

  &:hover {
    background: ${colors.pink};
    cursor: pointer;
  }
`
export const DateRange = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 8px;
`
