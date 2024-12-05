import styled from 'styled-components'

import { ConnectionStatus } from '@shared/types'
import { colors } from '../../../styles'

export const Container = styled.div<{ type: ConnectionStatus }>`
  background-color: ${({ type }) => {
    if (type === ConnectionStatus.connected) {
      return colors.palette.green['300']
    }
    if (type === ConnectionStatus.invalid) {
      return colors.palette.yellow['400']
    }
    return colors.palette.red['400']
  }};
  display: flex;
  padding: 5px;
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: all 0.3s;
  &:hover {
    background-color: ${({ type }) => {
      if (type === ConnectionStatus.connected) {
        return colors.palette.green['400']
      }
      if (type === ConnectionStatus.invalid) {
        return colors.palette.yellow['500']
      }
      return colors.palette.red['500']
    }};
  }
`

export const Text = styled.span`
  align-items: center;
  color: #fff;
  display: flex;
`
