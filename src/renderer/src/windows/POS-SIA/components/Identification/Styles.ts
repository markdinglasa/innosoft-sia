import UMdiIcon from '@mdi/react'
import { colors } from '@shared/styles'
import styled from 'styled-components'

export const BottomText = styled.div`
  font-size: 12px;
  margin-top: 2px;
`

export const Container = styled.div`
  display: flex;
`

export const Img = styled.img`
  border-radius: 50%;
  height: 36px;
  margin-right: 10px;
  width: 36px;
`

export const Text = styled.div``

export const TopText = styled.div`
  color: ${colors.palette.gray[50]};
  font-size: 14px;
`

export const Icon = styled(UMdiIcon)`
  border-radius: 50%;
  height: 36px;
  margin-right: 10px;
  width: 36px;
  color: ${colors.primary};
`
