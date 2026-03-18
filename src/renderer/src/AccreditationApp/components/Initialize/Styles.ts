import UIcon from '@mdi/react'
import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
export const Button = styled(UButton)`
  border: none;
  border-radius: 8px;
  color: ${colors.primary};
  padding: 8px 12px;
  transition: all 0.15s;
  width: 100%;
`
export const Span = styled.span`
  color: ${colors.palette.neutral[200]};
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: start;
  margin-left: 10px;
`
export const Text = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
`
export const Icon = styled(UIcon)`
  color: ${colors.palette.neutral[200]};
`
export const Div = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`
export const DivBtn = styled.div`
  width: 30%;
`
export const DivBtn2 = styled.div`
  width: 70%;
`
export const TopTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: between;
`
export const InputDate = styled.input`
  border-radius: 6px;
  outline: none;
  border: none;
  padding: 8px 12px;
  width: 100%;
  background: ${colors.palette.neutral['100']};
`
export const BtnCon = styled.div`
  width: 100%;
  gap: 10px;
`
export const DateRangeCon = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
`
export const Label = styled.label`
  font-size: 12px;
  color: ${colors.palette.neutral['100']};
  margin-bottom: 6px;
`
export const DateCon = styled.div`
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: start;
  flex-direction: column;
`
