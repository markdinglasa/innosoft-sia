import { RootState } from "@shared/types";
import { Page } from "../../types";

export const getActivePage = (state: RootState): Page => state.SIA.manager.activePage;
export const getActiveUser = (state: RootState): Page => state.SIA.manager.activeUser;
export const getActiveToken = (state: RootState): Page => state.SIA.manager.activeToken;