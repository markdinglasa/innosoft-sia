import styled from 'styled-components'

export const Container = styled.div<{ $display: boolean }>`
  align-items: start;
  display: ${(props: { $display: boolean }) => (props.$display ? 'flex' : 'none')};
  justify-content: start;
  width: 100%;
`
