import MdiIcon from '@mdi/react';
import { colors } from '@shared/styles';
import styled, { css } from 'styled-components';
const transitionMixin = css`
  transition: all 0.1s;
`
export const Icon = styled(MdiIcon)<{$isActivePage: boolean}>`
  color: ${({$isActivePage}) => ($isActivePage ? '#fff' : '#aaabae')};
  ${transitionMixin};
`
export const Text = styled.div<{$isActivePage: boolean; $isCollapsed: boolean}>`
  color: ${({$isActivePage}) => ($isActivePage ? '#fff' : '#aaabae')};
  display: ${({$isCollapsed}) => ($isCollapsed ? 'none' : 'block')};
  font-size: 13px;
  margin-left: 12px;
  ${transitionMixin};
`
export const Container = styled.div<{isActivePage: boolean}>`
  align-items: center;
  display: flex;
  padding: 10px 24px;
  width: 230px;
  border-radius: 6px;
  ${transitionMixin};
  background: ${({isActivePage}) => (isActivePage ? `${colors.pink}` : 'transaparent')};${colors.pink};
  &:hover {
    background: ${colors.pink};
    cursor: pointer;
    min-height: 20px;
    ${Icon}, ${Text} {
      color: #fff;
    }
  }
`