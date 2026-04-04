# Email Queue Engine (Resend)
### Files:

- main/email/emailQueueProcessor.ts
- main/email/resendClient.ts
- main/email/rateLimiter.ts

### Processing Rules:

#### Trigger conditions (from SDD):

- priority = 'critical' AND type = 'error' → send immediately (1s retry if fails)
- type = 'security' → send immediately
- type = 'warning' AND metadata.stock_level < 5 → rate‑limited (1 per hour per product_id)

#### Queue processing:

- Background worker runs every 30 seconds when online.
- Fetches status IN ('queued','failed') AND attempt_count < 5 ordered by last_attempt_at ASC.
- Batch size = 10.
- Uses exponential backoff: attempts 1→2→3→4→5 with delays: 1m, 5m, 15m, 1h, 4h.
- After 5 failures → status = 'abandoned', log error.

#### Rate limiting:

- Per trigger type + key (e.g., low_stock:product_123).
- Store limits in memory (Map) with TTL.
- If rate limited → do not enqueue, just update sys_notifications.email_status = 'rate_limited'.

#### Idempotency:

- Use notification_id as idempotency key with Resend’s idempotencyKey header.   

#### Resend API Integration:

```ts
await resend.emails.send({
  from: 'noreply@pos-system.local',
  to: adminEmail,
  subject: `[POS Alert] ${title}`,
  html: renderEmailTemplate(type, metadata),
  idempotencyKey: `notif_${notification_id}`
});
```