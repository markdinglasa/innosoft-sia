import { RootState } from "@shared/types";

export const getActivePage = (state:RootState) => state.SIA.manager.activePage;
export const getActiveUser = (state:RootState) => state.SIA.manager.activeUser;
export const getActiveToken = (state:RootState) => state.SIA.manager.activeToken;
