# Design Document: Manual Disbursement Feature

## Overview

The Manual Disbursement Feature provides a comprehensive form-based interface for creating, managing, and tracking cash disbursements within the POS system. This feature integrates seamlessly with existing transaction modules, masterfile systems, and approval workflows to ensure accurate cash drawer management and complete audit trails.

### Key Design Goals

- **Consistency**: Follow established UI/UX patterns from customer-form.tsx
- **Integration**: Leverage existing masterfile hooks and API patterns
- **Validation**: Implement robust form validation using react-hook-form + zod
- **Performance**: Ensure responsive interactions with efficient data loading
- **Security**: Maintain proper approval workflows and audit trails
- **Usability**: Provide intuitive cash denomination management and error handling

## Architecture

### Component Hierarchy

```
DisbursementHub (Main Container)
├── DisbursementList (Data Grid)
├── DisbursementForm (Modal/Drawer)
│   ├── DisbursementFormHeader
│   ├── DisbursementFormBody
│   │   ├── BasicInfoSection
│   │   ├── AccountingSection
│   │   ├── CashDenominationCalculator
│   │   ├── ApprovalWorkflowSection
│   │   └── RemarksSection
│   └── DisbursementFormFooter
├── DisbursementReceipt (Print Component)
└── DisbursementFormSkeleton (Loading State)
```

### Module Structure

Following the established pattern under `src/renderer/src/POS/features/`:

```
trn-disbursement/
├── components/
│   ├── disbursement-form.tsx
│   ├── disbursement-form-skeleton.tsx
│   ├── disbursement-list.tsx
│   ├── disbursement-receipt.tsx
│   └── cash-denomination-calculator.tsx
├── store/
│   └── use-disbursement-hub-store.ts
├── hooks/
│   └── use-disbursement.ts
├── types/
│   └── disbursement.types.ts
└── index.ts
```

## Components and Interfaces

### 1. DisbursementForm Component

**Purpose**: Main form component for creating/editing disbursements

**Props Interface**:
```typescript
interface DisbursementFormProps {
  selectedDisbursementId: number | null
  onClose: () => void
  onSave?: (disbursement: DisbursementFormData) => void
}
```

**Key Features**:
- Material-UI components with established design system
- React-hook-form with zod validation
- Real-time denomination calculation
- Conditional field rendering based on payment type
- Loading states and error handling

### 2. CashDenominationCalculator Component

**Purpose**: Specialized component for cash breakdown management

**Props Interface**:
```typescript
interface CashDenominationCalculatorProps {
  totalAmount: number
  onDenominationChange: (denominations: CashDenominations) => void
  disabled?: boolean
  error?: string
}

interface CashDenominations {
  amount1000: number
  amount500: number
  amount200: number
  amount100: number
  amount50: number
  amount20: number
  amount10: number
  amount5: number
  amount1: number
  amount025: number
  amount010: number
  amount005: number
  amount001: number
}
```

**Key Features**:
- Auto-calculation of total from denominations
- Validation against target amount
- Visual feedback for mismatches
- Responsive grid layout for denomination inputs

### 3. DisbursementList Component

**Purpose**: Data grid for viewing and managing disbursements

**Key Features**:
- Pagination and search functionality
- Status-based filtering
- Action buttons (Edit, Print Receipt, Delete)
- Integration with masterfile lookup for display names

### 4. DisbursementReceipt Component

**Purpose**: Printable receipt generation

**Key Features**:
- Formatted receipt layout
- Integration with existing POS receipt templates
- Print functionality via electron print API
- Error handling for print failures

## Data Models

### DisbursementFormData Type

```typescript
interface DisbursementFormData {
  // Basic Information
  disbursementDate: Date
  disbursementNumber: string
  disbursementType: DisbursementType
  amount: number
  payee: string
  remarks?: string

  // Accounting
  accountId: number
  payTypeId: number

  // Approval Workflow
  preparedBy: number
  checkedBy: number
  approvedBy: number

  // Cash Denominations (optional)
  amount1000?: number
  amount500?: number
  amount200?: number
  amount100?: number
  amount50?: number
  amount20?: number
  amount10?: number
  amount5?: number
  amount1?: number
  amount025?: number
  amount010?: number
  amount005?: number
  amount001?: number

  // System Fields
  branchId: number
  periodId: number
  terminalId: number
  isReturn: boolean
  stockInId?: number
}

enum DisbursementType {
  PETTY_CASH = 'Petty Cash',
  SUPPLIER_PAYMENT = 'Supplier Payment',
  EMPLOYEE_ADVANCE = 'Employee Advance',
  REFUND = 'Refund',
  OTHER = 'Other'
}
```

### Validation Schema

```typescript
const disbursementSchema = z.object({
  disbursementDate: z.date(),
  disbursementType: z.nativeEnum(DisbursementType),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  payee: z.string().min(1, 'Payee is required').max(255, 'Payee name too long'),
  remarks: z.string().optional(),
  accountId: z.number().min(1, 'Account selection is required'),
  payTypeId: z.number().min(1, 'Payment type is required'),
  preparedBy: z.number().min(1, 'Prepared by is required'),
  checkedBy: z.number().min(1, 'Checked by is required'),
  approvedBy: z.number().min(1, 'Approved by is required'),
  // Cash denominations - conditional validation
  ...cashDenominationSchema
}).refine((data) => {
  // Custom validation for approval workflow
  const users = [data.preparedBy, data.checkedBy, data.approvedBy]
  return new Set(users).size === users.length
}, {
  message: 'Approval users must be different',
  path: ['approvedBy']
})
```

## Data Flow and State Management

### State Management Pattern

Following the established Zustand pattern:

```typescript
interface DisbursementHubState {
  // Form State
  selectedDisbursementId: number | null
  setSelectedDisbursementId: (id: number | null) => void
  isFormOpen: boolean
  setIsFormOpen: (isOpen: boolean) => void
  
  // List State
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
  statusFilter: string[]
  setStatusFilter: (statuses: string[]) => void
  
  // Cash Denomination State
  denominations: CashDenominations
  setDenominations: (denominations: CashDenominations) => void
  denominationTotal: number
  
  // Draft State (for auto-save)
  draftData: Partial<DisbursementFormData> | null
  setDraftData: (data: Partial<DisbursementFormData> | null) => void
}
```

### API Integration Pattern

Using the established masterfile hook pattern:

```typescript
const useDisbursement = () => {
  const { useList, useGet, useSaveMutation, useDeleteMutation, useLookup } = useMasterfile('disbursement')
  
  // Additional disbursement-specific hooks
  const useReceiptPrint = () => {
    return useMutation({
      mutationFn: async (disbursementId: number) => {
        const response = await window.electron.ipc.invoke(IpcChannel.printDisbursementReceipt, {
          disbursementId
        })
        if (!response.success) throw new Error(response.message)
        return response
      }
    })
  }
  
  return {
    useList,
    useGet,
    useSaveMutation,
    useDeleteMutation,
    useLookup,
    useReceiptPrint
  }
}
```

### Data Flow Sequence

1. **Form Initialization**:
   - Load masterfile lookups (accounts, payment types, users)
   - Initialize form with default values or existing data
   - Set up validation schema and error handling

2. **User Input Processing**:
   - Real-time validation with debounced input
   - Auto-calculation of denomination totals
   - Conditional field rendering based on payment type

3. **Form Submission**:
   - Final validation check
   - API call via masterfile hook
   - Success handling (close form, refresh list, print receipt)
   - Error handling (display user-friendly messages)

4. **Receipt Generation**:
   - Format disbursement data for receipt template
   - Trigger print via electron IPC
   - Handle print errors gracefully

## API Integration Design

### IPC Channel Extensions

Following the existing IPC pattern, add disbursement-specific channels:

```typescript
enum IpcChannel {
  // Existing channels...
  printDisbursementReceipt = 'print-disbursement-receipt',
  validateDisbursementNumber = 'validate-disbursement-number',
  getDisbursementSequence = 'get-disbursement-sequence'
}
```

### Backend Service Integration

The frontend will integrate with the existing masterfile service pattern:

```typescript
// Backend service (main process)
class DisbursementService extends BaseMasterfileService<TrnDisbursementEntity> {
  async create(data: CreateDisbursementDto): Promise<TrnDisbursementEntity> {
    // Validate approval workflow
    await this.validateApprovalUsers(data)
    
    // Generate disbursement number
    data.disbursementNumber = await this.generateDisbursementNumber()
    
    // Validate cash denominations if cash payment
    if (data.payTypeId === CASH_PAYMENT_TYPE_ID) {
      this.validateCashDenominations(data)
    }
    
    // Create disbursement with audit trail
    return await this.repository.save(data)
  }
  
  async printReceipt(disbursementId: number): Promise<void> {
    const disbursement = await this.findById(disbursementId)
    const receiptData = await this.formatReceiptData(disbursement)
    await this.printService.printReceipt(receiptData)
  }
}
```

## Validation Schema Design

### Form Validation Strategy

Using zod for comprehensive validation:

```typescript
const createDisbursementValidation = () => {
  const baseSchema = z.object({
    disbursementDate: z.date().max(new Date(), 'Future dates not allowed'),
    disbursementType: z.nativeEnum(DisbursementType),
    amount: z.coerce.number()
      .min(0.01, 'Amount must be greater than 0')
      .max(999999.99, 'Amount exceeds maximum limit'),
    payee: z.string()
      .min(1, 'Payee is required')
      .max(255, 'Payee name too long')
      .regex(/^[a-zA-Z0-9\s\-\.]+$/, 'Invalid characters in payee name'),
    remarks: z.string().max(500, 'Remarks too long').optional(),
    accountId: z.number().min(1, 'Account selection is required'),
    payTypeId: z.number().min(1, 'Payment type is required'),
    preparedBy: z.number().min(1, 'Prepared by is required'),
    checkedBy: z.number().min(1, 'Checked by is required'),
    approvedBy: z.number().min(1, 'Approved by is required')
  })

  // Conditional cash denomination validation
  const cashDenominationSchema = z.object({
    amount1000: z.coerce.number().min(0).optional(),
    amount500: z.coerce.number().min(0).optional(),
    amount200: z.coerce.number().min(0).optional(),
    amount100: z.coerce.number().min(0).optional(),
    amount50: z.coerce.number().min(0).optional(),
    amount20: z.coerce.number().min(0).optional(),
    amount10: z.coerce.number().min(0).optional(),
    amount5: z.coerce.number().min(0).optional(),
    amount1: z.coerce.number().min(0).optional(),
    amount025: z.coerce.number().min(0).optional(),
    amount010: z.coerce.number().min(0).optional(),
    amount005: z.coerce.number().min(0).optional(),
    amount001: z.coerce.number().min(0).optional()
  })

  return baseSchema.merge(cashDenominationSchema).refine((data) => {
    // Validate unique approval users
    const users = [data.preparedBy, data.checkedBy, data.approvedBy]
    return new Set(users).size === users.length
  }, {
    message: 'All approval users must be different',
    path: ['approvedBy']
  }).refine((data) => {
    // Validate cash denominations total (if cash payment type)
    if (data.payTypeId === CASH_PAYMENT_TYPE_ID) {
      const denominationTotal = calculateDenominationTotal(data)
      return Math.abs(denominationTotal - data.amount) < 0.01
    }
    return true
  }, {
    message: 'Cash denomination total must match disbursement amount',
    path: ['amount']
  })
}
```

### Real-time Validation

Implement debounced validation for better UX:

```typescript
const useDebouncedValidation = (value: any, validationFn: (val: any) => boolean, delay = 300) => {
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const result = validationFn(value)
        setIsValid(result)
        setError(null)
      } catch (err) {
        setIsValid(false)
        setError(err.message)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [value, validationFn, delay])

  return { isValid, error }
}
```

## UI/UX Design Specifications

### Design System Compliance

Following the established Material-UI design system:

**Color Palette**:
- Primary: #14263E (Dark blue for headers, primary actions)
- Secondary: #f1f6fa (Light blue-gray for backgrounds)
- Tertiary: #4f5e6b (Medium gray for secondary text)
- Success: #28a745 (Green for success states)
- Warning: #ffc107 (Yellow for warnings)
- Error: #dc3545 (Red for errors)

**Typography**:
- Headers: Material-UI Typography variant="h6"
- Body text: Material-UI Typography variant="body1"
- Helper text: Material-UI Typography variant="caption"

### Form Layout Design

Following the customer-form.tsx pattern:

```typescript
// Header Section
<Box sx={{
  p: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bgcolor: 'primary.dark',
  color: 'white'
}}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <PaymentIcon sx={{ fontSize: 25 }} />
    <Typography variant="h6">
      {selectedDisbursementId ? 'Edit Disbursement' : 'New Disbursement'}
    </Typography>
  </Box>
  <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
    <CloseIcon sx={{ fontSize: 25 }} />
  </IconButton>
</Box>

// Form Body with Grid Layout
<Grid container spacing={2}>
  <Grid item xs={6}>
    <TextField
      label="Disbursement Date"
      type="date"
      fullWidth
      size="small"
      InputLabelProps={{ shrink: true }}
    />
  </Grid>
  <Grid item xs={6}>
    <TextField
      label="Disbursement Number"
      fullWidth
      size="small"
      disabled
      value={generatedNumber}
    />
  </Grid>
  // ... additional form fields
</Grid>
```

### Cash Denomination Calculator Design

Specialized component with responsive grid:

```typescript
<Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
  <Typography variant="subtitle2" gutterBottom>
    Cash Denomination Breakdown
  </Typography>
  <Grid container spacing={1}>
    {DENOMINATIONS.map(({ value, label }) => (
      <Grid item xs={6} sm={4} md={3} key={value}>
        <TextField
          label={label}
          type="number"
          size="small"
          fullWidth
          inputProps={{ min: 0, step: value < 1 ? 0.01 : 1 }}
          onChange={(e) => handleDenominationChange(value, e.target.value)}
        />
      </Grid>
    ))}
  </Grid>
  <Box sx={{ mt: 2, p: 1, bgcolor: 'secondary.main', borderRadius: 1 }}>
    <Typography variant="body2">
      Total: ₱{denominationTotal.toFixed(2)}
      {Math.abs(denominationTotal - targetAmount) > 0.01 && (
        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
          (Difference: ₱{(denominationTotal - targetAmount).toFixed(2)})
        </Typography>
      )}
    </Typography>
  </Box>
</Box>
```

### Loading States and Skeletons

Following the established skeleton pattern:

```typescript
const DisbursementFormSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={2}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid item xs={6} key={index}>
          <Skeleton variant="rectangular" height={40} />
        </Grid>
      ))}
    </Grid>
  </Box>
)
```

### Error Handling UI

Consistent error display patterns:

```typescript
// Field-level errors
<TextField
  error={!!errors.payee}
  helperText={errors.payee?.message}
  // ... other props
/>

// Form-level errors
{saveMutation.isError && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {saveMutation.error?.message || 'Failed to save disbursement.'}
  </Alert>
)}

// Success feedback
{saveMutation.isSuccess && (
  <Alert severity="success" sx={{ mb: 2 }}>
    Disbursement saved successfully!
  </Alert>
)}
```

## Integration Points with Existing Systems

### 1. Masterfile System Integration

**Chart of Accounts**: 
- Use existing `useLookup('account')` hook
- Filter accounts appropriate for disbursements
- Display account code and name in dropdown

**Payment Types**:
- Use existing `useLookup('payType')` hook  
- Filter to disbursement-appropriate payment types
- Conditional logic for cash vs non-cash types

**User Management**:
- Use existing `useLookup('user')` hook
- Filter active users for approval workflow
- Validate user permissions for approval roles

### 2. Session and Terminal Integration

**Current Session Binding**:
```typescript
const useSessionContext = () => {
  const [sessionInfo, setSessionInfo] = useState(null)
  
  useEffect(() => {
    const getSessionInfo = async () => {
      const response = await window.electron.ipc.invoke(IpcChannel.getCurrentSession)
      setSessionInfo(response.data)
    }
    getSessionInfo()
  }, [])
  
  return sessionInfo
}
```

**Terminal Information**:
- Auto-populate terminal ID from current session
- Validate terminal permissions for disbursement creation
- Include terminal info in audit trail

### 3. Period Management Integration

**Active Period Validation**:
```typescript
const validateActivePeriod = async (disbursementDate: Date) => {
  const response = await window.electron.ipc.invoke(IpcChannel.validatePeriod, {
    date: disbursementDate
  })
  if (!response.success) {
    throw new Error('Disbursement date is not within active accounting period')
  }
  return response.data.periodId
}
```

### 4. Audit Trail Integration

**Change Tracking**:
- Integrate with existing audit logging system
- Track all form changes before approval
- Maintain immutable records after approval
- Log user actions and timestamps

### 5. Receipt Printing Integration

**Print Service Integration**:
```typescript
const printDisbursementReceipt = async (disbursementData: DisbursementFormData) => {
  const receiptTemplate = {
    header: {
      title: 'DISBURSEMENT RECEIPT',
      companyName: await getCompanyInfo(),
      address: await getCompanyAddress(),
      date: new Date().toLocaleDateString()
    },
    body: {
      disbursementNumber: disbursementData.disbursementNumber,
      date: disbursementData.disbursementDate,
      amount: disbursementData.amount,
      payee: disbursementData.payee,
      purpose: disbursementData.remarks,
      account: await getAccountName(disbursementData.accountId)
    },
    footer: {
      preparedBy: await getUserName(disbursementData.preparedBy),
      checkedBy: await getUserName(disbursementData.checkedBy),
      approvedBy: await getUserName(disbursementData.approvedBy)
    }
  }
  
  await window.electron.ipc.invoke(IpcChannel.printReceipt, receiptTemplate)
}
```

## Error Handling

### Error Classification and Handling Strategy

**1. Validation Errors**:
- Field-level validation with immediate feedback
- Form-level validation on submission
- Clear, actionable error messages
- Visual highlighting of invalid fields

**2. API Errors**:
- Network connectivity issues
- Server validation failures
- Permission/authorization errors
- Graceful degradation with retry options

**3. Business Logic Errors**:
- Approval workflow violations
- Cash denomination mismatches
- Period validation failures
- Duplicate disbursement numbers

**4. System Errors**:
- Print service failures
- Session timeout issues
- Database connectivity problems
- Fallback mechanisms and user guidance

### Error Recovery Mechanisms

**Auto-save Draft Data**:
```typescript
const useAutoSave = (formData: Partial<DisbursementFormData>) => {
  const { setDraftData } = useDisbursementHubStore()
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        setDraftData(formData)
        localStorage.setItem('disbursement-draft', JSON.stringify(formData))
      }
    }, 2000) // Auto-save after 2 seconds of inactivity
    
    return () => clearTimeout(timer)
  }, [formData, setDraftData])
}
```

**Recovery on Form Load**:
```typescript
const recoverDraftData = () => {
  const draftData = localStorage.getItem('disbursement-draft')
  if (draftData) {
    const parsed = JSON.parse(draftData)
    // Show recovery dialog
    return parsed
  }
  return null
}
```

## Testing Strategy

The Manual Disbursement Feature requires comprehensive testing across multiple layers to ensure reliability, security, and user experience quality.

### Unit Testing Strategy

**Component Testing**:
- Form validation logic with various input scenarios
- Cash denomination calculation accuracy
- Conditional rendering based on payment types
- Error state handling and display
- Loading state management

**Hook Testing**:
- Masterfile integration hooks
- Form state management
- Auto-save functionality
- Session context handling

**Utility Function Testing**:
- Denomination calculation functions
- Number formatting and validation
- Date handling and period validation
- Receipt formatting logic

### Integration Testing Strategy

**API Integration Tests**:
- Disbursement CRUD operations via masterfile hooks
- Lookup data fetching (accounts, payment types, users)
- Receipt printing service integration
- Session and terminal validation
- Period management integration

**Form Integration Tests**:
- End-to-end form submission workflows
- Approval workflow validation
- Cash denomination validation with different payment types
- Error handling across different failure scenarios
- Auto-save and recovery mechanisms

### End-to-End Testing Strategy

**Critical User Flows**:
1. **Complete Disbursement Creation Flow**:
   - Open new disbursement form
   - Fill all required fields
   - Calculate cash denominations
   - Submit with proper approvals
   - Print receipt successfully

2. **Cash Disbursement with Denomination Validation**:
   - Select cash payment type
   - Enter denomination breakdown
   - Validate total matches amount
   - Handle denomination mismatch errors
   - Complete successful submission

3. **Approval Workflow Validation**:
   - Attempt to use same user for multiple approval roles
   - Validate permission-based approval restrictions
   - Test approval workflow completion
   - Verify audit trail creation

4. **Error Recovery Scenarios**:
   - Network failure during submission
   - Print service failure handling
   - Session timeout recovery
   - Draft data recovery on form reload

### Property-Based Testing Applicability Assessment

The Manual Disbursement Feature involves significant UI interactions, external service integrations, and business workflow validations. Most requirements focus on specific user interactions, approval workflows, and integration points rather than universal mathematical properties.

**Assessment Result**: Property-based testing is **NOT appropriate** for this feature because:

1. **UI-Heavy Feature**: Most functionality involves form interactions, validation displays, and user workflow management
2. **Integration-Focused**: Heavy reliance on external services (printing, session management, masterfile lookups)
3. **Business Workflow**: Approval processes and audit trails are specific business rules rather than universal properties
4. **Configuration-Dependent**: Behavior varies based on payment types, user permissions, and system configuration

**Alternative Testing Approach**:
- **Snapshot Tests**: For form layouts and receipt templates
- **Mock-Based Unit Tests**: For API integrations and service calls
- **Example-Based Tests**: For specific validation scenarios and business rules
- **Integration Tests**: For end-to-end workflows with real service interactions

### Test Configuration and Coverage Requirements

**Minimum Coverage Target**: 80%

**Test Framework Setup**:
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + MSW (Mock Service Worker)
- **E2E Tests**: Playwright for critical user flows

**Test Organization**:
```
src/renderer/src/POS/features/trn-disbursement/
├── __tests__/
│   ├── components/
│   │   ├── disbursement-form.test.tsx
│   │   ├── cash-denomination-calculator.test.tsx
│   │   └── disbursement-receipt.test.tsx
│   ├── hooks/
│   │   └── use-disbursement.test.ts
│   ├── utils/
│   │   └── denomination-calculator.test.ts
│   └── integration/
│       └── disbursement-workflow.test.tsx
└── __e2e__/
    └── disbursement-creation.spec.ts
```

**Key Test Scenarios**:

1. **Form Validation Tests**:
   - Required field validation
   - Format validation (payee name, amounts)
   - Business rule validation (unique approval users)
   - Cash denomination total validation

2. **Component Behavior Tests**:
   - Conditional field rendering
   - Loading state management
   - Error state display
   - Success feedback handling

3. **Integration Tests**:
   - Masterfile hook interactions
   - API error handling
   - Session context integration
   - Print service integration

4. **E2E Workflow Tests**:
   - Complete disbursement creation
   - Error recovery scenarios
   - Multi-user approval workflows
   - Receipt generation and printing

This comprehensive testing strategy ensures the Manual Disbursement Feature meets all functional requirements while maintaining high code quality and user experience standards.