import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  transition: ease-in-out 0.5s;
`
export const DotSpinner = styled.div`
  --uib-size: 12.8rem;
  --uib-speed: 0.9s;
  --uib-color: #183153;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: var(--uib-size);
  width: var(--uib-size);
`
export const DotSpinner__Dot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;

  &::before {
    content: '';
    height: 20%;
    width: 20%;
    border-radius: 50%;
    background-color: var(--uib-color);
    transform: scale(0);
    opacity: 0.5;
    animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
    box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
  }

  &:nth-child(2) {
    transform: rotate(45deg);
  }

  &:nth-child(2)::before {
    animation-delay: calc(var(--uib-speed) * -0.875);
  }

  &:nth-child(3) {
    transform: rotate(90deg);
  }

  &:nth-child(3)::before {
    animation-delay: calc(var(--uib-speed) * -0.75);
  }

  &:nth-child(4) {
    transform: rotate(135deg);
  }

  &:nth-child(4)::before {
    animation-delay: calc(var(--uib-speed) * -0.625);
  }

  &:nth-child(5) {
    transform: rotate(180deg);
  }

  &:nth-child(5)::before {
    animation-delay: calc(var(--uib-speed) * -0.5);
  }

  &:nth-child(6) {
    transform: rotate(225deg);
  }

  &:nth-child(6)::before {
    animation-delay: calc(var(--uib-speed) * -0.375);
  }

  &:nth-child(7) {
    transform: rotate(270deg);
  }

  &:nth-child(7)::before {
    animation-delay: calc(var(--uib-speed) * -0.25);
  }

  &:nth-child(8) {
    transform: rotate(315deg);
  }

  &:nth-child(8)::before {
    animation-delay: calc(var(--uib-speed) * -0.125);
  }

  @keyframes pulse0112 {
    0%,
    100% {
      transform: scale(0);
      opacity: 0.5;
    }

    50% {
      transform: scale(1);
      opacity: 1;
    }
  }
`
export const Logo = styled.div`
  width: 130px;
  height: 130px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Image = styled.img`
  width: 165px;
  height: 165px;
`
export const Message = styled.div`
  padding: 5px 0px;
  text-align: center;
`
export const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
export const Wrapper = styled.div`
  margin-top: -30px;
`
export const LineWooble = styled.div`
  --uib-size: 80px;
  --uib-speed: 1.55s;
  --uib-color: black;
  --uib-line-weight: 5px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--uib-line-weight);
  width: 130px;
  border-radius: calc(var(--uib-line-weight) / 2);
  overflow: hidden;
  transform: translate3d(0, 0, 0);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: ${colors.primary};
    opacity: 0.1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: calc(var(--uib-line-weight) / 2);
    animation: wobble var(--uib-speed) ease-in-out infinite;
    transform: translateX(-90%);
    background-color: ${colors.primary};
  }

  @keyframes wobble {
    0%,
    100% {
      transform: translateX(-90%);
    }
    50% {
      transform: translateX(90%);
    }
  }
`
