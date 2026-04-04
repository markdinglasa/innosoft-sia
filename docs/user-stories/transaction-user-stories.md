# TRASNACTIONAL - USER STORIES

## Potential Risks & Mitigation
- Rounding Drift: Accumulating .01 variances over thousands of sales. Mitigation: Use a consistent rounding strategy (e.g., Round Half to Even) and store intermediate calculations with 4 decimal places before final rounding.
- Race Conditions on Stock: Two terminals selling the last item simultaneously. Mitigation: Implement "Pessimistic Locking" or a "Check-and-Deduct" step within the atomic DB transaction in the Main process.
- Negative Stock: System allowing sales when stock is 0. Mitigation: Add a setting AllowNegativeStock per branch; if false, the Commit engine must reject the transaction if stock becomes negative.

## Developer Checklist
- Implement TrxEngine as a singleton in the Renderer.
- Ensure InventoryLedger is updated last in the commit chain but within the same transaction.
- Build a PrintFormatter that converts the TrxOrder object into an ESC/POS command stream.
- Implement manager-only IPC channels for sensitive actions like Void and PriceOverride.

```
{
  "epics": [
    {
      "id": "EPIC-TRX-001",
      "title": "Core POS Order Engine",
      "description": "The heart of the POS: handles real-time item scanning, pricing, and tax calculation in-memory.",
      "features": ["FEAT-TRX-001", "FEAT-TRX-002", "FEAT-TRX-003"]
    },
    {
      "id": "EPIC-TRX-002",
      "title": "Atomic Checkout & Inventory Sync",
      "description": "Securely commit transactions to the database, update stock levels, and generate receipts.",
      "features": ["FEAT-TRX-004", "FEAT-TRX-005"]
    },
    {
      "id": "EPIC-TRX-003",
      "title": "Operational Management (Recommended)",
      "description": "Handle suspended sales, cash drawer operations, and transaction reversals.",
      "features": ["FEAT-TRX-006", "FEAT-TRX-007", "FEAT-TRX-008"]
    },
    {
      "id": "EPIC-TRX-004",
      "title": "Accounting & General Ledger Integration",
      "description": "Automate the creation of accounting entries for all business transactions.",
      "features": ["FEAT-TRX-009"]
    }
  ],
  "features": [
    {
      "id": "FEAT-TRX-001",
      "epic_id": "EPIC-TRX-001",
      "title": "In-Memory Order Management",
      "description": "High-performance order state in the renderer for instant scanning/feedback.",
      "user_stories": [
        {
          "title": "Scan/Add Items to Order",
          "story": "As a cashier, I want to scan a barcode or search for an item so that I can quickly add it to the current transaction.",
          "acceptance_criteria": [
            "Given a valid SKU or Barcode, When scanned, Then the item must be added to the in-memory order list with a default quantity of 1.",
            "Given duplicate scans of the same item, When scanned, Then the system must increment the existng line quantity instead of adding a new line.",
            "Given an item with 0 stock, When added, Then the system MUST show a warning but allow the add (manager override optional)."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": ["Renderer store (Zustand/Redux) updates in <50ms for a smooth scanning experience."],
      "open_questions": []
    },
    {
      "id": "FEAT-TRX-002",
      "epic_id": "EPIC-TRX-001",
      "title": "Real-time Calculation Engine",
      "description": "Dynamic calculation of prices, taxes, and discounts.",
      "user_stories": [
        {
          "title": "Calculate Order Totals",
          "story": "As a cashier, I want to see the subtotal, taxes, and total payable amount in real-time so that I can inform the customer as items are added.",
          "acceptance_criteria": [
            "Given a change in order quantity, When updated, Then the pricing engine MUST recalculate LineTotal, TaxAmount, and NetAmount instantly.",
            "Given a Branch-level tax setting (Inclusive), When calculating total, Then the net amount must be derived from the base price without adding extra tax.",
            "Given multiple discounts (Item + Transaction), When applied, Then the system MUST apply item-level first, then transaction-level."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": [],
      "open_questions": ["How do we handle rounding for denominations that don't exist in physical cash?"]
    },
    {
      "id": "FEAT-TRX-004",
      "epic_id": "EPIC-TRX-002",
      "title": "Atomic Commit & Inventory Ledger",
      "description": "Single-transaction DB persistence for all related tables.",
      "user_stories": [
        {
          "title": "Checkout & Settle Transaction",
          "story": "As a system, I want to save the order, collection, and inventory updates in a single atomic transaction so that data never becomes desynced.",
          "acceptance_criteria": [
            "Given a valid checkout, When committed, Then the system MUST record TrxOrder, TrxOrderLine, and update InventoryLedger in one DB transaction.",
            "Given a failure in updating the InventoryLedger, When committing, Then the entire Order MUST be rolled back and an error returned.",
            "Given a successful commit, When finished, Then the current order memory must be cleared and the Receipt service triggered.",
            "Given a transaction save, When committed, Then the record MUST store BOTH the 'SystemDateTime' (Real clock) and the 'BusinessDate' (from the user's login session) for auditing."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": ["Main process validates totals against the items in the DB to prevent 'Modified Price' exploits from the renderer."],
      "open_questions": []
    },
    {
      "id": "FEAT-TRX-006",
      "epic_id": "EPIC-TRX-003",
      "title": "Suspended Sales (Hold/Recall)",
      "description": "Recommended feature to allow pausing a transaction.",
      "user_stories": [
        {
          "title": "Hold and Recall Order",
          "story": "As a cashier, I want to put an order on hold so that I can serve the next customer while the current customer retrieves a missing item.",
          "acceptance_criteria": [
            "Given an active order, When 'Hold' is pressed, Then the system MUST save the order state locally and clear the POS screen.",
            "Given a 'Recall' request, When selected, Then the system MUST populate the POS screen with all items and discounts exactly as they were held.",
            "Given a held order, When the day ends (Z-Read), Then all 'Held' orders should be purged or flagged as abandoned."
          ],
          "priority": "High"
        }
      ],
      "assumptions": ["Held orders are stored in a local JSON storage or separate DB table."],
      "open_questions": []
    },
    {
      "id": "FEAT-TRX-007",
      "epic_id": "EPIC-TRX-003",
      "title": "Transaction Void & Reversal",
      "description": "Correcting errors following the immutability principle.",
      "user_stories": [
        {
          "title": "Void Comitted Transaction",
          "story": "As a manager, I want to void an existing transaction so that I can correct errors while maintaining a full audit trail.",
          "acceptance_criteria": [
            "Given a target transaction ID, When voided, Then the system MUST NOT delete the original record but create a counter-transaction with negative amounts.",
            "Given a voided sale, When processed, Then the system MUST automatically increment the inventory stock back to its previous level.",
            "Given a successful void, When complete, Then the status of the original transaction must be updated to 'VOIDED'."
          ],
          "priority": "High"
        }
      ],
      "assumptions": ["Voiding requires manager-level permissions."],
      "open_questions": []
    },
    {
      "id": "FEAT-TRX-008",
      "epic_id": "EPIC-TRX-003",
      "title": "Cash Drawer & Petty Cash",
      "description": "Recommended feature for financial accountability.",
      "user_stories": [
        {
          "title": "Record Non-Sale Cash Movements",
          "story": "As a cashier, I want to record 'Cash In' (beginning balance) and 'Cash Out' (expenses) so that my final cash count matches the system reports.",
          "acceptance_criteria": [
            "Given a beginning shift, When started, Then the user MUST enter the 'Beginning Cash' amount.",
            "Given a Petty Cash disbursement, When recorded, Then the system MUST deduct the amount from the expected cash drawer balance and require a reason.",
            "Given a shift close (X-Read), When generated, Then the system MUST show the total expected cash (Beginning + Sales - Disbursements)."
          ],
          "priority": "Medium"
        }
      ],
      "assumptions": [],
      "open_questions": []
    },
    {
      "id": "FEAT-TRX-009",
      "epic_id": "EPIC-TRX-004",
      "title": "Automated Journal Posting",
      "description": "Generate balanced accounting entries on transaction commit.",
      "user_stories": [
        {
          "title": "Post Sale to General Ledger",
          "story": "As an accountant, I want every sale to automatically generate a journal entry so that my financial books are always up to date.",
          "acceptance_criteria": [
            "Given a successful POS checkout, When committed, Then the system MUST generate a balanced Journal Entry (Debit: Cash/Ar, Credit: Sales/Tax/Disc).",
            "Given a voided transaction, When processed, Then it must create a Reversal Journal entry referencing the original transaction ID.",
            "Given the Accounting module, When viewed, Then users must be able to view, but NOT edit, system-generated journal entries."
          ],
          "priority": "High"
        }
      ]
    }
  ]
}

```
