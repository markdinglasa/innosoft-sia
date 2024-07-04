import styled from 'styled-components'

import { colors } from '@shared/styles'

export const Container = styled.div`
  color: ${colors.primary};
  display: flex;
  flex-direction: column;
  border: 1px solid blue;
`

export const MainContent = styled.div`
  flex: auto;
`
