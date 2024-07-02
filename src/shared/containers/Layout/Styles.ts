import styled from 'styled-components'

import { MainArea as UMainArea } from './MainArea'

export const Container = styled.div`
  overflow: hidden;
`

export const MainArea = styled(UMainArea)`
  display: flex;
  align-items: center;
  justify-content: center'
`
export const Test = styled.div`
  background: red;
  width: 100px;
  height: 100px;
`