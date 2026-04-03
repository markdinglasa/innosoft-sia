export enum UtilityIpcChannel {
  // Audit Trail
  AUDIT_TRAIL_LIST = 'utility:audit-trail:list',
  AUDIT_TRAIL_GET = 'utility:audit-trail:get',

  // Mailer
  MAILER_SEND = 'utility:mailer:send',

  // Notification
  NOTIFICATION_LIST = 'utility:notification:list',
  NOTIFICATION_GET = 'utility:notification:get',
  NOTIFICATION_CREATE = 'utility:notification:create',
  NOTIFICATION_UPDATE = 'utility:notification:update',
  NOTIFICATION_DELETE = 'utility:notification:delete',

  // Settings
  SETTINGS_GET = 'utility:settings:get',
  SETTINGS_UPDATE = 'utility:settings:update',
  SETTINGS_GET_MERGED = 'utility:settings:get-merged',

  // Storage
  STORAGE_UPLOAD = 'utility:storage:upload',
  STORAGE_DELETE = 'utility:storage:delete',
  STORAGE_GET_URL = 'utility:storage:getUrl',
  STORAGE_GET_SIGNED_URL = 'utility:storage:getSignedUrl',
  STORAGE_GET_SIGNED_DOWNLOAD_URL = 'utility:storage:getSignedDownloadUrl',

  // User Terminal
  USER_TERMINAL_LIST = 'utility:user-terminal:list',
  USER_TERMINAL_GET = 'utility:user-terminal:get',
  USER_TERMINAL_CREATE = 'utility:user-terminal:create',
  USER_TERMINAL_UPDATE = 'utility:user-terminal:update',
  USER_TERMINAL_DELETE = 'utility:user-terminal:delete',
  USER_TERMINAL_ACTIVATE = 'utility:user-terminal:activate',
  USER_TERMINAL_FINGERPRINT = 'utility:user-terminal:fingerprint',
  USER_TERMINAL_GET_ACTIVE = 'utility:user-terminal:get-active',
  USER_TERMINAL_SET_ACTIVE = 'utility:user-terminal:set-active'
}
