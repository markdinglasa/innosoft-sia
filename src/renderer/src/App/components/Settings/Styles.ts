import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Button = styled(UButton)`
  background: ${colors.secondary};
  border: none;
  border-radius: 0.8rem;
  color: ${colors.primary};
  padding: 0.8rem 1.2rem;
  transition: all 0.15s;
  width: 100%;

  &:hover {
    background: ${colors.pink};
    cursor: pointer;
  }
`