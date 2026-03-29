import styled from 'styled-components';
import MdiIcon from '@mdi/react';
export const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  rounded: 0.375rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: var(--default);
  }
`;

export const Icon = styled(MdiIcon)`
  color: var(--primary);
`;
export const Text = styled.span`
  width: 100%;
`;
