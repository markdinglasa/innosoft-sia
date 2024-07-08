import UIcon from '@mdi/react';
import styled, { css } from 'styled-components';

import { colors } from '@shared/styles';
import { ButtonColor } from '@shared/types';

const BUTTON_HEIGHT = 36;

const blueMixin = css`
  background-color: ${colors.secondary};
  color: ${colors.primary};
  &:hover {
    background: ${colors.pink};
  }
`;

const grayMixin = css`
  background-color: ${colors.palette.blue['200']};
  color: ${colors.primary};

  &:hover {
    background: ${colors.palette.blue['300']};
  }
`;

const redMixin = css`
  background-color: ${colors.palette.red['200']};
  &:hover {
    background: ${colors.palette.red['300']};
  }
`;
const greenMixin = css`
  background-color: ${colors.palette.green['200']};
  &:hover {
    background: ${colors.palette.green['300']};
  }
`;
const disabledMixin = css`
  background: ${colors.palette.black['500']};
  color:#FFF;
  cursor: not-allowed;
  opacity: 0.65;
  &:hover {
    background: ${colors.palette.black['400']};
  }
`;

const hasIconMixin = css`
  align-items: center;
  border-radius: 6px;
  display: flex;
  width: auto;
`;

export const Button = styled.button<{$color?: ButtonColor; hasIcon: boolean}>`
  background: ${colors.palette.blue['200']};
  border-radius: ${`${BUTTON_HEIGHT / 2}px`};
  border: 1px solid transparent;
  color: ${colors.primary};
  cursor: pointer;
  display: block;
  height: ${`${BUTTON_HEIGHT}px`};
  padding: 0 12px;

  &:hover {
    background: ${colors.palette.blue['300']};
  }

  ${({$color}) => {
    if ($color === ButtonColor.blue) return blueMixin;
    if ($color === ButtonColor.gray) return grayMixin;
    if ($color === ButtonColor.red) return redMixin;
    if ($color === ButtonColor.green) return greenMixin;
    return;
  }}

  ${({disabled}) => disabled && disabledMixin}

  ${({hasIcon}) => hasIcon && hasIconMixin}
`;

export const IconLeft = styled(UIcon)`
  margin-right: 6px;
`;

export const IconRight = styled(UIcon)`
  margin-left: 6px;
`;
