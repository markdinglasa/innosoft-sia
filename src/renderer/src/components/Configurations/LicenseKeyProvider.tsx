import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LicenseKeyContext = createContext({} as LicenseKeyProviderValue);

export function useLicenseKey() {
    return useContext<LicenseKeyProviderValue>(LicenseKeyContext);
}

export interface LicenseKeyProviderProps {
    children: string | any |React.ReactElement | React.ReactNode;
}

export interface apiMessage {
    success: boolean;
    error: boolean;
    errorMessage: string;
}

export interface LicenseKeyProviderValue {
    checkIfLicenseKeyIsActivated: () => Promise<apiMessage>,
    handleActivateLicenseKey: (licenseKey: string) => Promise<apiMessage>,
}

export const LicenseKeyProvider = ({ children }: LicenseKeyProviderProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const checkIfLicenseKeyIsActivated = useCallback(async (): Promise<apiMessage> => {
        const licenseKey = await window.api.get('get-licenseKey');
        if (!licenseKey) {
            return {
                error: true,
                success: false,
                errorMessage: 'No license key found.'
            };
        }

        // Validate LicenseKey
        const authenticate = await window.api.post('authenticate-licenseKey', licenseKey);
        if (!authenticate.IsLicensed) {
            return {
                error: true,
                success: false,
                errorMessage: 'License key is no longer valid or has been deactivated'
            };
        }

        return {
            error: false,
            success: true,
            errorMessage: ''
        };
    }, []);

    const handleActivateLicenseKey = async (licenseKey: string): Promise<apiMessage> => {
        if (!licenseKey || licenseKey.trim() === '') {
            return {
                error: true,
                success: false,
                errorMessage: 'Please enter a valid license key.'
            };
        }
        try {
            const response = await window.api.post('authenticate-licenseKey', licenseKey);
            if (!response.IsLicensed) {
                return {
                    error: true,
                    success: false,
                    errorMessage: `set-key2 ${response.message}`
                };
            } 
            const setKey = await window.api.post('set-licenseKey', licenseKey);
            if (!setKey){
                return {
                    error: true,
                    success: false,
                    errorMessage: `set-key1 ${response.message}`
                };
            }
            return {
                error: false,
                success: true,
                errorMessage: `set-key1 ${response.message}`
            };
        } catch (error) {
            // console.error('Error activating license key:', error);
            return {
                error: true,
                success: false,
                errorMessage: 'Something went wrong'
            };
        }
    };

    useEffect(() => {
        const call = async () => {
            const response = await checkIfLicenseKeyIsActivated();
            if (response.error) {
                console.log(response.errorMessage);
                navigate('/license');
            } else {
                navigate('/app');
            }
        };

        call();
    }, [checkIfLicenseKeyIsActivated, navigate]);

    const value = {
        checkIfLicenseKeyIsActivated,
        handleActivateLicenseKey,
    };

    return (
        <LicenseKeyContext.Provider value={value}>
            {children}
        </LicenseKeyContext.Provider>
    );
};
