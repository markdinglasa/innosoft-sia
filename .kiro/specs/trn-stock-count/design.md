# Stock Count Adjustment Feature - Design Document

## Overview

The Stock Count Adjustment feature is a comprehensive inventory reconciliation system that enables POS users to record physical item counts, compare them to system records, manage approval workflows, and apply adjustments to maintain accurate inventory levels. The system ensures data integrity through atomic transactions, maintains immutable audit trails, and supports concurrent operations safely through item locking mechanisms.

### Key Design Principles

1. **Data Integrity First**: All operations use database transactions to ensure atomicity and consistency
2. **Immutable Audit Trails**: Complete record of all changes that cannot be modified or deleted
3. **Safe Concurrency**: Item locking prevents concurrent adjustments to the same item
4. **Fail-Safe Operations**: Comprehensive error handling with automatic rollback on failures
5. **Role-Based Access Control**: Fine-grained permissions for create, approve, and apply operations
6. **Incremental Deployment**: Modular design enables phased implementation

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     POS Frontend Layer                           │
│  (Adjustment UI, Batch Processing UI, Audit Trail Viewer)       │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    API Gateway Layer                             │
│  (Authentication, Authorization, Request Validation)            │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│              Stock Adjustment Service Layer                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ StockAdjustmentService                                   │   │
│  │ - Create adjustment                                      │   │
│  │ - Submit for approval                                    │   │
│  │ - Apply adjustment                                       │   │
│  │ - Cancel adjustment                                      │   │
│  │ - Reverse adjustment                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ApprovalWorkflowService                                  │   │
│  │ - Approve adjustment                                     │   │
│  │ - Reject adjustment                                      │   │
│  │ - Auto-approve low-variance adjustments                  │   │
│  │ - Manage approval notifications                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ValidationService                                        │   │
│  │ - Validate item existence                                │   │
│  │ - Validate physical count format                         │   │
│  │ - Validate adjustment reason                             │   │
│  │ - Detect concurrent modifications                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ BatchProcessingService                                   │   │
│  │ - Create batch                                           │   │
│  │ - Add items to batch                                     │   │
│  │ - Apply batch atomically                                 │   │
│  │ - Handle batch failures                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ AuditTrailService                                        │   │
│  │ - Record adjustment creation                             │   │
│  │ - Record status changes                                  │   │
│  │ - Record approvals/rejections                            │   │
│  │ - Record applications                                    │   │
│  │ - Prevent modifications                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ InventoryService                                         │   │
│  │ - Update inventory quantities                            │   │
│  │ - Create stock movements                                 │   │
│  │ - Create inventory snapshots                             │   │
│  │ - Trigger reorder alerts                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ LockingService                                           │   │
│  │ - Acquire item lock                                      │   │
│  │ - Release item lock                                      │   │
│  │ - Check lock status                                      │   │
│  │ - Handle lock expiration                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ NotificationService                                      │   │
│  │ - Send approval notifications                            │   │
│  │ - Send status change notifications                       │   │
│  │ - Send high-variance alerts                              │   │
│  │ - Send lock expiration notifications                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                  Data Access Layer                               │
│  (Repository Pattern, Query Optimization, Connection Pooling)   │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   Database Layer                                 │
│  (PostgreSQL with ACID transactions, Indexes, Constraints)      │
└─────────────────────────────────────────────────────────────────┘
```

### Module Organization

```
stock-adjustment/
├── api/
│   ├── routes/
│   │   ├── adjustments.ts
│   │   ├── approvals.ts
│   │   ├── batches.ts
│   │   └── audit-trail.ts
│   └── middleware/
│       ├── auth.ts
│       ├── validation.ts
│       └── error-handler.ts
├── services/
│   ├── stock-adjustment.service.ts
│   ├── approval-workflow.service.ts
│   ├── validation.service.ts
│   ├── batch-processing.service.ts
│   ├── audit-trail.service.ts
│   ├── inventory.service.ts
│   ├── locking.service.ts
│   └── notification.service.ts
├── repositories/
│   ├── adjustment.repository.ts
│   ├── audit-trail.repository.ts
│   ├── inventory-snapshot.repository.ts
│   └── stock-movement.repository.ts
├── models/
│   ├── adjustment.model.ts
│   ├── audit-trail.model.ts
│   ├── stock-movement.model.ts
│   └── inventory-snapshot.model.ts
├── types/
│   ├── adjustment.types.ts
│   ├── approval.types.ts
│   └── error.types.ts
└── utils/
    ├── variance-calculator.ts
    ├── permission-checker.ts
    └── error-formatter.ts
```

---

## Data Models

### Database Schema

#### Adjustments Table

```sql
CREATE TABLE adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  physical_count INTEGER NOT NULL CHECK (physical_count >= 0),
  system_inventory INTEGER NOT NULL,
  variance INTEGER NOT NULL,
  variance_percentage DECIMAL(5, 2) NOT NULL,
  adjustment_reason VARCHAR(50) NOT NULL,
  custom_reason TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Draft',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  submitted_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  approval_reason TEXT,
  rejected_at TIMESTAMP,
  rejected_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  applied_at TIMESTAMP,
  applied_by UUID REFERENCES users(id),
  cancelled_at TIMESTAMP,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  batch_id UUID REFERENCES adjustment_batches(id),
  recount_requested BOOLEAN DEFAULT FALSE,
  recount_completed BOOLEAN DEFAULT FALSE,
  recount_count INTEGER,
  recount_at TIMESTAMP,
  recount_by UUID REFERENCES users(id),
  original_adjustment_id UUID REFERENCES adjustments(id),
  locked_by UUID REFERENCES users(id),
  locked_at TIMESTAMP,
  lock_expires_at TIMESTAMP,
  version INTEGER NOT NULL DEFAULT 1,
  
  CONSTRAINT valid_status CHECK (status IN ('Draft', 'Pending_Approval', 'Approved', 'Applied', 'Rejected', 'Cancelled')),
  CONSTRAINT valid_reason CHECK (adjustment_reason IN ('Shrinkage', 'Damage', 'Recount', 'System_Error', 'Other')),
  CONSTRAINT custom_reason_required CHECK (adjustment_reason != 'Other' OR custom_reason IS NOT NULL)
);

CREATE INDEX idx_adjustments_item_id ON adjustments(item_id);
CREATE INDEX idx_adjustments_status ON adjustments(status);
CREATE INDEX idx_adjustments_created_at ON adjustments(created_at DESC);
CREATE INDEX idx_adjustments_batch_id ON adjustments(batch_id);
CREATE INDEX idx_adjustments_locked_by ON adjustments(locked_by);
CREATE INDEX idx_adjustments_created_by ON adjustments(created_by);
```

#### Audit Trail Table

```sql
CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_id UUID NOT NULL REFERENCES adjustments(id),
  event_type VARCHAR(50) NOT NULL,
  event_details JSONB NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  
  CONSTRAINT valid_event_type CHECK (event_type IN (
    'Created', 'Submitted', 'Approved', 'Rejected', 'Applied', 
    'Cancelled', 'Recounted', 'Reversed', 'Lock_Acquired', 'Lock_Released'
  ))
);

CREATE INDEX idx_audit_trail_adjustment_id ON audit_trail(adjustment_id);
CREATE INDEX idx_audit_trail_timestamp ON audit_trail(timestamp DESC);
CREATE INDEX idx_audit_trail_user_id ON audit_trail(user_id);
CREATE INDEX idx_audit_trail_event_type ON audit_trail(event_type);
```

#### Stock Movements Table

```sql
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  movement_type VARCHAR(20) NOT NULL,
  quantity_change INTEGER NOT NULL,
  adjustment_id UUID REFERENCES adjustments(id),
  reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  
  CONSTRAINT valid_movement_type CHECK (movement_type IN ('Sale', 'Receipt', 'Adjustment'))
);

CREATE INDEX idx_stock_movements_item_id ON stock_movements(item_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at DESC);
CREATE INDEX idx_stock_movements_adjustment_id ON stock_movements(adjustment_id);
```

#### Inventory Snapshots Table

```sql
CREATE TABLE inventory_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL,
  snapshot_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  quantity INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  adjustment_id UUID REFERENCES adjustments(id),
  
  CONSTRAINT valid_quantity CHECK (quantity >= 0)
);

CREATE INDEX idx_inventory_snapshots_item_id ON inventory_snapshots(item_id);
CREATE INDEX idx_inventory_snapshots_snapshot_date ON inventory_snapshots(snapshot_date);
CREATE INDEX idx_inventory_snapshots_adjustment_id ON inventory_snapshots(adjustment_id);
```

#### Adjustment Batches Table

```sql
CREATE TABLE adjustment_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Draft',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  applied_at TIMESTAMP,
  total_adjustments INTEGER NOT NULL DEFAULT 0,
  applied_adjustments INTEGER NOT NULL DEFAULT 0,
  failed_adjustments INTEGER NOT NULL DEFAULT 0,
  
  CONSTRAINT valid_batch_status CHECK (status IN ('Draft', 'Submitted', 'Applied', 'Failed', 'Cancelled'))
);

CREATE INDEX idx_adjustment_batches_created_by ON adjustment_batches(created_by);
CREATE INDEX idx_adjustment_batches_status ON adjustment_batches(status);
```

#### Item Locks Table

```sql
CREATE TABLE item_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL UNIQUE REFERENCES inventory_items(id),
  locked_by UUID NOT NULL REFERENCES users(id),
  adjustment_id UUID NOT NULL REFERENCES adjustments(id),
  locked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  
  CONSTRAINT valid_expiration CHECK (expires_at > locked_at)
);

CREATE INDEX idx_item_locks_item_id ON item_locks(item_id);
CREATE INDEX idx_item_locks_expires_at ON item_locks(expires_at);
```

### Data Model Relationships

```
Adjustments (1) ──────────────── (N) Audit_Trail
    │
    ├─ (1) ──────────────── (N) Stock_Movements
    │
    ├─ (1) ──────────────── (N) Inventory_Snapshots
    │
    ├─ (N) ──────────────── (1) Adjustment_Batches
    │
    └─ (1) ──────────────── (1) Item_Locks
```

---

## API Specifications

### Adjustment Endpoints

#### Create Adjustment

```
POST /api/v1/adjustments
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "itemId": "uuid",
  "physicalCount": 50,
  "adjustmentReason": "Shrinkage" | "Damage" | "Recount" | "System_Error" | "Other",
  "customReason": "string (required if reason is 'Other')"
}

Response (201 Created):
{
  "id": "uuid",
  "itemId": "uuid",
  "itemName": "string",
  "physicalCount": 50,
  "systemInventory": 55,
  "variance": -5,
  "variancePercentage": -9.09,
  "adjustmentReason": "Shrinkage",
  "status": "Draft",
  "createdAt": "2024-01-15T10:30:00Z",
  "createdBy": "uuid"
}

Error Responses:
- 400 Bad Request: Invalid physical count or missing required fields
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks Create_Adjustment permission
- 404 Not Found: Item does not exist
- 409 Conflict: Item is locked by another adjustment
```

#### Submit Adjustment for Approval

```
POST /api/v1/adjustments/{id}/submit
Authorization: Bearer {token}

Response (200 OK):
{
  "id": "uuid",
  "status": "Pending_Approval",
  "submittedAt": "2024-01-15T10:35:00Z",
  "submittedBy": "uuid"
}

Error Responses:
- 400 Bad Request: Adjustment not in Draft status
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User is not the adjustment creator
- 404 Not Found: Adjustment does not exist
- 409 Conflict: Item has been modified since adjustment creation
```

#### Approve Adjustment

```
POST /api/v1/adjustments/{id}/approve
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "approvalReason": "string (optional)"
}

Response (200 OK):
{
  "id": "uuid",
  "status": "Approved",
  "approvedAt": "2024-01-15T10:40:00Z",
  "approvedBy": "uuid"
}

Error Responses:
- 400 Bad Request: Adjustment not in Pending_Approval status
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks Approve_Adjustment permission or is the creator
- 404 Not Found: Adjustment does not exist
```

#### Reject Adjustment

```
POST /api/v1/adjustments/{id}/reject
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "rejectionReason": "string (required)"
}

Response (200 OK):
{
  "id": "uuid",
  "status": "Rejected",
  "rejectedAt": "2024-01-15T10:40:00Z",
  "rejectedBy": "uuid",
  "rejectionReason": "string"
}

Error Responses:
- 400 Bad Request: Adjustment not in Pending_Approval status or missing rejection reason
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks Approve_Adjustment permission
- 404 Not Found: Adjustment does not exist
```

#### Apply Adjustment

```
POST /api/v1/adjustments/{id}/apply
Authorization: Bearer {token}

Response (200 OK):
{
  "id": "uuid",
  "status": "Applied",
  "appliedAt": "2024-01-15T10:45:00Z",
  "appliedBy": "uuid",
  "stockMovementId": "uuid"
}

Error Responses:
- 400 Bad Request: Adjustment not in Approved status
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks Apply_Adjustment permission
- 404 Not Found: Adjustment does not exist
- 409 Conflict: Concurrent modification detected or inventory would become negative
- 500 Internal Server Error: Database transaction failed (with automatic rollback)
```

#### Cancel Adjustment

```
POST /api/v1/adjustments/{id}/cancel
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "cancellationReason": "string (required)"
}

Response (200 OK):
{
  "id": "uuid",
  "status": "Cancelled",
  "cancelledAt": "2024-01-15T10:50:00Z",
  "cancelledBy": "uuid",
  "cancellationReason": "string"
}

Error Responses:
- 400 Bad Request: Adjustment in Applied status (use reversal instead) or missing cancellation reason
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User is not the creator or lacks permission
- 404 Not Found: Adjustment does not exist
```

#### Reverse Adjustment

```
POST /api/v1/adjustments/{id}/reverse
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "reversalReason": "string (required)"
}

Response (201 Created):
{
  "id": "uuid (new reversal adjustment)",
  "originalAdjustmentId": "uuid",
  "itemId": "uuid",
  "physicalCount": "original system inventory",
  "systemInventory": "original physical count",
  "variance": "opposite of original variance",
  "status": "Draft",
  "reversalReason": "string"
}

Error Responses:
- 400 Bad Request: Adjustment not in Applied status or missing reversal reason
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks Apply_Adjustment permission
- 404 Not Found: Adjustment does not exist
```

#### Get Adjustment Details

```
GET /api/v1/adjustments/{id}
Authorization: Bearer {token}

Response (200 OK):
{
  "id": "uuid",
  "itemId": "uuid",
  "itemName": "string",
  "physicalCount": 50,
  "systemInventory": 55,
  "variance": -5,
  "variancePercentage": -9.09,
  "adjustmentReason": "Shrinkage",
  "customReason": null,
  "status": "Approved",
  "createdAt": "2024-01-15T10:30:00Z",
  "createdBy": "uuid",
  "submittedAt": "2024-01-15T10:35:00Z",
  "approvedAt": "2024-01-15T10:40:00Z",
  "approvedBy": "uuid",
  "batchId": null,
  "recountRequested": false,
  "auditTrail": [...]
}

Error Responses:
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks View_Adjustment_History permission
- 404 Not Found: Adjustment does not exist
```

#### List Adjustments

```
GET /api/v1/adjustments?status=Pending_Approval&itemId=uuid&createdBy=uuid&dateFrom=2024-01-01&dateTo=2024-01-31&page=1&limit=20
Authorization: Bearer {token}

Response (200 OK):
{
  "data": [
    {
      "id": "uuid",
      "itemId": "uuid",
      "itemName": "string",
      "variance": -5,
      "status": "Pending_Approval",
      "createdAt": "2024-01-15T10:30:00Z",
      "createdBy": "uuid"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

Error Responses:
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks View_Adjustment_History permission
```

### Batch Endpoints

#### Create Batch

```
POST /api/v1/batches
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "batchName": "string",
  "adjustments": [
    {
      "itemId": "uuid",
      "physicalCount": 50,
      "adjustmentReason": "Shrinkage"
    }
  ]
}

Response (201 Created):
{
  "id": "uuid",
  "batchName": "string",
  "status": "Draft",
  "totalAdjustments": 5,
  "adjustments": [...]
}

Error Responses:
- 400 Bad Request: Invalid adjustment data
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks Create_Adjustment permission
```

#### Apply Batch

```
POST /api/v1/batches/{id}/apply
Authorization: Bearer {token}

Response (200 OK):
{
  "id": "uuid",
  "status": "Applied",
  "appliedAt": "2024-01-15T11:00:00Z",
  "totalAdjustments": 5,
  "appliedAdjustments": 5,
  "failedAdjustments": 0
}

Error Responses:
- 400 Bad Request: Batch not in Submitted status
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks Apply_Adjustment permission
- 404 Not Found: Batch does not exist
- 409 Conflict: One or more adjustments failed (batch rolled back)
```

### Audit Trail Endpoints

#### Get Audit Trail

```
GET /api/v1/adjustments/{id}/audit-trail
Authorization: Bearer {token}

Response (200 OK):
{
  "adjustmentId": "uuid",
  "events": [
    {
      "id": "uuid",
      "eventType": "Created",
      "timestamp": "2024-01-15T10:30:00Z",
      "userId": "uuid",
      "eventDetails": {
        "physicalCount": 50,
        "systemInventory": 55,
        "variance": -5
      }
    },
    {
      "id": "uuid",
      "eventType": "Submitted",
      "timestamp": "2024-01-15T10:35:00Z",
      "userId": "uuid",
      "eventDetails": {}
    }
  ]
}

Error Responses:
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks View_Adjustment_History permission
- 404 Not Found: Adjustment does not exist
```

---

## Workflow State Machine

### Adjustment Status Transitions

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
              ┌──────────┐                                │
              │  Draft   │                                │
              └────┬─────┘                                │
                   │                                      │
        ┌──────────┴──────────┐                           │
        │                     │                           │
        ▼                     ▼                           │
   ┌─────────┐          ┌──────────┐                     │
   │Cancelled│          │Submitted │                     │
   └─────────┘          └────┬─────┘                     │
                             │                           │
                    ┌────────┴────────┐                  │
                    │                 │                  │
                    ▼                 ▼                  │
            ┌──────────────┐    ┌─────────┐             │
            │Pending_      │    │Rejected │             │
            │Approval      │    └─────────┘             │
            └────┬─────────┘                            │
                 │                                      │
        ┌────────┴────────┐                             │
        │                 │                             │
        ▼                 ▼                             │
   ┌─────────┐       ┌──────────┐                      │
   │Approved │       │Cancelled │                      │
   └────┬────┘       └──────────┘                      │
        │                                              │
        ▼                                              │
   ┌─────────┐                                         │
   │ Applied │◄────────────────────────────────────────┘
   └─────────┘
```

### State Transition Rules

| From | To | Condition | Action |
|------|----|-----------| -------|
| Draft | Submitted | User submits for approval | Validate data, acquire lock, notify approvers |
| Draft | Cancelled | User cancels | Release lock, record cancellation |
| Submitted | Pending_Approval | Auto-transition | Notify approvers |
| Pending_Approval | Approved | Approver approves OR auto-approve if variance < threshold | Record approval, prepare for application |
| Pending_Approval | Rejected | Approver rejects | Record rejection, release lock, notify creator |
| Pending_Approval | Cancelled | Authorized user cancels | Release lock, record cancellation |
| Approved | Applied | User applies | Update inventory, create stock movement, create snapshot |
| Approved | Cancelled | Authorized user cancels | Release lock, record cancellation |

### Auto-Approval Logic

```
IF variance_absolute_value <= auto_approve_threshold_units
   OR variance_percentage <= auto_approve_threshold_percentage
THEN
   status = "Approved"
   approved_by = SYSTEM
   approved_at = CURRENT_TIMESTAMP
   notify(creator, "Your adjustment was auto-approved")
ELSE
   status = "Pending_Approval"
   notify(approvers, "New adjustment requires approval")
END IF
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection and Consolidation

After analyzing all acceptance criteria, I identified 80+ testable criteria. The following properties consolidate redundant criteria into comprehensive, universally quantified properties:

### Property 1: Variance Calculation Correctness

*For any* physical count and system inventory quantity, the calculated variance SHALL equal (physical_count - system_inventory), and the variance percentage SHALL equal (variance / system_inventory * 100).

**Validates: Requirements 1.3, 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 2: Physical Count Validation

*For any* physical count input, if it is a non-negative integer, it SHALL be accepted; if it is negative or non-numeric, it SHALL be rejected with a validation error.

**Validates: Requirements 1.4, 1.5, 3.3**

### Property 3: Adjustment Reason Validation

*For any* adjustment reason, if it is in the predefined list (Shrinkage, Damage, Recount, System_Error, Other), it SHALL be accepted; if the reason is "Other", a custom reason description SHALL be required; otherwise, it SHALL be rejected.

**Validates: Requirements 1.6, 1.7, 3.4**

### Property 4: Initial Adjustment State

*For any* newly created adjustment, the status SHALL be "Draft", the created_at timestamp SHALL be the current time, and the created_by user SHALL be the authenticated user.

**Validates: Requirements 1.8, 4.1**

### Property 5: Item Existence Validation

*For any* adjustment submission, if the item exists in the inventory system, the adjustment SHALL be accepted; if the item does not exist, the adjustment SHALL be rejected with an error identifying the invalid item.

**Validates: Requirements 3.1, 3.2**

### Property 6: Concurrent Modification Detection

*For any* adjustment where the item inventory has changed since adjustment creation, the system SHALL detect the conflict and prevent application until the user reviews and resubmits the adjustment.

**Validates: Requirements 3.7, 8.3, 16.4, 16.6**

### Property 7: Status Transition Correctness

*For any* adjustment, valid status transitions SHALL follow the state machine: Draft → Submitted → Pending_Approval → (Approved OR Rejected), Approved → Applied, and any status → Cancelled. Invalid transitions SHALL be rejected.

**Validates: Requirements 4.1, 4.2, 4.5, 4.6, 5.2, 15.3**

### Property 8: Auto-Approval Logic

*For any* adjustment where the absolute variance is less than or equal to the auto-approval threshold (default 5 units or 2%), the adjustment SHALL be automatically approved without requiring manual approval; otherwise, it SHALL require manual approval.

**Validates: Requirements 4.7**

### Property 9: Self-Approval Prevention

*For any* adjustment, if the approver is the same user as the creator, the approval SHALL be rejected.

**Validates: Requirements 9.7**

### Property 10: Inventory Update Correctness

*For any* applied adjustment, the final inventory quantity SHALL equal the physical count from the adjustment.

**Validates: Requirements 5.1, 5.6, 5.7, 18.4**

### Property 11: Negative Inventory Prevention

*For any* adjustment, if applying it would result in negative inventory, the application SHALL be rejected with an error message.

**Validates: Requirements 5.6, 5.7**

### Property 12: Stock Movement Creation

*For any* applied adjustment, a corresponding Stock_Movement record SHALL be created with type "Adjustment", the correct quantity change, and all required metadata.

**Validates: Requirements 5.4, 7.1, 7.2**

### Property 13: Audit Trail Immutability

*For any* audit trail record, it SHALL NOT be modifiable or deletable after creation. All status changes, approvals, rejections, and applications SHALL be recorded in the audit trail with timestamp and user information.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.7, 6.8**

### Property 14: Audit Trail Ordering

*For any* adjustment, all audit trail events SHALL be retrievable in chronological order (earliest first).

**Validates: Requirements 6.5, 7.3**

### Property 15: Stock Movement Filtering

*For any* stock movement filter (Sales, Receipts, Adjustments, All), only movements of the specified type(s) SHALL be returned.

**Validates: Requirements 7.4**

### Property 16: Running Balance Calculation

*For any* sequence of stock movements for an item, the running balance after each movement SHALL be correctly calculated as the cumulative sum of all quantity changes up to that point.

**Validates: Requirements 7.5**

### Property 17: Transaction Atomicity

*For any* adjustment application, either all changes (inventory update, stock movement creation, snapshot creation, audit trail recording) SHALL succeed, or all SHALL be rolled back. No partial updates SHALL be applied.

**Validates: Requirements 5.5, 8.1, 8.6, 18.1, 18.2**

### Property 18: Batch Expansion

*For any* batch with N items, submitting the batch SHALL create exactly N individual adjustments, each with the same batch_id.

**Validates: Requirements 10.3, 10.4**

### Property 19: Batch Atomic Application

*For any* batch application, either all adjustments in the batch SHALL be applied successfully, or all SHALL be rolled back. No partial batch application SHALL occur.

**Validates: Requirements 10.7**

### Property 20: Batch Readiness

*For any* batch, the batch SHALL only be applicable if all adjustments in the batch have status "Approved".

**Validates: Requirements 10.6**

### Property 21: Recount Blocking

*For any* adjustment with recount_requested=true and recount_completed=false, the adjustment SHALL NOT be applicable.

**Validates: Requirements 12.2**

### Property 22: Recount Variance Recalculation

*For any* recount, the variance SHALL be recalculated as (new_physical_count - system_inventory), and the recount timestamp, user, and new count SHALL be recorded in the audit trail.

**Validates: Requirements 12.4, 12.5**

### Property 23: Recount Approval Logic

*For any* recount where the new variance still exceeds the manual approval threshold, the adjustment SHALL require manual approval before application.

**Validates: Requirements 12.6**

### Property 24: Inventory Snapshot Creation

*For any* applied adjustment, an inventory snapshot SHALL be created with the current inventory quantities for all items at that point in time.

**Validates: Requirements 13.1**

### Property 25: Snapshot Retrieval

*For any* requested date, the inventory snapshot system SHALL retrieve the inventory state as it existed on that date, allowing comparison with current state.

**Validates: Requirements 13.2, 13.3**

### Property 26: Item Locking

*For any* adjustment creation, the item SHALL be locked to prevent concurrent adjustments. When the adjustment is applied or cancelled, the lock SHALL be released.

**Validates: Requirements 14.1, 14.3**

### Property 27: Lock Conflict Detection

*For any* attempt to create an adjustment for a locked item, the system SHALL detect the lock and reject the operation with a message indicating which user locked the item.

**Validates: Requirements 14.4**

### Property 28: Lock Expiration

*For any* item lock that has exceeded the expiration time (default 30 minutes), the lock SHALL be automatically released.

**Validates: Requirements 14.5**

### Property 29: Cancellation Permissions

*For any* adjustment in Draft or Pending_Approval status, the creator SHALL be able to cancel it. For any adjustment in Approved status, an authorized user SHALL be able to cancel it. For any adjustment in Applied status, cancellation SHALL be rejected (reversal required instead).

**Validates: Requirements 15.1, 15.2, 15.7**

### Property 30: Cancellation Recording

*For any* cancelled adjustment, the status SHALL change to "Cancelled", the cancellation reason SHALL be recorded, and the cancellation timestamp and user SHALL be recorded in the audit trail.

**Validates: Requirements 15.3, 15.4, 15.5, 15.6**

### Property 31: Reversal Adjustment Creation

*For any* applied adjustment that is reversed, a new adjustment SHALL be created with the opposite variance (physical_count = original system_inventory, system_inventory = original physical_count), linked to the original adjustment, and requiring a reversal reason.

**Validates: Requirements 19.1, 19.2, 19.3**

### Property 32: Reversal Application

*For any* applied reversal adjustment, the inventory SHALL be restored to the state before the original adjustment, and both the original and reversal adjustments SHALL be recorded in the audit trail.

**Validates: Requirements 19.4, 19.5**

### Property 33: Reversal Display

*For any* adjustment with associated reversals, the reversals SHALL be retrievable and displayable with the original adjustment.

**Validates: Requirements 19.6**

### Property 34: Concurrent Update Serialization

*For any* concurrent adjustments to different items, the updates SHALL be serialized to prevent race conditions. For any concurrent adjustments to the same item, the second adjustment SHALL be rejected due to the item lock.

**Validates: Requirements 18.3**

### Property 35: Report Aggregation

*For any* reconciliation report for a date range, the total number of adjustments, total quantity adjusted (positive and negative separately), and average variance percentage SHALL be correctly calculated and aggregated.

**Validates: Requirements 11.1, 11.2, 11.3**

### Property 36: Report Grouping

*For any* reconciliation report, adjustments SHALL be correctly grouped by adjustment reason and by user, with accurate counts for each group.

**Validates: Requirements 11.4, 11.5**

### Property 37: Report Filtering

*For any* reconciliation report with filter criteria (date range, item category, adjustment reason), only adjustments matching all filter criteria SHALL be included in the report.

**Validates: Requirements 11.6, 17.3**

### Property 38: Item Inventory Retrieval

*For any* item identifier, the system SHALL retrieve the current system inventory quantity and display it alongside the physical count field.

**Validates: Requirements 1.2**

### Property 39: Error Logging

*For any* error that occurs during adjustment operations, the error SHALL be logged with full context including user, item, adjustment details, and timestamp.

**Validates: Requirements 8.4**

---

## Error Handling Strategy

### Validation Errors

**Physical Count Validation**
- Negative values: Reject with "Physical count must be non-negative"
- Non-numeric values: Reject with "Physical count must be a valid number"
- Missing value: Reject with "Physical count is required"

**Item Validation**
- Non-existent item: Reject with "Item {itemId} does not exist in inventory"
- Locked item: Reject with "Item is currently being adjusted by {userName}. Please try again later."

**Adjustment Reason Validation**
- Invalid reason: Reject with "Adjustment reason must be one of: Shrinkage, Damage, Recount, System_Error, Other"
- Missing custom reason: Reject with "Custom reason is required when selecting 'Other'"

**Permission Validation**
- Missing permission: Reject with "You do not have permission to perform this action"
- Self-approval: Reject with "You cannot approve your own adjustments"

### Concurrent Modification Errors

**Conflict Detection**
- Item modified since adjustment creation: Reject with "Item inventory has changed since this adjustment was created. Please review the updated variance and resubmit."
- Item locked: Reject with "Item is currently being adjusted by {userName}. Please try again later."

### Transaction Errors

**Database Errors**
- Connection failure: Rollback transaction, retry up to 3 times with exponential backoff (1s, 2s, 4s)
- Constraint violation: Rollback transaction, return specific constraint error
- Deadlock: Rollback transaction, retry up to 3 times

**Inventory Errors**
- Negative inventory result: Rollback transaction, reject with "Applying this adjustment would result in negative inventory"
- Inventory mismatch: Rollback transaction, alert administrators

### Error Recovery

**Automatic Retry**
- Network errors: Retry up to 3 times with exponential backoff
- Transient database errors: Retry up to 3 times with exponential backoff
- Lock timeouts: Retry up to 3 times with exponential backoff

**Manual Intervention**
- Critical errors: Log error, notify administrators, prevent further adjustments until resolved
- Data inconsistencies: Log error, provide investigation tools, require manual correction

---

## Testing Strategy

### Property-Based Testing

Property-based tests SHALL be implemented using a PBT library appropriate for the target language (e.g., fast-check for JavaScript/TypeScript, Hypothesis for Python, QuickCheck for Haskell).

**Test Configuration**
- Minimum 100 iterations per property test
- Each property test SHALL reference its design document property
- Tag format: `Feature: trn-stock-count, Property {number}: {property_text}`

**Property Test Examples**

```typescript
// Property 1: Variance Calculation Correctness
describe('Variance Calculation', () => {
  it('should calculate variance correctly for any physical count and system inventory', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000000 }),
        fc.integer({ min: 0, max: 1000000 }),
        (physicalCount, systemInventory) => {
          const variance = calculateVariance(physicalCount, systemInventory);
          const expectedVariance = physicalCount - systemInventory;
          expect(variance).toBe(expectedVariance);
          
          const variancePercentage = calculateVariancePercentage(variance, systemInventory);
          const expectedPercentage = systemInventory === 0 ? 0 : (variance / systemInventory) * 100;
          expect(variancePercentage).toBeCloseTo(expectedPercentage, 2);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 2: Physical Count Validation
describe('Physical Count Validation', () => {
  it('should accept non-negative integers and reject negative or non-numeric values', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: -1000000, max: -1 }),
          fc.string()
        ),
        (input) => {
          const result = validatePhysicalCount(input);
          if (typeof input === 'number' && input >= 0 && Number.isInteger(input)) {
            expect(result.valid).toBe(true);
          } else {
            expect(result.valid).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 7: Status Transition Correctness
describe('Status Transitions', () => {
  it('should enforce valid status transitions and reject invalid ones', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('Draft', 'Submitted', 'Pending_Approval', 'Approved', 'Rejected', 'Applied', 'Cancelled'),
        fc.constantFrom('Draft', 'Submitted', 'Pending_Approval', 'Approved', 'Rejected', 'Applied', 'Cancelled'),
        (fromStatus, toStatus) => {
          const isValid = isValidTransition(fromStatus, toStatus);
          const validTransitions = getValidTransitions(fromStatus);
          expect(isValid).toBe(validTransitions.includes(toStatus));
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 10: Inventory Update Correctness
describe('Inventory Update', () => {
  it('should update inventory to match physical count for any applied adjustment', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000000 }),
        fc.integer({ min: 0, max: 1000000 }),
        async (physicalCount, systemInventory) => {
          const adjustment = await createAndApplyAdjustment(itemId, physicalCount, systemInventory);
          const finalInventory = await getInventoryQuantity(itemId);
          expect(finalInventory).toBe(physicalCount);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 17: Transaction Atomicity
describe('Transaction Atomicity', () => {
  it('should apply all changes atomically or rollback all changes', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          itemId: fc.uuid(),
          physicalCount: fc.integer({ min: 0, max: 1000000 })
        }), { minLength: 1, maxLength: 10 }),
        async (adjustments) => {
          const initialState = await captureInventoryState();
          try {
            await applyBatch(adjustments);
            const finalState = await captureInventoryState();
            // Verify all changes were applied
            for (const adj of adjustments) {
              expect(finalState[adj.itemId]).toBe(adj.physicalCount);
            }
          } catch (error) {
            const finalState = await captureInventoryState();
            // Verify all changes were rolled back
            expect(finalState).toEqual(initialState);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Tests

Unit tests SHALL cover:
- Variance calculation with edge cases (zero inventory, large numbers, negative variances)
- Input validation for all fields
- Status transition logic
- Permission checking
- Audit trail recording
- Lock acquisition and release
- Batch expansion and validation

**Target Coverage: 80%+**

### Integration Tests

Integration tests SHALL cover:
- End-to-end adjustment workflow (create → submit → approve → apply)
- Batch processing with multiple items
- Concurrent adjustments to different items
- Inventory system integration
- Audit trail persistence and retrieval
- Snapshot creation and retrieval
- Notification sending
- Error recovery and retry logic

### E2E Tests

E2E tests SHALL cover critical user journeys:
1. **Single Item Adjustment**: Create, submit, approve, and apply adjustment for one item
2. **Batch Adjustment**: Create batch with multiple items, submit, approve all, apply batch
3. **High-Variance Adjustment**: Create adjustment with variance exceeding threshold, verify flagging and manual approval requirement
4. **Recount Workflow**: Create adjustment, flag for recount, complete recount, verify variance recalculation
5. **Reversal Workflow**: Create and apply adjustment, then reverse it, verify inventory restoration
6. **Concurrent Adjustments**: Attempt concurrent adjustments to same item, verify lock prevents second adjustment
7. **Error Scenarios**: Test network failures, database errors, permission denials

---

## Security Design

### Role-Based Access Control (RBAC)

**Permissions**
- `Create_Adjustment`: Required to create new adjustments
- `Approve_Adjustment`: Required to approve pending adjustments
- `Apply_Adjustment`: Required to apply approved adjustments
- `View_Adjustment_History`: Required to view audit trails and adjustment history
- `Manage_Adjustment_Settings`: Required to configure thresholds and settings

**Permission Enforcement**
- All API endpoints SHALL check permissions before processing
- Permission checks SHALL occur at the service layer
- Denied operations SHALL return 403 Forbidden with clear error message

### Input Validation and Sanitization

**All user inputs SHALL be validated**
- Physical count: Non-negative integer, max 1,000,000
- Item ID: Valid UUID format, must exist in inventory
- Adjustment reason: Must be from predefined list
- Custom reason: Max 500 characters, no SQL injection patterns
- Batch name: Max 255 characters, no SQL injection patterns
- Cancellation/rejection/reversal reason: Max 1000 characters, no SQL injection patterns

**SQL Injection Prevention**
- All database queries SHALL use parameterized queries
- No string concatenation for SQL construction
- ORM or query builder SHALL be used for all database operations

### Audit Logging

**All adjustment operations SHALL be logged**
- User ID, timestamp, operation type, item ID, variance
- Approval/rejection decisions and reasons
- Application and reversal operations
- Permission denials and validation failures
- Error conditions and recovery actions

**Audit logs SHALL be**
- Immutable (no modification or deletion)
- Retained for minimum 1 year
- Accessible only to authorized users
- Encrypted at rest

### Data Encryption

**Sensitive data SHALL be encrypted**
- Adjustment data at rest: AES-256 encryption
- Data in transit: TLS 1.2 or higher
- Audit trail data: AES-256 encryption
- Snapshots: AES-256 encryption

---

## Performance Considerations

### Database Optimization

**Indexes**
- `adjustments(item_id)`: For filtering by item
- `adjustments(status)`: For filtering by status
- `adjustments(created_at DESC)`: For chronological queries
- `adjustments(batch_id)`: For batch queries
- `audit_trail(adjustment_id)`: For audit trail retrieval
- `audit_trail(timestamp DESC)`: For chronological queries
- `stock_movements(item_id)`: For item movement queries
- `stock_movements(created_at DESC)`: For chronological queries
- `inventory_snapshots(item_id, snapshot_date)`: For snapshot retrieval
- `item_locks(expires_at)`: For lock expiration cleanup

**Query Optimization**
- Use pagination for list queries (default 20 items per page)
- Use connection pooling for database connections
- Cache frequently accessed data (adjustment reasons, thresholds)
- Use database views for complex aggregations (reports)

### Caching Strategy

**Cache Layers**
- Application cache: Adjustment reasons, user permissions, configuration thresholds (TTL: 1 hour)
- Database query cache: Frequently accessed adjustments, snapshots (TTL: 5 minutes)
- HTTP cache: Read-only endpoints (audit trail, snapshots) with ETag support

### Batch Processing Optimization

**Batch Application**
- Process adjustments in parallel for different items
- Use database transactions for atomicity
- Implement progress tracking for large batches
- Provide batch status updates to UI

**Performance Targets**
- Adjustment submission: < 2 seconds
- Adjustment application: < 5 seconds
- Batch application (100 items): < 30 seconds
- Audit trail retrieval (1 year): < 3 seconds
- Report generation: < 10 seconds

---

## Implementation Phases

### Phase 1: Core Adjustment Creation and Validation (Weeks 1-2)
- Implement adjustment creation API
- Implement physical count validation
- Implement item existence validation
- Implement adjustment reason validation
- Create adjustment database schema
- Implement unit tests for validation logic

### Phase 2: Approval Workflow (Weeks 3-4)
- Implement approval workflow service
- Implement auto-approval logic
- Implement approval/rejection endpoints
- Implement status transition logic
- Implement permission checking
- Implement approval notifications
- Create integration tests for workflow

### Phase 3: Adjustment Application (Weeks 5-6)
- Implement adjustment application logic
- Implement inventory update
- Implement stock movement creation
- Implement transaction management
- Implement error handling and rollback
- Implement negative inventory prevention
- Create integration tests for application

### Phase 4: Audit Trail and Reporting (Weeks 7-8)
- Implement audit trail recording
- Implement audit trail retrieval
- Implement reconciliation reports
- Implement report filtering and grouping
- Implement report export (CSV, PDF)
- Create integration tests for audit trail

### Phase 5: Advanced Features (Weeks 9-10)
- Implement batch processing
- Implement recount workflow
- Implement reversal adjustments
- Implement inventory snapshots
- Implement item locking
- Implement concurrent modification detection
- Create E2E tests for all workflows

### Phase 6: Integration and Optimization (Weeks 11-12)
- Integrate with existing inventory system
- Integrate with notification system
- Implement caching and optimization
- Performance testing and tuning
- Security review and hardening
- User acceptance testing

---

## Deployment Strategy

### Database Migrations
- Create all tables and indexes in a single migration
- Use database transactions for migration atomicity
- Provide rollback migration for safety

### API Versioning
- Use URL versioning: `/api/v1/adjustments`
- Support multiple API versions during transition
- Deprecate old versions with 6-month notice

### Feature Flags
- Use feature flags for gradual rollout
- Enable for internal testing first
- Gradually enable for user groups
- Monitor error rates and performance

### Monitoring and Alerting
- Monitor API response times
- Monitor error rates and types
- Monitor database performance
- Alert on critical errors
- Alert on permission denials
- Alert on data inconsistencies

---

## Conclusion

This design document provides a comprehensive blueprint for implementing the Stock Count Adjustment feature. The modular architecture, comprehensive error handling, and property-based testing approach ensure data integrity, security, and reliability. The phased implementation strategy enables incremental development and testing, reducing risk and enabling early feedback.

