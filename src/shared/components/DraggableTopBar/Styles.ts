import styled from 'styled-components'

export const Header = styled.header`
  z-index: 1000;
  -webkit-app-region: drag;
  position: absolute;
  height: 2rem;
  inset: 0px;
  background: #32394e;
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  color: #fff;
  padding: 5px 5px;
`

export const ButtonBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  -webkit-app-region: no-drag;
`
