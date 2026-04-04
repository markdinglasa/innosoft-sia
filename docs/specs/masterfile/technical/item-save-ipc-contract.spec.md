
# TECH SPEC — Item Save IPC Contract

## 1. Spec ID
TECH-MST-003

## 2. Related Feature
- FEAT-MST-003 — Item & Inventory Management

## 3. Objective
Define the exact IPC contract for saving Item masterfile data safely between renderer and main process.

## 4. Architecture Rule
Renderer MUST NOT access DB directly.

All item saves MUST flow through:

UI → Renderer Service → Preload Bridge → IPC → Main Process Service → DB

## 5. IPC Channel
```ts
"masterfiles:item:save"
```

## 6. Input Contract
```ts
type SaveItemIpcPayload = {
  item: {
    id?: number;
    code?: string;
    sku: string;
    barcode?: string | null;
    name: string;
    shortName?: string | null;
    description?: string | null;
    itemGroupId?: number | null;
    unitId: number;
    isInventoryTracked: boolean;
    isComposite?: boolean;
    isActive?: boolean;
    updatedAt?: string;
  };
  prices: {
    id?: number;
    priceType: "RETAIL" | "WHOLESALE" | "SPECIAL";
    amount: number;
    isActive?: boolean;
  }[];
  packages?: {
    id?: number;
    relationUnitId: number;
    factor: number;
    sku?: string | null;
    barcode?: string | null;
    packagePrice: number;
    isActive?: boolean;
  }[];
};
```

## 7. Validation Requirements

Validation MUST occur at IPC boundary using Zod.

Required Rules

- sku required
- name required
- unitId required
- prices.length >= 1
- each price amount > 0
- package factor > 0
- updatedAt required for updates
- priceType must be enum
- unknown fields should be rejected or sanitized explicitly

## 8. Output Contract
```ts
type SaveItemIpcResult = {
  success: boolean;
  itemId: number;
  updatedAt: string;
};
```

## 9. Main Process Responsibilities

Main process must:

- validate payload
- validate uniqueness
- validate optimistic lock
- execute parent-child sync
- initialize inventory if required
- return normalized result

## 10. Forbidden Behavior

- renderer must not generate DB IDs
- renderer must not calculate child sync diffs
- renderer must not bypass IPC validation

## 11. Acceptance Criteria

- malformed item payloads are rejected before DB call
- valid item payloads save successfully through IPC
- stale updates are blocked
- parent-child sync is preserved

## 12. Agent Restrictions

- DO NOT add undocumented fields to payload contract
- DO NOT bypass schema validation in preload or main    