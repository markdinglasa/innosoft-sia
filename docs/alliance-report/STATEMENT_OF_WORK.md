---
Document ID: SOW-ALLIANCE-TMS-001
Document Title: Statement of Work (SOW) - Alliance XML Reports and TMS Accreditation
Version: 1.0.0
Status: DRAFT
Author: Senior Software Documentation Architect
Created: 2026-08-19
Last Updated: 2026-08-19
---

# Statement of Work: Alliance XML Reports and TMS Accreditation

## 1. Project Overview
The objective of this project is to implement, validate, and accredit the **Alliance XML Reports** for integration with the Tenant Management System (TMS) based on the provided TMS guidelines. This Statement of Work (SOW) defines the strict boundaries, deliverables, and requirements of the integration to prevent scope creep, manage expectations, and ensure timely project completion.

## 2. Scope of Work (In-Scope)
The project is strictly limited to the following activities:
1. **Data Extraction**: Extracting existing POS/sales data from the local `SqlChannel` / TypeORM database.
2. **XML Report Generation**: Developing the backend services (`AllianceReportService`) to map, format, and generate the following specific XML files based on the TMS Guidelines (`tms_guidelines.csv`):
   - Sales End of Day (SalesEOD)
   - Online Sales PRE-EOD
   - Sales Product
   - Sales Transaction (Trx)
   - Sales Transaction Line (TrxLine)
3. **File Naming Convention**: Implementing the required filename conventions (e.g., `sales_[tenantid]_[terminal_no]_[zcounter].xml`).
4. **TMS Accreditation Support**: Generating the necessary test data files required to pass the official TMS validation process.
5. **Basic Error Handling**: Implementing standard error logging for when XML generation fails due to missing data.

## 3. Out of Scope (Strictly Excluded)
To protect the project timeline and prevent continuous backlog additions, the following items are **explicitly out of scope**:

**Software & Functionality**
- Modification or replacement of the legacy software.
- Core POS Logic Modifications: Changes to how the POS calculates existing totals, taxes, discounts, or service charges.
- Development of new POS, accounting, or inventory functionality.
- Mobile application development.
- UI/UX Redesign: Building complex new dashboards or frontend interfaces.
- Third-party integrations not explicitly listed in Section 2.
- Additional reports not listed in the SOW, or major changes to report layouts after initial approval.

**Data & Records**
- Migration of historical data or retroactively generating XML reports for historical sales.
- Correction of inaccurate legacy data.
- Data cleansing or manual correction of legacy records.

**Infrastructure, Hardware & Costs**
- Hardware integration, procurement, or configuration.
- Custom network configuration (e.g., setting up VPNs, specialized routers, or resolving mall-side network/firewall issues).
- Infrastructure costs and Cloud hosting costs.
- Accreditation fees, Government/regulatory fees, or any third-party testing fees.

**Post-Submission & Guidelines**
- Post-Accreditation Guideline Changes: Changes required by the accrediting body *after* initial submission or if the Mall Admin releases a new version of the TMS guidelines after development has started.

## 4. Deliverables
- Backend service module capable of generating the specified Alliance XML reports.
- Output XML files conforming exactly to the agreed-upon TMS Guidelines.
- Support during the accreditation phase until the official TMS Accreditation sign-off is achieved.

## 5. Accreditation & Compliance Responsibility
The Developer shall provide reasonable technical assistance and documentation required to support the Client's accreditation application. Final approval, certification, accreditation, or acceptance shall remain the responsibility of the applicable regulatory/accrediting authority and shall not be guaranteed by the Developer.

**Developer Responsibility**
- Implement technical requirements communicated before development.
- Prepare required technical documentation.
- Provide test environment for XML generation.
- Assist during technical evaluation.
- Fix defects attributable to the agreed implementation.
- Provide reasonable assistance responding to technical findings.

**Client Responsibility**
- Provide accurate business requirements.
- Provide legacy-system access and test data.
- Provide existing documentation.
- Coordinate with the accrediting authority.
- Pay accreditation fees.
- Attend accreditation meetings.
- Provide regulatory requirements.
- Obtain business/legal approvals.

## 6. Payment Schedule
Payments for this project are tied to the successful completion and formal sign-off of specific milestones. 

| Milestone | Percentage | Completion Criteria |
| :--- | :--- | :--- |
| **1. Contract Signing** | 20% | Both parties have signed this SOW. |
| **2. Requirements Approval** | 15% | Client formally approves the Requirements Baseline and Architecture, acknowledging the scope is locked. |
| **3. Development Completion** | 30% | All 5 XML reports can be generated locally without syntax errors, ready for the testing environment. |
| **4. UAT Deployment** | 15% | The module is deployed to the Client's Staging/UAT environment and test data is successfully extracted. |
| **5. UAT & Accreditation** | 10% | Mall Admin formally validates the XML files and issues accreditation approval. |
| **6. Production Deployment** | 10% | The module is deployed to the Production environment and is generating live EOD reports. |

*Invoices are strictly due within Net-15 days of milestone completion. Work on subsequent milestones may pause if prior milestone invoices are unresolved.*

## 7. Assumptions & Dependencies
- **Data Availability**: The current database schema already captures all necessary fields required by the TMS (e.g., NRGT, previous taxes, opening/closing times). If database schema changes are required to capture new data, this must be evaluated as a separate task.
- **Tenant Credentials**: The Mall Admin or client will provide the necessary `Tenant ID`, `Tenant Key`, and `Terminal Numbers` promptly.
- **Testing Feedback**: The Mall Admin will provide timely feedback (within 2-3 business days) during the accreditation testing phase.
- **Stable Guidelines**: The TMS guidelines provided (dated 2025-02-06) are considered final for the duration of this SOW.

## 8. Legacy System Dependencies
The Developer's ability to perform the Services is dependent upon the availability, accessibility, reliability, and compatibility of the Client's legacy system and related data sources. 

**The Developer shall not be responsible for delays caused by unavailable systems, inaccurate data, undocumented legacy behavior, infrastructure failures, restricted access, or changes made to the legacy system by the Client or third parties.**

**System Environment Specifications:**
- **Database Version**: [TBD - e.g., MS SQL / MySQL / PostgreSQL]
- **DB Schema**: Expected to align with existing TypeORM Entities for `Transactions`, `TransactionLines`, `Products`, `Taxes`, and `Discounts`.
- **APIs**: No external APIs are expected to be consumed from the legacy system (direct DB query).
- **File Formats**: XML output conforming strictly to the provided TMS `tms_guidelines.csv` (dated 2025-02-06).
- **Access Credentials**: Requires Read-Only DB access, plus local Administrator rights for deploying the generation service.
- **Network/VPN Requirements**: Local network access to the POS database. No specific VPN is required unless the DB is hosted remotely.
- **Test Environment**: A clone or snapshot of the production DB containing at least 1 month of realistic transaction data.
- **Production Environment**: Windows/Linux environment capable of running Node.js/Electron.
- **Data Format**: UTF-8 encoded text for XML payloads.
- **Expected Data Volume**: ~1,000-5,000 transaction lines per day per terminal.

## 9. Intellectual Property & Data Ownership
All business, transactional, customer, employee, financial, and other data supplied by the Client remains the exclusive property of the Client. 

Upon full payment of all milestones defined in Section 6, intellectual property rights shall be distributed as follows:

**Client Owns:**
- Custom application source code specifically written for this integration (after full payment).
- Custom report definitions and specific XML mappings.
- Client-specific documentation.
- All Client Data (at all times).

**Developer Retains:**
- Pre-existing code, generic libraries, and open-source frameworks.
- Reusable, generic architecture components (e.g., standard data extraction utilities).
- Development methodologies and general technical know-how.

## 10. Warranty & Maintenance
**Warranty Period**
The Developer provides a **30-day warranty** commencing immediately after Production Deployment (Milestone 6). During this period, the Developer will fix, at no additional cost, any defects that cause the software to fail to meet the agreed requirements outlined in this SOW and the attached SRS. 

*Note: The warranty does not cover issues caused by changes in the legacy database, infrastructure failures, or external mall network outages.*

**Maintenance & Support (Post-Warranty)**
After the 30-day warranty expires, any further support is provided as a separate paid service. This includes, but is not limited to:
- Bug fixes outside the warranty window.
- New reports or new features.
- Infrastructure monitoring and database maintenance.
- Security updates and general user support.

*Optional Support Package Service Level Agreements (SLAs) can be negotiated separately under a separate contract (e.g., Critical: 4 business hours, High: 1 business day).*

## 11. Change Management Process
Any request that adds to or modifies the Scope of Work (Section 2) will be subject to a formal **Change Request (CR)** process.
- The CR must be documented in writing, detailing the new requirements.
- The development team will estimate the additional time and cost impact.
- **Work on the new request will not commence until the CR is formally approved and signed by all stakeholders.** This includes "small tweaks" requested by the Mall Admin that deviate from the original written guidelines.

**Regulatory & Accreditation Change Clause**
Requirements introduced, modified, or imposed by a regulatory body or accrediting authority (e.g., the Mall Admin) *after* the initial approval of the Requirements Specification shall be treated as a change in scope unless such requirements were expressly included in the original SOW guidelines.

## 12. Acceptance Criteria
The Client shall have **5 business days** to review the deliverable against the agreed acceptance criteria upon submission of each milestone. If no feedback is provided within this period, the deliverable will be deemed automatically accepted. 

A project milestone is considered completed when the specific completion criteria (Section 6) are met and **no Severity 1 or Severity 2 defects remain.**

**System Acceptance Criteria**
- The system successfully extracts the required data.
- The system generates the 5 specified XML reports.
- The generated XML reports mathematically balance and contain required fields.
- The generated XML reports successfully pass the Mall's TMS validation tool.
- Official written confirmation of TMS Accreditation is received from the Mall Admin.

**Defect Severity Definitions**
The presence of minor issues will not block milestone acceptance or payment, provided they do not affect core report generation or TMS validation.
- **Severity 1 (Blocker)**: System unusable / critical functionality unavailable (e.g., XML generation fails entirely). **Blocks Acceptance.**
- **Severity 2 (Major)**: Major functionality unavailable but a workaround exists (e.g., calculations are mathematically incorrect causing TMS rejection). **Blocks Acceptance.**
- **Severity 3 (Minor)**: Minor defect (e.g., an internal application log message is formatted incorrectly, but the XML is fine). **Does NOT Block Acceptance.**
- **Severity 4 (Cosmetic)**: Cosmetic issue (e.g., a small UI alignment issue on the admin dashboard trigger button). **Does NOT Block Acceptance.**

---
**Signatures for Approval**

Client Representative: _______________________ Date: ______________

Technical Lead: ____________________________ Date: ______________

<div style="page-break-after: always;"></div>

# Appendix A — Software Requirements Specification (SRS)

This appendix defines the precise technical and operational baseline for the Alliance XML Reports integration. 

## 1. Functional Requirements
- **FR-001 (Data Extraction)**: The system must extract sales, tax, discount, and product data from the POS database (`SqlChannel`) for a specified business date and terminal.
- **FR-002 (XML Generation)**: The system must generate 5 distinct XML reports (SalesEOD, Online Sales PRE-EOD, Sales Product, Sales Trx, Sales TrxLine) in exact accordance with the TMS Guidelines dated 2025-02-06.
- **FR-003 (Filename Conventions)**: The system must dynamically generate filenames following the required patterns (e.g., `sales_[tenantid]_[terminal_no]_[zcounter].xml`).

## 2. Non-Functional Requirements
- **NFR-001 (Reliability)**: The report generation must handle missing or null data gracefully (e.g., empty string or `0.00` based on TMS rules) rather than crashing.
- **NFR-002 (Maintainability)**: The XML mapping logic must be isolated in a dedicated service (`AllianceReportService`) to separate it from core POS logic.

## 3. User Roles
- **System Administrator (Tenant)**: Responsible for triggering the generation of the EOD reports and handling any manual file transfers required by the mall.
- **Mall Admin / Auditor (TMS)**: The external entity receiving and validating the XML reports.

## 4. Reports
The following specific reports are to be generated:
1. `AllianceSalesEOD`
2. `AllianceOnlineSalesPREEOD`
3. `AllianceSalesProduct`
4. `AllianceSalesTrx`
5. `AllianceSalesTrxLine`

## 5. Data Sources
- **Primary Source**: Local POS Database (accessed via TypeORM / `SqlChannel`).
- **Key Entities**: Transactions, Transaction Lines, Products, Taxes, Discounts, and Z-Counter/Terminal records.

## 6. Integrations
- **Tenant Management System (TMS)**: The system integrates via file-based exchange (XML format). No direct API or automated SFTP integration is in scope unless explicitly mandated by the base guidelines.

## 7. Security Requirements
- **SEC-001 (Credential Protection)**: The `Tenant ID` and `Tenant Key` provided by the Mall Admin must be stored securely as environment variables or encrypted configuration, and never hardcoded.
- **SEC-002 (Data Integrity)**: The generated XML files must accurately reflect the un-altered transactional data from the database. Manual tampering of the generated XML files is prohibited.

## 8. Performance Requirements
- **PERF-001 (Generation Time)**: The generation of all 5 daily XML reports should complete within an acceptable timeframe (e.g., < 60 seconds) to avoid delaying the store's closing/EOD procedures.

## 9. Audit Requirements
- **AUD-001 (Logging)**: The system must log the success or failure of each report generation attempt, including detailed error logs for missing mandatory data (e.g., missing Z-Counter or invalid terminal ID).

## 10. Accreditation Requirements
- **ACC-001 (Format Compliance)**: The XML schema, tags, and data types must strictly pass the Mall Admin's automated XML validator or manual review.
- **ACC-002 (Calculation Parity)**: The calculated running totals (e.g., `nrgt`, `newtax`, `newtaxsale`) must mathematically balance according to the exact formulas provided in the TMS guidelines.

## 11. Acceptance Criteria
- **AC-001**: Given a valid business date and terminal ID, the system outputs the 5 specified XML files into the designated local directory.
- **AC-002**: The generated XML files pass the official TMS validation without any structural, naming, or mathematical errors.
