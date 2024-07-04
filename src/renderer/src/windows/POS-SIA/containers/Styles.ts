import styled from 'styled-components'
import { Content as UContent } from './Content'
import { Menu } from './SideBar'
import { TopBarCon } from './TopBarCon'

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  > div {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }
`
export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-between;
`

export const ContentWrapper = styled.div`
  display: flex;
  > div {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 50px;
  }
`

export const TopBar = styled(TopBarCon)`
  z-index: 5;
`
export const SideBar = styled(Menu)`
  display: flex;
  align-items: start;
  overflow-y: auto;
  z-index: 4;
  width: 250px;
`

export const Content = styled(UContent)`
  z-index: 3;
  justify-content: end;
  width: calc(100% - 250px);
  height: calc(100% - 50px);
  border: 1px solid red;
`

export const Test = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
`
