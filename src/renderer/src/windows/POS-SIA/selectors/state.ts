import { RootState } from "@shared/types";

export const getTenant = (state: RootState) => state.SIA.manager.tenant;
export const getPath = (state: RootState) => state.SIA.manager.path;
export const getIsConnected= (state: RootState) => state.SIA.manager.isConnected;