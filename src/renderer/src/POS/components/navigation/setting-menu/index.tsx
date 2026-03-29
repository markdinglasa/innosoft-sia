import { mdiChevronRight } from '@mdi/js';
import { SFC } from '@shared/types';
import { memo } from 'react';
import * as S from './Styles';

interface SettingMenuProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

export const SettingMenu: SFC<SettingMenuProps> = memo(
  ({ icon, label, onClick }) => {
    return (
      <S.Container onClick={onClick}>
        <S.Icon path={icon} size="30px" />
        <S.Text className="w-full">{label}</S.Text>
        <S.Icon path={mdiChevronRight} size="30px" />
      </S.Container>
    );
  }
);

export default SettingMenu;
