import { getSocketStatuses } from '@shared/selectors';
import { SocketStatus } from '@shared/types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useSocketStatus = (networkId: string): SocketStatus => {
  const socketStatuses = useSelector(getSocketStatuses);
  return useMemo(() => {
    const socketStatus = socketStatuses[networkId];
    return socketStatus || SocketStatus.disconnected;
  }, [networkId, socketStatuses]);
};
