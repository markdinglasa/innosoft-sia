import { RootState } from "@shared/types";

export const getTenant = (state: RootState) => state.Alliance.manager.tenant;
export const getPath = (state: RootState) => state.Alliance.manager.path;
export const getInitialize= (state: RootState) => state.Alliance.manager.initialize;
export const getSnackbar= (state: RootState) => state.Alliance.manager.snackbar;