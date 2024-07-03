import UnknownNetwork from '@shared/assets/default-avatar.png';
import { getNetworks } from '@shared/selectors';
import { useSelector } from 'react-redux';

export const useNetworkDisplayImage = (networkId: string | null) => {
  const networks = useSelector(getNetworks);
  if (!networkId) return UnknownNetwork;
  const network = networks[networkId];
  return network?.displayImage || UnknownNetwork;
};
