import styled from 'styled-components';
import { Breadcrumbs as bc } from '@mui/material';

export const Breadcrumbs = styled(bc)`
  width: 100%;
  margin-bottom: 0.5rem;
  display: flex;
  align-items:centerl @media (min-width: 786px) {
    width: 66.66%;
    margin-bottom: 0rem;
  }
`;
export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;
export const ActivePage = styled.span`
  text-transform: capitalize;
  color: var(--primary);
  font-weight: 550;
`;
export const InactivePage = styled.span`
  color: inherit;
  text-transform: capitalize;
`;
