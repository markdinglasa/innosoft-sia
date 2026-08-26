import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: #171717;
  padding: 1rem;
`

export const Card = styled.div`
  display: flex;
  max-width: 42rem;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(127, 29, 29, 0.5);
  background-color: #262626;
  padding: 1.5rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`

export const Title = styled.h1`
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  color: #ef4444;
`

export const Description = styled.p`
  color: #d4d4d4;
`

export const ErrorBox = styled.div`
  margin-top: 0.5rem;
  display: flex;
  max-height: 400px;
  flex-direction: column;
  overflow-y: auto;
  border-radius: 0.375rem;
  background-color: #0a0a0a;
  padding: 1rem;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  font-size: 0.875rem;
  line-height: 1.25rem;
`

export const ErrorMessage = styled.div`
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #f87171;
`

export const ErrorDetails = styled.pre`
  white-space: pre-wrap;
  color: #a3a3a3;
`

export const Button = styled.button`
  margin-top: 1rem;
  border-radius: 0.375rem;
  background-color: #dc2626;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: #ffffff;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  align-self: flex-start;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #b91c1c;
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow:
      0 0 0 2px #262626,
      0 0 0 4px #ef4444,
      0 0 #0000;
  }
`
