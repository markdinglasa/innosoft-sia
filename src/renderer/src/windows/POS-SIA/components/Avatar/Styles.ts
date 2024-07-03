import { colors } from '@shared/styles';
import styled from 'styled-components';

export const Container = styled.div`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items:center;
    justify-content: center;
    cursor: pointer;
`

export const Image = styled.img`
  border-radius: 50%;
  height: 41px;
  width: 41px;
  border: 2px solid ${colors.primary};
`;