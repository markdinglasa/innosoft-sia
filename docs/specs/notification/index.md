spec_version: "1.0"
system: "pos-notification-module"
architecture: "offline-first-desktop"

# ========== DATA MODELS ==========
data_models:
  - name: SysNotification
    table: sys_notifications
    sync:
      strategy: "conflict-free-append-only"
      conflict_resolution: "server-wins-on-create, client-wins-on-read-status"
    fields:
      - name: id
        type: uuid
        primary: true
        generated: "client-side"
      
      - name: client_id
        type: uuid
        required: true
        description: "POS instance identifier (offline-first shard key)"
      
      - name: created_at
        type: timestamp
        required: true
        source: "client_local_time"
      
      - name: synced_at
        type: timestamp
        nullable: true
        description: "When this record was acknowledged by backend"
      
      - name: type
        type: enum
        values: ["info", "warning", "error", "security"]
        required: true
      
      - name: priority
        type: enum
        values: ["low", "medium", "high", "critical"]
        required: true
      
      - name: title
        type: string
        max: 200
        required: true
      
      - name: body
        type: text
        required: true
      
      - name: metadata
        type: json
        default: {}
        description: "Structured context (order_id, product_id, etc.)"
      
      - name: is_read
        type: boolean
        default: false
        sync: "two-way-last-write-wins"
      
      - name: read_at
        type: timestamp
        nullable: true
      
      - name: requires_email
        type: boolean
        default: false
      
      - name: email_sent_at
        type: timestamp
        nullable: true
      
      - name: email_status
        type: enum
        values: ["pending", "sent", "failed", "retry"]
        default: "pending"

  - name: EmailQueue
    table: email_queue
    sync: "local-only"  # Never syncs to cloud
    retention_days: 30
    fields:
      - name: id
        type: uuid
        primary: true
      
      - name: notification_id
        type: uuid
        references: "SysNotification.id"
      
      - name: to_email
        type: string
        required: true
      
      - name: subject
        type: string
        required: true
      
      - name: html_body
        type: text
        required: true
      
      - name: attempt_count
        type: int
        default: 0
        max: 5
      
      - name: last_attempt_at
        type: timestamp
        nullable: true
      
      - name: status
        type: enum
        values: ["queued", "sending", "sent", "failed", "abandoned"]
        default: "queued"
      
      - name: error_message
        type: text
        nullable: true

# ========== API CONTRACTS ==========
ipc_handlers:
  - channel: "notification:fetch"
    direction: "renderer → main"
    request:
      limit: 50
      offset: 0
      filter_unread: false
      types: ["info", "warning", "error", "security"] | null
    response:
      notifications: ["SysNotification"]
      total_count: int
      has_more: bool

  - channel: "notification:mark-read"
    direction: "renderer → main"
    request:
      notification_ids: ["uuid"]
      mark_all: false  # if true, ignore ids
    response:
      updated_count: int

  - channel: "notification:clear-all"
    direction: "renderer → main"
    conditions:
      - require_user_confirmation: true
      - max_age_days: 90  # never clear newer than 90 days
    response:
      cleared_count: int

  - channel: "notification:sync-status"
    direction: "main → renderer (broadcast)"
    payload:
      pending_uploads: int
      last_sync_at: timestamp | null
      last_error: string | null

# ========== EVENT HANDLERS ==========
event_triggers:
  - event: "socket:notification:new"
    behavior: |
      1. Validate payload (title, body, type, priority)
      2. Generate UUID client-side
      3. Save to SysNotification with is_read=false, email_status="pending"
      4. Emit 'notification:new' to all renderer windows (via WebContents)
      5. If priority in ["high","critical"] OR requires_email=true → push to EmailQueue
      6. Trigger background sync if online

  - event: "app:online"
    behavior: |
      1. Sync unsent SysNotification records (synced_at IS NULL) to backend
      2. Process EmailQueue (max 10 per batch, 30s interval)
      3. Retry failed emails (exponential backoff: 2^attempt minutes, max 60m)

  - event: "app:shutdown"
    behavior: |
      1. Flush EmailQueue to disk (write queue state to local DB)
      2. Ensure pending notifications are not lost

# ========== EMAIL RULES (Resend) ==========
email_config:
  provider: "resend"
  api_key_env: "RESEND_API_KEY"
  from_email: "noreply@pos-system.local"
  admin_email_source: "system_settings.admin_email"
  
  triggers:
    - name: "critical_system_error"
      condition: "type='error' AND priority='critical'"
      template: "email/critical-error.html"
      rate_limit: "1 per 15 minutes per error type"
      
    - name: "security_event"
      condition: "type='security'"
      template: "email/security-alert.html"
      rate_limit: "none"
      
    - name: "low_stock_warning"
      condition: "type='warning' AND metadata.has('stock_level') AND stock_level < 5"
      template: "email/low-stock.html"
      rate_limit: "1 per hour per product_id"

  retry_policy:
    max_attempts: 5
    backoff_seconds: [60, 300, 900, 3600, 14400]  # 1m, 5m, 15m, 1h, 4h
    abandon_after: "24h"

# ========== UI SPEC ==========
ui_components:
  - name: "NotificationBell"
    location: "app-header-right"
    behavior:
      - badge_count: "unread_count (real-time via IPC)"
      - onClick: "opens NotificationTray (position: bottom-right of bell)"
      
  - name: "NotificationTray"
    max_height: "500px"
    width: "380px"
    grouping: "by date (Today, Yesterday, Older)"
    actions:
      - button: "Mark all as read"
        confirm_dialog: false
      - button: "Clear all (older than 90 days)"
        confirm_dialog: true
    empty_state: "No notifications"
    real_time_updates: "listen to 'notification:new' IPC event"

# ========== OFFLINE-FIRST GUARANTEES ==========
offline_guarantees:
  - notification_creation: "Always works offline (local UUID, local timestamp)"
  - read_status: "Syncs when online (client-wins conflict resolution)"
  - email_queue: "Persisted to SQLite, retries on next online event"
  - storage_limit: "Auto-prune notifications older than 90 days (configurable)"
  - sync_conflict: "If server already has same ID → skip create; if read_status conflict → newer timestamp wins"

# ========== OPEN QUESTIONS RESOLVED ==========
resolved_questions:
  - "Clear All functionality?": "YES, but only for notifications older than 90 days, with confirmation"
  - "Which events trigger email?": "Critical system errors, security events, low stock (<5 units)"
  - "Retry logic for email?": "Yes, exponential backoff, max 5 attempts, abandon after 24h"
  - "Offline email behavior?": "Queue in local DB, send when online"
  - "Pagination?": "Yes, limit 50, offset-based"
  - "Mark all as read?": "Yes, with no confirmation required"

# ========== TESTING CONTRACTS ==========
test_scenarios:
  - name: "Offline notification creation"
    given: "App is offline"
    when: "Socket event 'notification:new' received"
    then: "Notification saved to local DB, email_status='pending', no API call attempted"

  - name: "Email retry backoff"
    given: "Email send fails with 5xx error"
    when: "App comes online after 2 minutes"
    then: "Retry attempted after 2^attempt minutes, logs attempt_count++"

  - name: "Sync conflict resolution"
    given: "Local notification marked read at 10:00, server marked read at 10:05"
    when: "Sync runs"
    then: "Server timestamp (10:05) wins, local updated"

  - name: "Rate limiting for low stock email"
    given: "Same product_id low stock event triggers 3 times in 30 minutes"
    when: "EmailQueue processes"
    then: "Only 1 email sent (first event), others logged as rate_limited"