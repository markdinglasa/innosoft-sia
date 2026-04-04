import { mdiAlertCircleOutline, mdiCheckCircle } from '@mdi/js'
import { Icon } from '@shared/components'
import { ToastType } from '@shared/types'
import styled from 'styled-components'

export const Container = styled.div<{ type: ToastType }>`
  display: flex;

  flex-direction: row;
  gap: 1rem;
`

export const Text = styled.span`
  align-items: center;
  display: flex;
`

const iconProps = `
  color: #fff;
  margin-right: 12px;
`

export const AlertCircleOutlineIcon = styled(Icon).attrs(() => ({ icon: mdiAlertCircleOutline }))`
  ${iconProps}
`

export const CheckCircleIcon = styled(Icon).attrs(() => ({ icon: mdiCheckCircle }))`
  ${iconProps}
`
