# Acceptance Criteria & UAT

## 1. Review Period
The Client shall have **5 business days** to review the deliverable against the agreed acceptance criteria upon submission of each milestone. If no feedback is provided within this period, the deliverable will be deemed automatically accepted. 

A project milestone is considered completed when the specific completion criteria are met and **no Severity 1 or Severity 2 defects remain.**

## 2. System Acceptance Criteria
- The system successfully extracts the required data.
- The system generates the 5 specified XML reports (SalesEOD, Online Sales PRE-EOD, Sales Product, Sales Trx, Sales TrxLine).
- The generated XML reports mathematically balance and contain required fields.
- The generated XML reports successfully pass the Mall's TMS validation tool.
- Official written confirmation of TMS Accreditation is received from the Mall Admin.

## 3. Defect Severity Definitions
The presence of minor issues will not block milestone acceptance or payment, provided they do not affect core report generation or TMS validation.

- **Severity 1 (Blocker)**: System unusable / critical functionality unavailable (e.g., XML generation fails entirely). **Blocks Acceptance.**
- **Severity 2 (Major)**: Major functionality unavailable but a workaround exists (e.g., calculations are mathematically incorrect causing TMS rejection). **Blocks Acceptance.**
- **Severity 3 (Minor)**: Minor defect (e.g., an internal application log message is formatted incorrectly, but the XML is fine). **Does NOT Block Acceptance.**
- **Severity 4 (Cosmetic)**: Cosmetic issue (e.g., a small UI alignment issue on the admin dashboard trigger button). **Does NOT Block Acceptance.**
