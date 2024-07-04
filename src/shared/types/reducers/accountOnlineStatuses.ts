export enum OnlineStatus {
    offline = 'offline',
    online = 'online',
}
  
export interface AccountOnlineStatuses {
  [key: string]: OnlineStatus;
}


