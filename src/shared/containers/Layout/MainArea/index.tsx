import { useWindowInitialize } from '@shared/hooks'
//import { getActiveWindow } from '@shared/selectors'
import { SFC } from '@shared/types'
//import { useSelector } from 'react-redux'
import { Windows } from '@renderer/registry'
//import { License } from '@shared/window'
//import { GenerateLicense } from '@shared/window'
import * as S from './Styles'

export const MainArea: SFC = ({ className }) => {
  //const [loading, setLoading] = useState(true);
  useWindowInitialize()

  //const activeWindow = useSelector(getActiveWindow)

  /*
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
  */

  return (
    <S.Container className={className}>
      <Windows />
    </S.Container>
  )
}
