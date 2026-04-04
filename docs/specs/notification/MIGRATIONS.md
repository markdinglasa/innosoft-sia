
# Database Schema & Migrations
Files to generate:

- migrations/001_create_sys_notifications.sql
- migrations/002_create_email_queue.sql
- migrations/003_add_indexes.sql

- schema
```sql

-- Table: sys_notifications
CREATE TABLE sys_notifications (
    id TEXT PRIMARY KEY,                     -- UUID v4 generated client-side
    client_id TEXT NOT NULL,                 -- POS instance identifier
    created_at INTEGER NOT NULL,             -- Unix timestamp (ms), local time
    synced_at INTEGER,                       -- Null if not synced
    type TEXT NOT NULL CHECK(type IN ('info','warning','error','security')),
    priority TEXT NOT NULL CHECK(priority IN ('low','medium','high','critical')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    metadata TEXT NOT NULL DEFAULT '{}',     -- JSON string
    is_read INTEGER NOT NULL DEFAULT 0,      -- 0 = false, 1 = true
    read_at INTEGER,
    requires_email INTEGER NOT NULL DEFAULT 0,
    email_sent_at INTEGER,
    email_status TEXT DEFAULT 'pending' CHECK(email_status IN ('pending','sent','failed','retry'))
);

-- Table: email_queue (local only, never synced)
CREATE TABLE email_queue (
    id TEXT PRIMARY KEY,
    notification_id TEXT NOT NULL REFERENCES sys_notifications(id) ON DELETE CASCADE,
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    last_attempt_at INTEGER,
    status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','sending','sent','failed','abandoned')),
    error_message TEXT
);

-- Indexes (performance & pruning)
CREATE INDEX idx_notif_client_created ON sys_notifications(client_id, created_at DESC);
CREATE INDEX idx_notif_unread ON sys_notifications(is_read) WHERE is_read = 0;
CREATE INDEX idx_notif_email_pending ON sys_notifications(email_status) WHERE email_status = 'pending';
CREATE INDEX idx_email_queue_status ON email_queue(status) WHERE status IN ('queued','failed');
```

## Implementation Rules:

Use better-sqlite3 or knex with migration lock.

Enable WAL mode (PRAGMA journal_mode=WAL).

Prune notifications older than 90 days daily (background job).

Never delete email queue rows – only mark as abandoned.