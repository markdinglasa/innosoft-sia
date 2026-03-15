export enum AuthIpcChannel {
    GET_CURRENT_USER ='auth:get-current-user',
    LOGIN ='auth:login',
    LOGOUT ='auth:logout',
    REFRESH_TOKEN ='auth:refresh-token',
    AUTH_GUARD ='auth:auth-guard',
    VALIDATE_TOKEN ='auth:validate-token'
}