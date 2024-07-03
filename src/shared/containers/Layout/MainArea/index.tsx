import { useWindowInitialize } from '@shared/hooks';
import { getActiveWindow } from '@shared/selectors';
import { SFC, Windows } from '@shared/types';
import { DBConfig, License, Login } from '@shared/window';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Windows as App } from '../../../../renderer/src/registry';
import * as S from './Styles';

export const MainArea: SFC = ({ className }) => {
  //const [loading, setLoading] = useState(true);
  useWindowInitialize();
  
  const activeWindow = useSelector(getActiveWindow);

  const renderContent = (): ReactNode => {
    switch (activeWindow) {
      case Windows.dbConfig:
        return <DBConfig />;
      case Windows.license:
        return <License />;
      case Windows.login:
        return <Login />;
      case Windows.sia:
        return <App />;
      default:
        return Windows.dbConfig;
    }
  };

  return (
    <S.Container className={className}>
      {renderContent()}
    </S.Container>
  )
}
