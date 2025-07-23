import styled from 'styled-components'

export const Container = styled.div<{ $display: boolean }>`
  align-items: center;
  display: ${(props: { $display: boolean }) => (props.$display ? 'flex' : 'none')};
  justify-content: center;
  overflow-y: auto;
`
