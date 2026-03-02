import { Field as UField } from 'formik'
import styled from 'styled-components'

import { colors } from '@shared/styles'
import { Theme } from '@shared/types'

export const ErrorMessage = styled.div`
  color: ${colors.palette.red['500']};
  font-size: 10px;
  margin-top: 6px;
`

export const Field = styled(UField)`
  background-color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.neutral[75]
    }
    return colors.palette.neutral[75]
  }};
  border-radius: 3px;
  border: 1px solid ${({ $error }) => ($error ? colors.palette.red['500'] : 'transparent')};
  display: block;
  height: 40px;
  padding: 10px 14px;
  width: 100%;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export const Label = styled.div<{ theme: Theme }>`
  font-size: 12px;
  margin-bottom: 8px;
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.neutral['100']
    }
    return colors.primary
  }};
`

export const SecondaryContainer = styled.div`
  margin-bottom: 32px;
`
