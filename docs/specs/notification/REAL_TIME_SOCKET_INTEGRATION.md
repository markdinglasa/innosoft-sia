# Real‑time Socket Integration

## Files:
- main/socket/socketManager.ts
- main/socket/notificationEventHandler.ts

## Behavior:

- Socket event notification:new (from server) → main process receives.
- Deduplication: Store last 100 event_ids in memory LRU cache. Ignore duplicates for 5 seconds.
- Ordering: If events arrive out of order (timestamp skew), buffer and sort by server timestamp before saving.
- Offline queue: If socket disconnected, store incoming events in a local socket_buffer table (up to 1000 events). On reconnect, process buffer.
- Heartbeat: Send ping every 30s, disconnect after 2 missed pongs.