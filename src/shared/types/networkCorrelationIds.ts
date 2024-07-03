import { SocketDataInternalMethod } from '@shared/types/';
import { Dict } from '@shared/types/generic';

export interface InternalRequestMapping {
  [key: string]: SocketDataInternalMethod;
}

export type NetworkCorrelationIds = Dict<InternalRequestMapping>;
