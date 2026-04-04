# TECH-UIX-006 — Route Guards & Permission Rendering

## Goal

- Enforce UserType + Role restrictions at the UI layer.

## Guard Layers

- Shell Guard
- Route Guard
- Component Guard
- Action Guard
- Shortcut Guard

## Static UserType Rules

- Administrator
- Cashier
- Teller

## Dynamic Role Rules

- Roles define fine-grained permissions like:

```ts
canAccess('transaction.discount')
canAccess('reports.sales')
canAccess('masterfiles.items.edit')
```

## Hard Rule

- A hidden button is not security by itself.
- All restricted UI actions must still be permission-checked through secure IPC/backend validation.