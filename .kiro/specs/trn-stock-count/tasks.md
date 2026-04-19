# Implementation Plan: Stock Count Adjustment Feature

## Overview

This implementation plan breaks down the Stock Count Adjustment feature into discrete, incremental coding tasks. Each task builds on previous steps, ensuring no orphaned code and proper integration. The feature implements a comprehensive inventory reconciliation system with approval workflows, audit trails, batch processing, and data integrity guarantees.

## Tasks

- [ ] 1. Set up project structure and core types
  - Create directory structure under `src/modules/stock-adjustment/`
  - Define core TypeScript interfaces and types for adjustments, audit trails, stock movements, and snapshots
  - Set up testing framework with Vitest and fast-check for property-based testing
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [ ] 2. Implement database schema and migrations
  - [ ] 2.1 Create PostgreSQL database schema for adjustments table
    - Implement UUID primary key, foreign key constraints, status enum, and validation constraints
    - Create indexes for performance optimization
    - _Requirements: 18.1, 18.2, 18.4, 18.6_
  
  - [ ] 2.2 Create audit trail table schema
    - Implement immutable audit trail with JSONB event details
    - Create indexes for chronological queries and adjustment lookups
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.7, 6.8_
  
  - [ ] 2.3 Create stock movements and inventory snapshots tables
    - Implement stock movements with adjustment references
    - Implement inventory snapshots for historical tracking
    - _Requirements: 7.1, 7.2, 13.1, 13.4_
  
  - [ ]* 2.4 Write property test for database schema constraints
    - **Property 1: Variance Calculation Correctness**
    - **Validates: Requirements 1.3, 2.1, 2.2, 2.3, 2.4, 2.5**

- [ ] 3. Implement core adjustment creation and validation
  - [ ] 3.1 Create adjustment service with validation logic
    - Implement physical count validation (non-negative integers)
    - Implement item existence validation
    - Implement adjustment reason validation with custom reason requirement
    - _Requirements: 1.4, 1.5, 1.6, 1.7, 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ] 3.2 Implement variance calculation service
    - Calculate variance as (physical_count - system_inventory)
    - Calculate variance percentage with edge case for zero inventory
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 3.3 Write property test for physical count validation
    - **Property 2: Physical Count Validation**
    - **Validates: Requirements 1.4, 1.5, 3.3**
  
  - [ ]* 3.4 Write property test for adjustment reason validation
    - **Property 3: Adjustment Reason Validation**
    - **Validates: Requirements 1.6, 1.7, 3.4**
  
  - [ ]* 3.5 Write property test for variance calculation
    - **Property 1: Variance Calculation Correctness**
    - **Validates: Requirements 1.3, 2.1, 2.2, 2.3, 2.4, 2.5**

- [ ] 4. Checkpoint - Core validation and calculation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement approval workflow service
  - [ ] 5.1 Create status transition state machine
    - Implement valid status transitions (Draft → Submitted → Pending_Approval → Approved/Rejected → Applied)
    - Implement cancellation logic for Draft and Pending_Approval status
    - _Requirements: 4.1, 4.2, 4.5, 4.6, 15.1, 15.2, 15.3_
  
  - [ ] 5.2 Implement auto-approval logic
    - Auto-approve adjustments below configurable thresholds (default: 5 units or 2%)
    - Flag high-variance adjustments for manual approval
    - _Requirements: 4.7, 2.6_
  
  - [ ] 5.3 Implement permission checking service
    - Check Create_Adjustment, Approve_Adjustment, Apply_Adjustment permissions
    - Prevent self-approval (creator cannot approve own adjustments)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.7_
  
  - [ ]* 5.4 Write property test for status transitions
    - **Property 7: Status Transition Correctness**
    - **Validates: Requirements 4.1, 4.2, 4.5, 4.6, 5.2, 15.3**
  
  - [ ]* 5.5 Write property test for auto-approval logic
    - **Property 8: Auto-Approval Logic**
    - **Validates: Requirements 4.7**
  
  - [ ]* 5.6 Write property test for self-approval prevention
    - **Property 9: Self-Approval Prevention**
    - **Validates: Requirements 9.7**

- [ ] 6. Implement audit trail service
  - [ ] 6.1 Create immutable audit trail recording
    - Record all adjustment events (Created, Submitted, Approved, Rejected, Applied, Cancelled)
    - Store event details, user ID, timestamp, and IP/user agent
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.8_
  
  - [ ] 6.2 Implement audit trail retrieval
    - Retrieve audit trail in chronological order
    - Support filtering by adjustment ID and event type
    - _Requirements: 6.5, 7.3_
  
  - [ ]* 6.3 Write property test for audit trail immutability
    - **Property 13: Audit Trail Immutability**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.7, 6.8**
  
  - [ ]* 6.4 Write property test for audit trail ordering
    - **Property 14: Audit Trail Ordering**
    - **Validates: Requirements 6.5, 7.3**

- [ ] 7. Checkpoint - Approval workflow and audit trail
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement adjustment application and inventory integration
  - [ ] 8.1 Create inventory update service
    - Update inventory quantities to match physical counts
    - Prevent negative inventory results
    - Verify final inventory matches adjustment physical count
    - _Requirements: 5.1, 5.6, 5.7, 18.4_
  
  - [ ] 8.2 Implement stock movement creation
    - Create Stock_Movement records for applied adjustments
    - Record quantity change, adjustment reason, and metadata
    - _Requirements: 5.4, 7.1, 7.2_
  
  - [ ] 8.3 Implement transaction atomicity
    - Use database transactions for atomic operations
    - Rollback all changes on any failure
    - Ensure no partial updates are applied
    - _Requirements: 5.5, 8.1, 8.6, 18.1, 18.2_
  
  - [ ]* 8.4 Write property test for inventory update correctness
    - **Property 10: Inventory Update Correctness**
    - **Validates: Requirements 5.1, 5.6, 5.7, 18.4**
  
  - [ ]* 8.5 Write property test for negative inventory prevention
    - **Property 11: Negative Inventory Prevention**
    - **Validates: Requirements 5.6, 5.7**
  
  - [ ]* 8.6 Write property test for stock movement creation
    - **Property 12: Stock Movement Creation**
    - **Validates: Requirements 5.4, 7.1, 7.2**
  
  - [ ]* 8.7 Write property test for transaction atomicity
    - **Property 17: Transaction Atomicity**
    - **Validates: Requirements 5.5, 8.1, 8.6, 18.1, 18.2**

- [ ] 9. Implement item locking and concurrent modification detection
  - [ ] 9.1 Create item locking service
    - Lock items during adjustment creation
    - Release locks on application or cancellation
    - Implement lock expiration (default 30 minutes)
    - _Requirements: 14.1, 14.3, 14.5_
  
  - [ ] 9.2 Implement concurrent modification detection
    - Detect when item inventory changes during adjustment workflow
    - Prevent application of stale adjustments
    - Require user review and resubmission
    - _Requirements: 3.7, 8.3, 16.4, 16.6_
  
  - [ ]* 9.3 Write property test for item locking
    - **Property 26: Item Locking**
    - **Validates: Requirements 14.1, 14.3**
  
  - [ ]* 9.4 Write property test for lock conflict detection
    - **Property 27: Lock Conflict Detection**
    - **Validates: Requirements 14.4**
  
  - [ ]* 9.5 Write property test for lock expiration
    - **Property 28: Lock Expiration**
    - **Validates: Requirements 14.5**
  
  - [ ]* 9.6 Write property test for concurrent modification detection
    - **Property 6: Concurrent Modification Detection**
    - **Validates: Requirements 3.7, 8.3, 16.4, 16.6**

- [ ] 10. Checkpoint - Core adjustment functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement batch processing
  - [ ] 11.1 Create batch adjustment service
    - Create batches with multiple items
    - Validate all items in batch
    - Assign batch ID to all adjustments
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ] 11.2 Implement atomic batch application
    - Apply all adjustments in batch atomically
    - Rollback entire batch on any failure
    - Track batch status and progress
    - _Requirements: 10.7_
  
  - [ ]* 11.3 Write property test for batch expansion
    - **Property 18: Batch Expansion**
    - **Validates: Requirements 10.3, 10.4**
  
  - [ ]* 11.4 Write property test for batch atomic application
    - **Property 19: Batch Atomic Application**
    - **Validates: Requirements 10.7**
  
  - [ ]* 11.5 Write property test for batch readiness
    - **Property 20: Batch Readiness**
    - **Validates: Requirements 10.6**

- [ ] 12. Implement recount workflow
  - [ ] 12.1 Create recount request service
    - Flag adjustments for recount when variance exceeds threshold
    - Prevent application until recount completed
    - _Requirements: 12.1, 12.2_
  
  - [ ] 12.2 Implement recount completion logic
    - Update physical count with new recount value
    - Recalculate variance based on new count
    - Record recount details in audit trail
    - _Requirements: 12.3, 12.4, 12.5_
  
  - [ ]* 12.3 Write property test for recount blocking
    - **Property 21: Recount Blocking**
    - **Validates: Requirements 12.2**
  
  - [ ]* 12.4 Write property test for recount variance recalculation
    - **Property 22: Recount Variance Recalculation**
    - **Validates: Requirements 12.4, 12.5**
  
  - [ ]* 12.5 Write property test for recount approval logic
    - **Property 23: Recount Approval Logic**
    - **Validates: Requirements 12.6**

- [ ] 13. Implement inventory snapshots
  - [ ] 13.1 Create snapshot service
    - Create inventory snapshots on adjustment application
    - Store snapshot date, time, and all item quantities
    - _Requirements: 13.1_
  
  - [ ] 13.2 Implement snapshot retrieval and comparison
    - Retrieve inventory state for specific dates
    - Compare snapshots to show quantity changes
    - _Requirements: 13.2, 13.3_
  
  - [ ]* 13.3 Write property test for inventory snapshot creation
    - **Property 24: Inventory Snapshot Creation**
    - **Validates: Requirements 13.1**
  
  - [ ]* 13.4 Write property test for snapshot retrieval
    - **Property 25: Snapshot Retrieval**
    - **Validates: Requirements 13.2, 13.3**

- [ ] 14. Checkpoint - Advanced features
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement adjustment reversal
  - [ ] 15.1 Create reversal adjustment service
    - Create new adjustment with opposite variance
    - Link to original adjustment
    - Require reversal reason
    - _Requirements: 19.1, 19.2, 19.3_
  
  - [ ] 15.2 Implement reversal application logic
    - Restore inventory to pre-original adjustment state
    - Record both original and reversal in audit trail
    - _Requirements: 19.4, 19.5_
  
  - [ ]* 15.3 Write property test for reversal adjustment creation
    - **Property 31: Reversal Adjustment Creation**
    - **Validates: Requirements 19.1, 19.2, 19.3**
  
  - [ ]* 15.4 Write property test for reversal application
    - **Property 32: Reversal Application**
    - **Validates: Requirements 19.4, 19.5**
  
  - [ ]* 15.5 Write property test for reversal display
    - **Property 33: Reversal Display**
    - **Validates: Requirements 19.6**

- [ ] 16. Implement reporting and analytics
  - [ ] 16.1 Create reconciliation report service
    - Calculate total adjustments, quantity adjusted, average variance
    - Group adjustments by reason and user
    - Support filtering by date range, item category, reason
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [ ] 16.2 Implement stock movement filtering and running balance
    - Filter movements by type (Sales, Receipts, Adjustments, All)
    - Calculate running inventory balance after each movement
    - _Requirements: 7.4, 7.5_
  
  - [ ]* 16.3 Write property test for report aggregation
    - **Property 35: Report Aggregation**
    - **Validates: Requirements 11.1, 11.2, 11.3**
  
  - [ ]* 16.4 Write property test for report grouping
    - **Property 36: Report Grouping**
    - **Validates: Requirements 11.4, 11.5**
  
  - [ ]* 16.5 Write property test for report filtering
    - **Property 37: Report Filtering**
    - **Validates: Requirements 11.6, 17.3**
  
  - [ ]* 16.6 Write property test for stock movement filtering
    - **Property 15: Stock Movement Filtering**
    - **Validates: Requirements 7.4**
  
  - [ ]* 16.7 Write property test for running balance calculation
    - **Property 16: Running Balance Calculation**
    - **Validates: Requirements 7.5**

- [ ] 17. Implement API layer and error handling
  - [ ] 17.1 Create REST API endpoints
    - Implement adjustment CRUD operations (create, submit, approve, reject, apply, cancel)
    - Implement batch endpoints (create, apply)
    - Implement audit trail and report endpoints
    - _Requirements: 17.1, 17.2, 17.4, 17.5, 17.6_
  
  - [ ] 17.2 Implement comprehensive error handling
    - Validation errors with clear messages
    - Permission denied errors
    - Concurrent modification errors
    - Transaction errors with automatic retry
    - _Requirements: 8.1, 8.2, 8.4, 8.5_
  
  - [ ] 17.3 Implement input validation and sanitization
    - Validate all user inputs at API boundaries
    - Prevent SQL injection with parameterized queries
    - Sanitize custom reason fields
    - _Requirements: 3.5, 3.6, 18.5_
  
  - [ ]* 17.4 Write property test for error logging
    - **Property 39: Error Logging**
    - **Validates: Requirements 8.4**

- [ ] 18. Checkpoint - API and error handling
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Implement notification system integration
  - [ ] 19.1 Create notification service
    - Send notifications for submission, approval, rejection, application
    - Send high-variance alerts to supervisors
    - Send lock expiration notifications
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_
  
  - [ ] 19.2 Support multiple notification channels
    - In-app notifications
    - Email notifications
    - SMS notifications (configurable)
    - _Requirements: 20.7_

- [ ] 20. Implement user interface components
  - [ ] 20.1 Create adjustment dashboard
    - Display pending adjustments, recent adjustments, summary statistics
    - Support search and filtering by item, status, date range, user
    - _Requirements: 17.1, 17.2, 17.3_
  
  - [ ] 20.2 Create adjustment creation form
    - Form with clear field labels and validation messages
    - Real-time variance calculation display
    - Adjustment reason selection with custom reason field
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7, 17.5_
  
  - [ ] 20.3 Create approval workflow interface
    - Display adjustment details for review
    - Approval/rejection with reason input
    - Confirmation dialogs with adjustment details
    - _Requirements: 4.4, 17.6_
  
  - [ ] 20.4 Create audit trail viewer
    - Display audit trail in chronological order
    - Show complete event details with timestamps and users
    - _Requirements: 6.5, 17.4_
  
  - [ ] 20.5 Create batch processing interface
    - Create batches with multiple items
    - View batch details and individual adjustment statuses
    - Apply entire batch with single action
    - _Requirements: 10.1, 10.5, 10.6_

- [ ] 21. Final checkpoint - Integration and testing
  - [ ] 21.1 Run comprehensive test suite
    - Execute all unit tests, property tests, integration tests
    - Verify 80%+ test coverage
    - Fix any failing tests
    - _Requirements: Success Criteria 10_
  
  - [ ] 21.2 Perform integration testing
    - Test end-to-end adjustment workflow
    - Test batch processing with multiple items
    - Test error scenarios and recovery
    - _Requirements: Success Criteria 1, 2, 4_
  
  - [ ] 21.3 Verify data integrity and consistency
    - Verify audit trail immutability
    - Verify transaction atomicity
    - Verify inventory consistency after adjustments
    - _Requirements: Success Criteria 3, 4_
  
  - [ ] 21.4 Performance and security validation
    - Verify performance requirements (response times under load)
    - Verify security requirements (RBAC, input validation, encryption)
    - _Requirements: Success Criteria 5, 6_

- [ ] 22. Documentation and deployment preparation
  - [ ] 22.1 Create API documentation
    - Document all endpoints with request/response examples
    - Include error codes and scenarios
    - _Requirements: Non-functional requirements_
  
  - [ ] 22.2 Create user documentation
    - User guides for adjustment creation, approval, application
    - Troubleshooting guides for common issues
    - _Requirements: Success Criteria 7, 8_
  
  - [ ] 22.3 Prepare deployment artifacts
    - Database migration scripts
    - Configuration files with default values
    - Feature flags for gradual rollout
    - _Requirements: Non-functional requirements_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- All code must follow TypeScript best practices with strict typing
- Security requirements must be implemented throughout (RBAC, input validation, encryption)
- Performance targets must be met (adjustment submission < 2s, application < 5s)
- Test coverage must exceed 80% for all adjustment operations

## Implementation Guidelines

1. **Incremental Development**: Each task builds on previous steps. Complete tasks in order.
2. **Test-Driven Development**: Write tests first, then implementation, then refactor.
3. **Property-Based Testing**: Use fast-check library for property tests with minimum 100 iterations.
4. **Database Transactions**: Use transactions for all write operations to ensure atomicity.
5. **Error Handling**: Provide clear error messages and automatic retry for transient errors.
6. **Security**: Implement RBAC, input validation, and encryption as specified.
7. **Performance**: Use indexes, caching, and connection pooling as specified in design.
8. **Code Quality**: Follow existing project patterns and coding standards.

## Success Metrics

- All 39 correctness properties from design document implemented and tested
- All 20 requirements with 80+ acceptance criteria implemented
- 80%+ test coverage across all adjustment operations
- Performance targets met under normal and peak load
- Security requirements fully implemented and validated
- Seamless integration with existing inventory system