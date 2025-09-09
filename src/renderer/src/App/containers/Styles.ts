import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #0e2036;
  flex-direction: column;
`
export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`
export const Header = styled.div`
  height: 2rem;
  width: 100%;
`
export const Body = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  padding: 2rem 10px 0 10px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  overflow-y: auto;
  overflow-x: none;
`
export const Footer = styled.div`
  height: 60px;
  position: fixed;
  width: 100vw;
  bottom: 0.1rem;
`
export const Card = styled.div`
  width: 100%;
  padding: 10px 10px;
  background: ${colors.palette.gray[500]};
  border-radius: 10px;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }
`
export const Title = styled.div`
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`
export const H2 = styled.h2`
  color: ${colors.palette.neutral['100']};
`
export const Filler = styled.div`
  height: 0.75rem !important;
  width: 100%;
`
export const SettingsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0rem 0 0.7rem 0;
`
