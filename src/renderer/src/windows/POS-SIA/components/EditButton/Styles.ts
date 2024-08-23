import UMdiIcon from '@mdi/react'
import { colors } from '@shared/styles'
import styled from 'styled-components'
export const Container = styled.div``
export const Icon = styled(UMdiIcon)`
  border-radius: 50%;
  color: ${colors.white};
  margin-right: -4px;
  padding: 4px;
  transition: all 0.3s;

  &:hover {
    background: ${colors.pink};
    cursor: pointer;
  }
`
