import UIcon from '@mdi/react'
import { colors } from '@shared/styles'
import styled from 'styled-components'
export const Container = styled.div`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  background: ${colors.white};
  padding: 10px 10px;
  align-items: center;
  margin-bottom: 10px;
  display: flex;
`
export const Title = styled.div`
  width: 50%;
  font-size: 25px;
  font-weight: bolder;
  align-items: center;
  display: flex;
`
export const Buttons = styled.div`
  width: 50%;
  display: flex;
  justify-content: flex-end;
`
export const Icon = styled(UIcon)``
export const Span = styled.span`
  margin-left: 5px;
`
