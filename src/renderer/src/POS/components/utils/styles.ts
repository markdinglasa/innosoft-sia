import { ArrowUpward as iad, ArrowDownward as iau } from '@mui/icons-material';
import styled from 'styled-components';
export const Up = styled.span`
  color: var(--green);
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
`;
export const Down = styled.span`
  color: var(--red);
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
`;
export const IconArrowDownward = styled(iad)`
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.125rem;
`;
export const IconArrowUpward = styled(iau)`
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.125rem;
`;
