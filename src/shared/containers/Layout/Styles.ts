import styled from 'styled-components'

import { MainArea as UMainArea } from './MainArea'

export const Container = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`

export const MainArea = styled(UMainArea)`
  display: flex;
  align-items: center;
  justify-content: center'
`
