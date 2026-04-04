# FEAT-UIX-010 — Manager Approval Experience
## Goal

- Provide a safe and fast path for restricted actions.

## Functional Requirements
- Manager PIN modal
- Approval reason capture (configurable)
- Resume original workflow after approval
- Denial-safe rollback to previous UI state

## Acceptance Criteria
- Restricted action opens approval flow instead of silent fail
- Approved action resumes without forcing user to repeat the process
- Denied action preserves cart/session state

## Components
- ManagerApprovalModal
- ApprovalReasonInput
- ApprovalAuditPreview