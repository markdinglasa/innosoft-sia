# UI Components (React)

## Components:

- NotificationBell	onClick, unreadCount	Badge with count. Opens NotificationTray on click.
- NotificationTray	isOpen, onClose, maxHeight	Virtual list (react‑virtual), grouped by date. Actions: "Mark all as read", "Clear older than 90 days".
- NotificationItem	notification, onMarkRead	Shows icon, title, body, time ago. Click → mark read.

## Real‑time updates:

- Use useNotificationIPC() hook that subscribes to notification:new and updates local React Query / Zustand store.
- Automatically refetch unread count on each new notification.