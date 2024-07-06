import { setUserTable } from "@shared/store/pos/user";
import { User, WindowDispatch } from "@shared/types";

export const loadMstUserData = ( Data:Array<User>) => async (dispatch: WindowDispatch) => {
    dispatch(setUserTable(Data))
}