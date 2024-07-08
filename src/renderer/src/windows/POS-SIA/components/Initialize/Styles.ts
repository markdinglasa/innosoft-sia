import UIcon from '@mdi/react'
import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`

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
  justify-content: center;
  margin-bottom: 10px;
 `
 export const Icon = styled(UIcon)`
 color: ${colors.palette.neutral[200]};
 `