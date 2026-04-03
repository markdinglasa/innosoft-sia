import { AppDispatch } from "@shared/types";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage } from "../store/manager";
import { POSPages } from "../types/pages";

export function useRoute(){
    const dispatch = useDispatch<AppDispatch>()
    const { activePage } = useSelector((state: any) => state.POS.manager)

    const navigate = (route: POSPages) => {
        dispatch(setActivePage(route))
    }

    return {
        navigate,
        activePage
    }
    
}