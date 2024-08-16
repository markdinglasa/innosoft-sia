import UMdiIcon from '@mdi/react'
import { Button as UButton } from '@shared/components'
import { colors } from '@shared/styles'
import { Theme } from '@shared/types'
import styled from 'styled-components'
export const Container = styled.div<{ theme: Theme }>`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.palette.neutral['100']};
`
export const CardContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: #a6b0cf;
  padding: 24px 24px;
  background: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.primary
    }
    return colors.white
  }};
  border-radius: 8px;
`
export const CardBody = styled.div`
  width: 100%;
  padding: 10px 10px;
  margin-bottom: 20px;
`
export const Button = styled(UButton)`
  width: 100%;
`
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid ${colors.palette.gray[200]};
  color: ${colors.white};
  margin-bottom: 20px;
`
export const Icon = styled(UMdiIcon)<{ theme: Theme }>`
  border-radius: 50%;
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.neutral['100']
    }
    return colors.primary
  }};
  margin-right: 5px;
  padding: 4px;
`
export const CardTitle = styled.h1<{ theme: Theme }>`
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.neutral['100']
    }
    return colors.primary
  }};
`
export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  width: 100%;
  flex-direction: column;
`
export const Span = styled.span``
export const BackButton = styled(UButton)`
  width: 100px;
  top: 20px;
  left: 20px;
  position: absolute;
`
