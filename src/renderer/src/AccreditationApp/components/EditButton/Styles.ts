import UMdiIcon from '@mdi/react'
import styled from 'styled-components'

import { colors } from '@shared/styles'

export const Container = styled.div``

export const Icon = styled(UMdiIcon)`
  border-radius: 50%;
  color: ${colors.primary};
  margin-right: -4px;
  padding: 4px;
  transition: all 0.15s;

  &:hover {
    background: ${colors.pink};
    cursor: pointer;
  }
`
