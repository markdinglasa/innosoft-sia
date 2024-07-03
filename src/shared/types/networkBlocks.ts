import { Block, Dict } from '@shared/types';

export interface NetworkBlock extends Block {
  date: string;
}

export type NetworkBlocks = Dict<Dict<NetworkBlock>>;
