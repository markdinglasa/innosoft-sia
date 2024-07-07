import { colors } from '@shared/styles'
import styled from 'styled-components'
import { DatabaseIdentification as UDatabaseIdentification } from '../../components'

export const Container = styled.div`
  width: 100%:
  height: 200px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const Button = styled.button`
  background: ${colors.secondary};
  border: none;
  border-radius: 8px;
  color: ${colors.primary};
  padding: 8px 12px;
  transition: all 0.15s;
  width: 100%;

  &:hover {
    background: ${colors.pink};
    color: #fff;
    cursor: pointer;
  }
`
export const DatabaseIdentification = styled(UDatabaseIdentification)`
  margin-right: 10px;
`
