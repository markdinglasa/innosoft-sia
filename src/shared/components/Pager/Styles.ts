import styled, { keyframes } from 'styled-components';
import { colors, fonts } from '../../styles';

// Slide in from right to left
const slideInFromRight = keyframes`
  from {
    transform: translate(100%, -50%);
  }
  to {
    transform: translate(-50%, -50%);
  }
`;

// Slide out from left to right
const slideOutToRight = keyframes`
  from {
    transform: translate(-50%, -50%);
  }
  to {
    transform: translate(100%, -50%);
  }
`;

export const Content = styled.div`
  padding: 0 24px 32px;
`;

export const Header = styled.div`
  align-items: center;
  color: ${colors.palette.gray['500']};
  display: flex;
  font-size: 12px;
  font-weight: 400;
  justify-content: space-between;
  margin-bottom: 46px;
  padding: 16px 24px 0;
  position: relative;
`;

export const Pager = styled.div`
  background: #fff;
  border-radius: 8px;
  width:100%;
  height:100vh;
  display:flex;
  font-family: ${fonts.family.default};
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(100%, -50%); /* Start off-screen to the right */
  animation: ${slideInFromRight} 0.5s ease forwards; /* Slide-in effect */

  &.closing {
    animation: ${slideOutToRight} 0.5s ease forwards; /* Slide-out effect */
  }

  z-index: 1000; 
`;

export const Overlay = styled.div`
  background: rgba(44, 57, 103, 0.3);
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 999;
`;
