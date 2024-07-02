import { colors } from '@shared/styles';
import styled from 'styled-components';

export const Container = styled.div`
    padding: 10px 10px;
    width: 100%;
    display:flex;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid ${colors.palette.gray[200]};
    background: ${colors.white}
`;

export const Logo = styled.div`
    width: 30%;
`
export const Util = styled.div`
    width: 70%;
    display:flex;
    align-items: center;
    justify-content: end;
`
