import { mdiArrowLeft } from '@mdi/js';
import { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

import { SFC } from '../../types';
import { Icon } from '../Icon';
import * as S from './Styles';

export interface PagerProps {
  children: ReactNode;
  back(): void;
  footer?: ReactNode;
  header: string;
}

export const Pager: SFC<PagerProps> = ({
  children,
  className,
  back,
  footer,
  header,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleBackClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      back();
    }, 500); // Duration should match the slide-out animation time
  };

  return createPortal(
    <>
      <S.Pager className={`${className} ${isClosing ? 'closing' : ''}`}>
        <S.Header>
          <Icon icon={mdiArrowLeft} onClick={handleBackClick} size={16} />
          <span>{header}</span>
        </S.Header>
        <S.Content>{children}</S.Content>
        {footer}
      </S.Pager>
    </>,
    document.getElementById('modal-root')!
  );
};
