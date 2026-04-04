# Conflict Resolution & Sync
## Files:

- main/sync/syncEngine.ts
- main/sync/conflictResolver.ts

### Strategy: Last‑Write‑Wins (LWW) with hybrid timestamp (local time bounded by server time).

### Sync flow:

- Upload: Send all synced_at IS NULL notifications to backend POST /api/notifications/sync.
- Download: Fetch server notifications newer than last sync.

### Conflict resolution:

- If same id exists locally and server, compare updated_at (server timestamp wins if newer, else local).
- For is_read only: newer read_at wins.
- Merge: Update local record with server fields, set synced_at = now().

### Implementation Rules:

- Sync triggered on app:online, then every 5 minutes.
- Use Promise.allSettled to handle partial failures.
- Log each conflict to sync_log table for auditing.