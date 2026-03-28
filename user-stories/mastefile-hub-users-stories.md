# MASTERFILE HUB - USER STORIES

## Developer Checklist for Success
- Transactions First: Every "Save" request involving parent-child data MUST use a single DB transaction.
- No Magic Strings: Use Enums for PriceType, Status, and AccessRightIds.
- Validation Layer: Use Zod or Joi on the IPC layer to prevent malformed data from reaching the database.
- Indexing: Ensure SKU, Barcode, and BranchId are indexed in the database for O(1) or O(log n) lookups.

## Potential Risks & Mitigation
- **Circular Dependencies**: Users creating groups that refer to each other (e.g., Group A -> Group B -> Group A).
- **Mitigation**: Implement a recursive cycle-check in the main process before saving any hierarchical entity.
- **Race Conditions**: Concurrent updates to the same record leading to data loss.
- **Mitigation**: Use optimistic concurrency control (check 'UpdatedAt' timestamp before commit).
- **Orphan Children**: Failing to deactivate sub-records when a parent is deactivated.
- **Mitigation**: Ensure the CRUD engine cascades 'InActive' status to all direct children (e.g., Item -> ItemPrices).


```
    {
  "epics": [
    {
      "id": "EPIC-MST-001",
      "title": "Universal CRUD Engine (Main Process)",
      "description": "Develop the standardized backend service for all masterfiles, handling validation, child sync, and soft deletes.",
      "features": ["FEAT-MST-001", "FEAT-MST-002"]
    },
    {
      "id": "EPIC-MST-002",
      "title": "Core Reference Entities",
      "description": "Implement specific masterfile modules for Items, Users, and Roles following the hub pattern.",
      "features": ["FEAT-MST-003", "FEAT-MST-004"]
    },
    {
      "id": "EPIC-MST-003",
      "title": "Masterfile Hub UI Framework",
      "description": "Create reusable UI components for data entry, listing, and state management in the renderer.",
      "features": ["FEAT-MST-005"]
    }
  ],
  "features": [
    {
      "id": "FEAT-MST-001",
      "epic_id": "EPIC-MST-001",
      "title": "Parent-Child Sync Logic",
      "description": "Standardized engine to handle complex entities and their sub-records.",
      "user_stories": [
        {
          "title": "Sync Sub-Entities on Update",
          "story": "As a system, I want to automatically add, update, or remove child records during a parent update so that the relational data remains consistent.",
          "acceptance_criteria": [
            "Given an existing Item with 3 prices, When I update the Item with 2 new prices and remove 1, Then the DB must reflect exactly those 2 prices.",
            "Given a child record update, When saved, Then the Parent's 'UpdatedAt' timestamp must be refreshed.",
            "Given a failure in syncing any child record, When processing, Then the entire transaction MUST roll back.",
            "Given a concurrent update (different user saved first), When the save is attempted, Then the system MUST reject the request with a 'Data Outdated' error (Optimistic Locking)."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": ["Main process uses a transaction-capable database (SQLite/PostgreSQL)."],
      "open_questions": []
    },
    {
      "id": "FEAT-MST-002",
      "epic_id": "EPIC-MST-001",
      "title": "Dependency-Aware Soft Delete",
      "description": "Protect data integrity by preventing hard deletes of in-use data.",
      "user_stories": [
        {
          "title": "Soft Delete with Usage Check",
          "story": "As a system, I want to prevent the deletion of records referenced by other modules so that historical integrity is preserved.",
          "acceptance_criteria": [
            "Given a Category with 10 assigned Items, When I attempt to delete the Category, Then the system MUST block the action and show a 'Record in Use' error.",
            "Given an unused record, When deleted, Then it must be marked 'IsActive = false' instead of being removed from the DB.",
            "Given a soft-deleted record, When performing standard lookups, Then it must be excluded by default.",
            "Given a hierarchical entity (Group/Category), When saving, Then the system MUST perform a recursive check to ensure NO circular dependencies are created."
          ],
          "priority": "High"
        }
      ],
      "assumptions": [],
      "open_questions": []
    },
    {
      "id": "FEAT-MST-003",
      "epic_id": "EPIC-MST-002",
      "title": "Item & Inventory Management",
      "description": "Management of products, pricing, and stock levels.",
      "user_stories": [
        {
          "title": "Create Item with Multiple Prices",
          "story": "As a user, I want to save an item with various price types (Wholesale, Retail) so that I can support multiple selling strategies.",
          "acceptance_criteria": [
            "Given a new Item entry, When saved, Then the SKU must be unique across the system.",
            "Given an item has 'IsInventoryTracked' enabled, When saved, Then a default Inventory record for the current branch must be initialized.",
            "Given an item with no price defined, When saved, Then the system must reject the request."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": [],
      "open_questions": ["Do we support multi-currency pricing at the masterfile level?"]
    },
    {
      "id": "FEAT-MST-004",
      "epic_id": "EPIC-MST-002",
      "title": "Role-Based Access Control (RBAC) Master",
      "description": "Defining system permissions and branch access.",
      "user_stories": [
        {
          "title": "Manage Role Permissions",
          "story": "As an admin, I want to assign specific permissions to a role so that I can control user access across modules.",
          "acceptance_criteria": [
            "Given a Role update, When I select 'Can Delete', Then all users with that role must immediately inherit the permission.",
            "Given a User creation, When assigning a Role, Then the Role must exist in the database.",
            "Given a User creation, When saved, Then at least one BranchAccess record must be provided."
          ],
          "priority": "High"
        }
      ],
      "assumptions": ["Permissions are predefined in a seed file or static master table."],
      "open_questions": []
    },
    {
      "id": "FEAT-MST-005",
      "epic_id": "EPIC-MST-003",
      "title": "Optimized Renderer Data Hub",
      "description": "Efficient UI and state management for master data.",
      "user_stories": [
        {
          "title": "Cached Masterfile Lookup",
          "story": "As a user, I want the masterfile lists to load instantly so that I can perform lookups without waiting for network/DB lag.",
          "acceptance_criteria": [
            "Given a module (e.g., Item List), When I navigate to it, Then the data should be fetched from the Renderer Cache/Store if it hasn't changed.",
            "Given an update to a masterfile record, When saved successfully, Then the Renderer Store must be invalidated or updated in real-time.",
            "Given a large dataset (1000+ items), When viewed, Then the UI must use virtualization to maintain 60FPS performance."
          ],
          "priority": "Medium"
        }
      ],
      "assumptions": ["The system uses a state management library (Zustand/Redux) in the Renderer."],
      "open_questions": []
    },
    {
      "id": "FEAT-MST-006",
      "epic_id": "EPIC-MST-002",
      "title": "Bulk Import/Export Service",
      "description": "Enable mass data migration via CSV or Excel.",
      "user_stories": [
        {
          "title": "Import Items from Template",
          "story": "As an admin, I want to upload a CSV file of products so that I can populate the system without manual entry.",
          "acceptance_criteria": [
            "Given a CSV/Excel file, When uploaded, Then the system must validate each row against the Item masterfile schema before committing.",
            "Given a row with an existing SKU, When processing, Then the system must perform an 'Upsert' (Update existing) rather than creating a duplicate.",
            "Given a file with errors, When processed, Then the system MUST return a detailed error log specifying exactly which lines failed and why."
          ],
          "priority": "High"
        }
      ]
    }
  ]
}
```