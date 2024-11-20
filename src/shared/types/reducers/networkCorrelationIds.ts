import { Dict, SocketDataInternalMethod } from '@shared/types/'

export interface InternalRequestMapping {
  [key: string]: SocketDataInternalMethod
}

export type NetworkCorrelationIds = Dict<InternalRequestMapping>
