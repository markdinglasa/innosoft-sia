import { Button as UButton, Pager as UPager } from '@shared/components'
import { colors } from '@shared/styles'
import styled from 'styled-components'
export const UModal = styled(UPager)`
  display: flex;
  flex-direction: column;
  background: ${colors.white}
`
export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const CardBody = styled.div`
  width: 100%;
  padding: 10px 10px;
`
export const Button = styled(UButton)`
  width: 100%;
`