import styled from 'styled-components';

import { colors } from '@shared/styles';

export const Container = styled.div`
  background: #fff;
  color: ${colors.primary};
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.div`
  flex: auto;
  overflow: auto;
  border:1px solid red;
`;
