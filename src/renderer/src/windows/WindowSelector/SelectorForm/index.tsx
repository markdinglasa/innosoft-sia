import { AppWindow } from "@shared/components";
import { setActiveWindow, setSnackbar } from "@shared/store/manager";
import { App, ButtonColor, ButtonType, SFC, ToastType, WindowDispatch, WindowProps } from "@shared/types";
import { useDispatch } from "react-redux";
import * as S from './Styles';

export const SelectorForm: SFC<WindowProps> = ({className, display}) => {
    const dispatch = useDispatch<WindowDispatch>()
    const handleSIA = async () => {
        try {
            dispatch(setActiveWindow(App.smsia))
        } catch (error: any) {
            dispatch(setSnackbar({display: true, message: error.message, type: ToastType.error}))
        }
    }

    const handleAlliance = async () => {
        try {
            dispatch(setActiveWindow(App.alliance))
        } catch (error: any) {
            dispatch(setSnackbar({display: true, message: error.message, type: ToastType.error}))
        }
    }

    const handleRobinsons = async () => {
        try {
            dispatch(setActiveWindow(App.robinsons))
        } catch (error: any) {
            dispatch(setSnackbar({display: true, message: error.message, type: ToastType.error}))
        }
    }

    const handleAyala = async () => {
        try {
            dispatch(setActiveWindow(App.ayala))
        } catch (error: any) {
            dispatch(setSnackbar({display: true, message: error.message, type: ToastType.error}))
        }
    }

    return (
        <>
            <AppWindow className={className} display={display}>
                <S.Container>
                    <label> Select Tenant Type</label>
                    <S.FormInput>
                        <S.Button
                            text="SM SIA"
                            color={ButtonColor.blue}
                            type={ButtonType.button}
                            onClick={handleSIA}
                        />
                    </S.FormInput>
                    <S.FormInput>
                        <S.Button
                            text="Alliance"
                            color={ButtonColor.blue}
                            type={ButtonType.button}
                            onClick={handleAlliance}
                        />
                    </S.FormInput>
                    <S.FormInput>
                        <S.Button
                            text="Robinsons"
                            color={ButtonColor.blue}
                            type={ButtonType.button}
                            onClick={handleRobinsons}
                        />
                    </S.FormInput>
                    <S.FormInput>
                        <S.Button
                            text="Ayala Malls"
                            color={ButtonColor.blue}
                            type={ButtonType.button}
                            onClick={handleAyala}
                        />
                    </S.FormInput>
                </S.Container>
            </AppWindow>
        </>
    )
}