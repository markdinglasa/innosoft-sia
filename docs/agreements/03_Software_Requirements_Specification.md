# Software Requirements Specification (SRS)

**Project**: Alliance XML Reports and TMS Accreditation  

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

## 5. Data Sources & Environment
- **Primary Source**: Local POS Database (accessed via TypeORM / `SqlChannel`).
- **Database Version**: [TBD - e.g., MS SQL / MySQL / PostgreSQL]
- **DB Schema**: Expected to align with existing TypeORM Entities for Transactions, TransactionLines, Products, Taxes, and Discounts.
- **Expected Data Volume**: ~1,000-5,000 transaction lines per day per terminal.

## 6. Integrations & Security
- **Tenant Management System (TMS)**: The system integrates via file-based exchange (XML format). No direct API or automated SFTP integration is in scope.
- **SEC-001 (Credential Protection)**: The `Tenant ID` and `Tenant Key` provided by the Mall Admin must be stored securely.
- **SEC-002 (Data Integrity)**: The generated XML files must accurately reflect the un-altered transactional data.

## 7. Performance & Audit
- **PERF-001 (Generation Time)**: The generation of all 5 daily XML reports should complete within < 60 seconds.
- **AUD-001 (Logging)**: The system must log the success or failure of each report generation attempt.
- **ACC-002 (Calculation Parity)**: The calculated running totals must mathematically balance according to the exact formulas provided in the TMS guidelines.
