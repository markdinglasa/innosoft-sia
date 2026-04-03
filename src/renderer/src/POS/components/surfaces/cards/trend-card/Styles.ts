import { Card as c } from '@mui/material';
import styled from 'styled-components';

export const Card = styled(c)`
  transition: ease-in-out 0.3s;
  &:hover {
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
`;
export const Content = styled.div`
    display:flex;
    justify-content:between:
    align-items:flex-start;
   
`;

export const RightPanel = styled.div`
  background: var(--default);
  border-radius: 0.375rem;
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
`;
export const LeftPanel = styled.div`
  width: calc(100% - 2.5rem);
`;
export const Label = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: #6b7280;
`;
export const Value = styled.p`
  font-size: 1.5rem /* 24px */;
  line-height: 2rem /* 32px */;
  font-weight: 700;
  color: var(--text);
  margin-top: 0.25rem;
`;
