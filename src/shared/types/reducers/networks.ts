import { Dict, IdentificationData } from '@shared/types/';

export interface Network extends IdentificationData {
  networkId: string;
  port?: number;
  protocol: NetworkProtocol;
}

export enum NetworkProtocol {
  http = 'http',
  https = 'https',
}

export type Networks = Dict<Network>;
