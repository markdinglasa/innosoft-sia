# Offline Sync / Local-First Architecture

This plan adds **offline-first support** to the Electron SIA app. Currently, all reads and writes go directly to a remote MSSQL server. If the connection drops, the app fails. This plan introduces a **local SQLite database** as a transparent write-through layer — writes are always stored locally first, and synced to MSSQL when connectivity is restored.

## Architecture Overview

```
[User Action]
      ↓
[BaseService.create/update/delete]
      ↓
[Connectivity Check]────offline────→ [SQLite Local Write]
      ↓ online                              ↓
[MSSQL Write]                  [Enqueue to SyncQueue]
                                             ↓
                                [On Reconnect: SyncEngine]
                                             ↓
                                    [Replay to MSSQL]
```

> [!IMPORTANT]
> This is a **V1 implementation using a last-write-wins conflict strategy**. More advanced conflict resolution (e.g., CRDTs or operational transforms) can be added later.

---

## Proposed Changes

### Module 1 — SQLite Local Database

**Goal**: Embed a local SQLite DB in the Electron app that runs independently of MSSQL.

#### [NEW] `src/main/typeORM/local-configurations.ts`
- Add a second TypeORM `DataSource` using `better-sqlite3` driver
- Store the DB file in `app.getPath('userData')` so it persists between sessions
- Register `SyncQueueEntity` and `SyncMetaEntity` with this data source

#### [MODIFY] [src/main/index.ts](file:///Users/markdinglasa/Desktop/SIA/innosoft-sia/src/main/index.ts)
- Call `initializeLocalDatabase()` on startup alongside [initializeDatabase()](file:///Users/markdinglasa/Desktop/SIA/innosoft-sia/src/main/typeORM/configurations.ts#23-54)
- Make local DB init failure non-fatal (app can still run with remote only)

---

### Module 2 — Connectivity Monitor

**Goal**: Detect MSSQL connectivity status and broadcast it to the renderer.

#### [NEW] `src/main/services/connectivity.service.ts`
- Poll MSSQL connectivity every 10 seconds using a lightweight `SELECT 1` query
- Expose `isOnline(): boolean` getter
- Emit `connectivity:changed` IPC event with `{ online: boolean }` payload on state change

#### [MODIFY] [src/main/ipcMain/ipcApi.ts](file:///Users/markdinglasa/Desktop/SIA/innosoft-sia/src/main/ipcMain/ipcApi.ts)
- Register `connectivity:get-status` IPC handler to let renderer query current status on load

#### [NEW] `src/renderer/src/hooks/useConnectivity.ts`
- Subscribe to `connectivity:changed` IPC event
- Store `isOnline` in a Redux slice

---

### Module 3 — Sync Queue Entity

**Goal**: A persistent queue of write operations captured during offline periods.

#### [NEW] `src/main/entities/utilities/SyncQueue.entity.ts`
```typescript
@Entity()
export class SyncQueueEntity {
  @PrimaryGeneratedColumn() id: number
  @Column() tableName: string
  @Column() operation: 'CREATE' | 'UPDATE' | 'DELETE'
  @Column('text') payload: string  // JSON
  @Column({ default: 'pending' }) status: 'pending' | 'synced' | 'failed'
  @Column({ default: 0 }) retries: number
  @CreateDateColumn() createdAt: Date
  @Column({ nullable: true }) syncedAt: Date
}
```

#### [NEW] `src/main/services/sync-queue.service.ts`
- `enqueue(table, operation, payload)` — insert into local SQLite
- `getPending()` — list all items with status `pending`
- `markSynced(id)` / `markFailed(id)` — update status

---

### Module 4 — Modified BaseService (Write-Through Layer)

**Goal**: Transparently route writes to MSSQL or local SQLite depending on connectivity.

#### [MODIFY] [src/main/services/base.service.ts](file:///Users/markdinglasa/Desktop/SIA/innosoft-sia/src/main/services/base.service.ts)
- In [create](file:///Users/markdinglasa/Desktop/SIA/innosoft-sia/src/main/services/base.service.ts#231-256), [update](file:///Users/markdinglasa/Desktop/SIA/innosoft-sia/src/main/services/base.service.ts#27-28), [delete](file:///Users/markdinglasa/Desktop/SIA/innosoft-sia/src/main/services/base.service.ts#290-319):
  1. Check `ConnectivityService.isOnline()`
  2. **If online** → current behavior (write to MSSQL)
  3. **If offline** → write to local SQLite entity (shadow table) + enqueue to `SyncQueueService`
- The entity table name is derived from `AppDataSource.getMetadata(this.entity).tableName`

> [!WARNING]
> Shadow tables (local SQLite mirrors of MSSQL tables) need to be defined separately or use a generic JSON-blob approach. **V1 will use the JSON-blob queue approach** (no full shadow tables) to minimize complexity. Reads will still require connectivity in V1.

---

### Module 5 — Sync Engine

**Goal**: Replay the offline queue to MSSQL when connectivity is restored.

#### [NEW] `src/main/services/sync-engine.service.ts`
- Subscribe to `ConnectivityService` `onOnline` event
- On reconnect:
  1. Fetch all `pending` items from `SyncQueueEntity` (ordered by `createdAt` ASC)
  2. For each item, call the appropriate [BaseService](file:///Users/markdinglasa/Desktop/SIA/innosoft-sia/src/main/services/base.service.ts#35-320) method on the MSSQL datasource
  3. Mark each as `synced` or `failed` (with retry count increment)
  4. Emit `sync:progress` IPC event after each item
  5. Emit `sync:complete` IPC event when queue is empty

---

### Module 6 — Renderer Sync Status UI

**Goal**: Show the user their connectivity and sync state at all times.

#### [NEW] `src/renderer/src/store/syncSlice.ts`
```typescript
interface SyncState {
  isOnline: boolean
  isSyncing: boolean
  pendingCount: number
  lastSyncedAt: string | null
}
```

#### [NEW] `src/renderer/src/components/SyncStatusBadge.tsx`
- Shows a colored indicator:
  - 🟢 **Online** — connected to server
  - 🟡 **Syncing** — replaying offline queue
  - 🔴 **Offline** — working in local mode
- Displays pending count when offline (e.g. "3 pending")

#### [MODIFY] Main layout / topbar component
- Integrate `<SyncStatusBadge />` into the topbar

---

## Verification Plan

### Manual Tests (run after each module is implemented)

| Test | Steps |
|---|---|
| **Offline write queues** | 1. Stop MSSQL. 2. Open app. 3. Create a new transaction. 4. Check SQLite `SyncQueue` table has 1 pending entry. |
| **Online sync replays** | 1. Start MSSQL again. 2. Wait 10s (or trigger reconnect). 3. Verify the queued transaction appears in MSSQL and `SyncQueue` entry is `synced`. |
| **UI badge updates** | 1. Stop MSSQL → badge should turn RED. 2. Restart MSSQL → badge turns YELLOW (syncing) then GREEN. |
| **Conflict resolution** | 1. Offline: update Record A on client. 2. Online: update same Record A directly in MSSQL. 3. Reconnect client → verify last-write-wins (client value should overwrite). |
| **App startup offline** | 1. Stop MSSQL. 2. Launch the app. 3. Verify app opens without crash. |

### No automated tests currently exist in this codebase.
All verification will be done via manual testing as described above.
