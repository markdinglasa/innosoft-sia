import { getNetworks } from '@shared/selectors';
import { truncate } from '@shared/utils';
import { useSelector } from 'react-redux';

export const useNetworkDisplayName = (networkId: string, maxLength?: number) => {
  const networks = useSelector(getNetworks);
  const network = networks[networkId];
  const results = network?.displayName || networkId;
  return maxLength ? truncate(results, maxLength) : results;
}