# REPORTS HUB - USER STORIES

## Key Architectural Decisions
- Direct DB Aggregation: Avoid "Select *" and mapping in Javascript. Use SQL SUM, COUNT, and GROUP BY to return ready-to-render results.
- Stateless IPC: Each report request must be self-contained with its filters (Date Range, Branch ID, etc.), ensuring the Main process can calculate the result deterministically.
- Unified Export Path: The data used for the UI and the CSV/PDF export MUST come from the exact same backend service to prevent discrepancies (e.g., UI showing one total and PDF showing another).

## Potential Risks & Mitigation
- Memory Overflow (Renderer): Fetching thousands of rows into the browser memory. Mitigation: Implement Server-Side Pagination for all list reports. Aggregated summaries should return a single row of totals, while detail reports (like Transaction List) must limit results (e.g., 50 per page).
- Rounding Variances: Discrepancies between the POS screen and the Report Hub. Mitigation: Use a shared CalculationLibrary between the Transaction module and the Report module to ensure rounding logic is identical across the entire system.
- Unauthorized Export: An employee exporting a list of all customers and their contact info. Mitigation: Implement a secondary permission check in the Export Controller in the Main process, separate from the UI visibility check.

## Developer Checklist
- Implement reports.service.ts with separate handlers for Sales, Inventory, and Audit.
- Create a DateRangeValidator to prevent queries with missing or inverted start/end dates.
- Build a generic ReportTable component in the Renderer that supports sorting and pagination.
- Use exceljs or jspdf for robust document generation in the Main process.

```
{
  "epics": [
    {
      "id": "EPIC-REP-001",
      "title": "Centralized Reporting Engine (Main Process)",
      "description": "Develop the backend services and SQL aggregators for financial, inventory, and audit data.",
      "features": ["FEAT-REP-001", "FEAT-REP-002", "FEAT-REP-003"]
    },
    {
      "id": "EPIC-REP-002",
      "title": "Report Hub UX & Filtering",
      "description": "Create the unified report dashboard and the multi-criteria filter system in the renderer.",
      "features": ["FEAT-REP-004", "FEAT-REP-005", "FEAT-REP-007"]
    },
    {
      "id": "EPIC-REP-003",
      "title": "Data Export and Compliance",
      "description": "Implement the PDF/CSV generation engine and enforce permission-based access control.",
      "features": ["FEAT-REP-006"]
    }
  ],
  "features": [
    {
      "id": "FEAT-REP-001",
      "epic_id": "EPIC-REP-001",
      "title": "Financial & Sales Aggregators",
      "description": "Core services for summarizing POS transaction data.",
      "user_stories": [
        {
          "title": "Generate Sales Summary Report",
          "story": "As a manager, I want a summary of sales to see the total gross, taxes, and net income for a specific date range so that I can evaluate branch performance.",
          "acceptance_criteria": [
            "Given a date range and branch filter, When requested, Then the system MUST return the SUM of NetAmount, TaxAmount, and DiscountAmount from only 'POSTED' transactions.",
            "Given a request with no branch filter, When requested, Then the system must aggregate data across all branches authorized for the user.",
            "Given a large transaction history, When aggregated, Then the main process MUST complete the calculation in <500ms for standard monthly ranges.",
            "Given financial calculations (Totals/Taxes), When aggregating, Then the system MUST use the shared 'CalculationLibrary' to ensure 1:1 rounding parity with the POS screen."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": ["Aggregates exclude voided or cancelled transactions unless specifically requested in a 'Void Report'."],
      "open_questions": []
    },
    {
      "id": "FEAT-REP-002",
      "epic_id": "EPIC-REP-001",
      "title": "Inventory movements & reconciliation",
      "description": "Track stock levels and movement history.",
      "user_stories": [
        {
          "title": "View Stock-on-Hand & Low Stock Alerts",
          "story": "As an inventory officer, I want to see current stock levels and receive alerts for items below reorder levels so that I can manage procurement effectively.",
          "acceptance_criteria": [
            "Given an item list, When viewed, Then the system must display the current 'Quantity On Hand' derived from the InventoryLedger balance.",
            "Given an item's stock is <= its 'ReorderLevel', When the report is generated, Then the item must be highlighted as 'LOW STOCK'.",
            "Given a warehouse filter, When selected, Then the inventory levels must only show stock for that specific location."
          ],
          "priority": "High"
        }
      ],
      "assumptions": [],
      "open_questions": []
    },
    {
      "id": "FEAT-REP-003",
      "epic_id": "EPIC-REP-001",
      "title": "Audit & Security Logs",
      "description": "Tracking sensitive user actions and system changes.",
      "user_stories": [
        {
          "title": "Review Void and Override Logs",
          "story": "As an auditor, I want to see a list of every voided transaction and manual price override so that I can detect potential internal theft or error patterns.",
          "acceptance_criteria": [
            "Given a 'Void Report' request, When viewed, Then it must show the original transaction ID, the user who voided it, and the reason provided.",
            "Given an 'Override Report', When viewed, Then it must show the original masterfile price vs the actual sold price with the manager's authorization ID.",
            "Given these reports contain sensitive data, When requested, Then the system MUST verify the 'audit.view' permission before executing the IPC call."
          ],
          "priority": "High"
        }
      ],
      "assumptions": [],
      "open_questions": []
    },
    {
      "id": "FEAT-REP-004",
      "epic_id": "EPIC-REP-002",
      "title": "Universal Report Filter System",
      "description": "Standardized UI for narrowing down report data.",
      "user_stories": [
        {
          "title": "Apply Multi-Criteria Filters",
          "story": "As a user, I want to filter reports by date, branch, terminal, and cashier so that I can drill down into specific areas of the business.",
          "acceptance_criteria": [
            "Given any report, When opened, Then a 'Date Range' filter MUST be required before data is fetched.",
            "Given a list-based report (e.g., Transaction List), When requested, Then the system MUST implement server-side pagination to prevent memory overflow in the renderer.",
            "Given a user with multi-branch access, When filtering by Branch, Then only authorized branches should appear in the dropdown.",
            "Given a filter change, When applied, Then the UI must show a loading state until the new data is received via IPC."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": [],
      "open_questions": []
    },
    {
      "id": "FEAT-REP-006",
      "epic_id": "EPIC-REP-003",
      "title": "PDF & Excel Export Engine",
      "description": "Convert on-screen data into professional documents.",
      "user_stories": [
        {
          "title": "Export Report to PDF/Excel",
          "story": "As a manager, I want to export report data to PDF or Excel so that I can share results with stakeholders or perform further analysis in spreadsheets.",
          "acceptance_criteria": [
            "Given any generated report, When 'Export to PDF' is selected, Then the system must generate a file with professional headers, including the Branch name and current timestamp.",
            "Given an export request, When processing, Then the Main process MUST perform a secondary permission check for the specific report ID before generating the file.",
            "Given an Excel export, When generated, Then numeric values must be properly typed as 'Number' (not strings) to allow for formula calculations.",
            "Given a successful export, When complete, Then the system must prompt the user to open the file or view the saved directory."
          ],
          "priority": "Medium"
        }
      ],
      "assumptions": ["Exports use the same main-process data services as the UI to ensure 1:1 data matching."],
      "open_questions": []
    },
    {
      "id": "FEAT-REP-007",
      "epic_id": "EPIC-REP-002",
      "title": "Dashboard Aggregation Tiles",
      "description": "Provide instant visual summaries upon login.",
      "user_stories": [
        {
          "title": "View Daily Performance Summary",
          "story": "As a business owner, I want to see key metrics on my dashboard so that I can immediately understand today's performance compared to yesterday.",
          "acceptance_criteria": [
            "Given the user enters the Dashboard, When loaded, Then it must display tiles for 'Total Sales Today', 'Transaction Count', and 'Top Selling Category'.",
            "Given a comparison tile, When rendered, Then it must show a percentage increase/decrease compared to the same time period on the previous day.",
            "Given these tiles depend on large datasets, When fetching, Then the main process MUST use pre-aggregated summary tables to ensure <200ms load time."
          ],
          "priority": "High"
        }
      ]
    }
  ]
}

```
