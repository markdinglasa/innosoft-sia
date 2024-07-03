import { getNetworkBlocks } from '@shared/selectors';
import { Dict, NetworkBlock } from '@shared/types/';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useNetworkBlocks = (networkId: string): Dict<NetworkBlock> => {
  const networkBlocks = useSelector(getNetworkBlocks);
  return useMemo(() => {
    return networkBlocks[networkId] || {};
  }, [networkBlocks, networkId]);
};
