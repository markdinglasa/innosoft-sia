import { Field as UField } from 'formik'
import styled from 'styled-components'

import { colors } from '@shared/styles'
import { Theme } from '@shared/types'

export const ErrorMessage = styled.div`
  color: ${colors.palette.red['500']};
  font-size: 1rem;
  margin-top: 0.6rem;
`

export const Field = styled(UField)`
  background-color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.neutral[75]
    }
    return colors.palette.neutral[75]
  }};
  border-radius: 0.3rem;
  border: 0.1rem solid ${({ $error }) => ($error ? colors.palette.red['500'] : 'transparent')};
  display: block;
  height: 4rem;
  padding: 1rem 1.4rem;
  width: 100%;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export const Label = styled.div<{ theme: Theme }>`
  font-size: 1rem;
  margin-bottom: 0.8rem;
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.neutral['100']
    }
    return colors.primary
  }};
`

export const SecondaryContainer = styled.div`
  margin-bottom: 3.2rem;
`
