import UIcon from '@mdi/react'
import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 50px;
  padding: 10px 10px;
  border-radius: 8px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background: ${colors.white};
  margin: 10px 0px;
`
export const Left = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  height: 100%;
`
export const Right = styled.div`
  width: 50%;
`
export const Title = styled.h2`
  color: ${colors.primary};
  margin-left: 5px;
`
export const Icon = styled(UIcon)`
  color: ${colors.primary};
`
