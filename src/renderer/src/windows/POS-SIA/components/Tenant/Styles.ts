import UIcon from '@mdi/react'
import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import styled from 'styled-components'
import { TenantIdentification as UTenantIdentification } from '../TenantIdentification'
export const Container = styled.div`
  width: 100%:
  height: 200px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
export const TenantIdentification = styled(UTenantIdentification)`
  margin-right: 10px;
`
export const Text = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 10px;
`
export const Icon = styled(UIcon)`
  color: ${colors.palette.neutral[200]};
`
export const Span = styled.span`
  color: ${colors.palette.neutral[200]};
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`
