import styled from 'styled-components'

import { colors } from '@shared/styles'

export const Container = styled.div`
  background: ${colors.secondary};
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px 14px;
  margin-bottom: 10px;
`

export const Content = styled.div`
  margin-top: 12px;
`

export const Heading = styled.div`
  color: ${colors.primary}  
  font-size: 13px;
  font-weight: bolder;
`
