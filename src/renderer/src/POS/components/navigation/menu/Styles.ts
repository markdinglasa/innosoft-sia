import styled from 'styled-components';
import UIcon from '@mdi/react';
import { colors } from '@shared/styles/colors';

export const Icon = styled(UIcon)`
  color: ${colors.white};
`;
export const Container = styled.div<{ $isParent: boolean }>`
  border-radius: 8px;
  transition: 0.3s ease-in-out;
  cursor: pointer;
  width: 100%;
  ${({ $isParent }) =>
    $isParent
      ? `
      background:none;
    `
      : `&:hover { 
        background: rgb(51,65,85);
      }`};
`;
export const Menu = styled.div`
  border-radius: 8px; /* Matches rounded-md */
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgb(51, 65, 85);
  }
`;
export const MenuContent = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`;
export const Text = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  font-weight: semibold;
  font-size: 16px;
  color: ${colors.white};
  margin-left: 8px;
`;
export const Label = styled.label`
  width: 100%;
  text-align: left;
  cursor: pointer;
`;
export const ChildContent = styled.div<{
  $isDisplay: boolean;
  $isActive: boolean;
}>`
  overflow: hidden;
  transition: 0.3s ease-in-out;
  width: 100%;

  ${({ $isActive }) =>
    $isActive
      ? `
      border-radius: 0.375rem;
      background: rgb(51, 65, 85);
    `
      : `
      background:none
    `};
  ${({ $isDisplay }) =>
    $isDisplay
      ? `
      heigth:fit;
    `
      : `
      max-height:0px;
    `};
`;
export const ChildMenu = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;

  ${({ $isActive }) =>
    $isActive
      ? `
      border-radius: 0.375rem;
      background: rgb(51, 65, 85);
    `
      : `
      background:none
    `};
`;
export const ChildLabel = styled.label`
  margin-left: 8px;
  font-weight: semibold;
  font-size: 16px;
  color: ${colors.white};
  cursor: pointer;
  width: 100%;
`;
export const ChilCircleButton = styled.div`
  gap: 8px;
`;
