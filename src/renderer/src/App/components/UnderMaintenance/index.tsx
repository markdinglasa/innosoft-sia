import { SFC } from '@shared/types'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
`
export const UnderMaintenance: SFC = () => {
  return (
    <Container>
      <div style={{ padding: '1rem' }}>
        <h3>Under Maintenance</h3>
      </div>
      <span> Sorry, we couldn't load this feature.</span>
    </Container>
  )
}
