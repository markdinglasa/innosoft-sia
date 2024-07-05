import styled from 'styled-components'

export const Container = styled.div`
  width: calc(100vw - 250px);
  height: calc(100vh - 50px);
  padding: 10px 10px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100vw;
  }
`
