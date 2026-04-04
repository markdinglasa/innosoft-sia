# IPC Communication Layer
Files:

- ipc/channels/notificationChannels.ts (shared types)
- main/ipc/notificationHandlers.ts
- renderer/hooks/useNotificationIPC.ts

Channel Contract (type‑safe):

```typescript
// Shared types
interface NotificationIPC {
  'notification:fetch': {
    request: { limit: number; offset: number; filterUnread?: boolean; types?: string[] };
    response: { notifications: SysNotification[]; totalCount: number; hasMore: boolean };
  };
  'notification:mark-read': {
    request: { notificationIds: string[]; markAll?: boolean };
    response: { updatedCount: number };
  };
  'notification:clear-all': {
    request: { olderThanDays: number; confirm: boolean };
    response: { clearedCount: number };
  };
  'notification:new': {
    sendOnly: true;  // main → renderer
    payload: SysNotification;
  };
  'notification:sync-status': {
    sendOnly: true;
    payload: { pendingUploads: number; lastSyncAt: number | null; lastError: string | null };
  };
}
```

## Implementation Rules:

- Main process: register handlers with ipcMain.handle() for request‑response; ipcMain.on() for fire‑and‑forget.
- Renderer: expose typed hooks using useIpcInvoke, useIpcOn.
- Broadcast notification:new to all renderer windows via webContents.send.
- Implement backpressure: if renderer processes > 100 notif/sec, throttle to 50/sec and log warning.