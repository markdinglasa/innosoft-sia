/**
 * Purchase Order Status Enum
 */
export enum PurchaseOrderStatus {
  DRAFT = 'Draft',
  PENDING_APPROVAL = 'Pending_Approval',
  APPROVED = 'Approved',
  SENT = 'Sent',
  CONFIRMED = 'Confirmed',
  PARTIALLY_RECEIVED = 'Partially_Received',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  REJECTED = 'Rejected'
}

/**
 * Purchase Order Line Item Status Enum
 */
export enum LineItemStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PARTIALLY_RECEIVED = 'Partially_Received',
  RECEIVED = 'Received',
  CANCELLED = 'Cancelled'
}

/**
 * Approval Status Enum for PO Workflow
 */
export enum ApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  MODIFICATION_REQUESTED = 'Modification_Requested'
}

/**
 * Receiving Transaction Status
 */
export enum ReceivingStatus {
  PENDING = 'Pending',
  PARTIAL = 'Partial',
  COMPLETE = 'Complete',
  DISCREPANCY = 'Discrepancy'
}
