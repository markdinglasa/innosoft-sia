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
      "features": ["FEAT-MST-003", "FEAT-MST-004", "FEAT-MST-006"]
    },
    {
      "id": "EPIC-MST-003",
      "title": "Masterfile Hub UI Framework",
      "description": "Create reusable UI components for data entry, listing, and state management in the renderer.",
      "features": ["FEAT-MST-005"]
    },
    {
      "id": "EPIC-MST-004",
      "title": "Business & Technical Metadata",
      "description": "Comprehensive CRUD for operational entities like Branches, Customers, Suppliers, and System Configurations.",
      "features": ["FEAT-MST-007", "FEAT-MST-008", "FEAT-MST-009", "FEAT-MST-010", "FEAT-MST-011", "FEAT-MST-012"]
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
        },
        {
          "title": "Multi-Packaging Units (UOM Packages)",
          "story": "As a warehouse manager or cashier, I want to define multiple packaging units for an item so that I can buy and sell in different bulk quantities with unique barcodes.",
          "acceptance_criteria": [
            "Given a package definition, When added to an item, Then it must define a 'Relation Unit' and a 'Factor' based on the primary UOM.",
            "Given a package, When saved, Then it must support its own SKU/Barcode and PackagePrice.",
            "Given a transaction, When the package barcode is scanned, Then the system must correctly multiply the quantity by the 'Factor' for accurate stock tracking.",
            "Given a package factor of 0 or less, When saving, Then the system MUST reject the entry."
          ],
          "priority": "High"
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
    },
    {
      "id": "FEAT-MST-007",
      "epic_id": "EPIC-MST-004",
      "title": "Organizational & Personnel Entities",
      "description": "Core setup for branches and users.",
      "user_stories": [
        {
          "title": "Multi-Branch CRUD",
          "story": "As an admin, I want to manage different physical branches so that I can segregate inventory and financial reports.",
          "acceptance_criteria": [
            "Given a Branch creation, When saved, Then a unique BranchCode must be enforced.",
            "Given an active Branch, When attempting to deactivate it, Then the system must verify if there are any active Cashiers currently logged in to that branch."
          ],
          "priority": "High"
        },
        {
          "title": "Personnel/Employee Profile",
          "story": "As an admin, I want to manage employee records so that I can assign them to roles and track their performance.",
          "acceptance_criteria": [
            "Given a new Personnel record, When saved, Then it must be linked to a valid User Account for system access.",
            "Given an employee transfer, When updating the branch assignment, Then the user's BranchAccess table must be updated automatically."
          ],
          "priority": "High"
        }
      ]
    },
    {
      "id": "FEAT-MST-008",
      "epic_id": "EPIC-MST-004",
      "title": "Item Group (Catalog) Management",
      "description": "Hierarchical classification and structural organization for products.",
      "user_stories": [
        {
          "title": "Hierarchical Item-Group Management",
          "story": "As a user, I want to group items into categories and sub-groups so that I can organize the POS menu and generate grouped sales reports.",
          "acceptance_criteria": [
            "Given an Item Group creation, When assigned a parent, Then the system must avoid creating circular references.",
            "Given an Item Group, When deactivating it, Then all child items must be optionally hidden from the quick-pick menu."
          ],
          "priority": "Medium"
        },
        {
          "title": "Item Component (BOM) Management",
          "story": "As a kitchen manager or production supervisor, I want to define a list of components/ingredients for an item so that the system can automatically track stock consumption of raw materials.",
          "acceptance_criteria": [
            "Given an item, When defined as a 'Composite' or 'Kit' item, Then it must allow adding one or more component items.",
            "Given a component item, When added to a parent item, Then the user must specify the 'Quantity to Deduct' per unit of the parent item.",
            "Given a list of components, When saved, Then the parent item's total cost must be optionally calculated based on the sum of its component costs.",
            "Given a circular dependency (e.g., Item A is a component of Item B, and Item B is as a component of Item A), When saved, Then the system must block the update to prevent infinite recursion."
          ],
          "priority": "High"
        }
      ]
    },
    {
      "id": "FEAT-MST-012",
      "epic_id": "EPIC-MST-004",
      "title": "Dining Space (Table) Management",
      "description": "Functional setup for physical seating and restaurant layouts.",
      "user_stories": [
        {
          "title": "Table Group Management",
          "story": "As an F&B manager, I want to group dining tables into sections (e.g., Al Fresco, VIP) so that I can manage floor assignments.",
          "acceptance_criteria": [
            "Given a Table Group, When saved, Then it should allow assigning multiple Table IDs.",
            "Given a Table Group, When viewed in POS, Then it must display the status of all assigned tables (Occupied/Vacant)."
          ],
          "priority": "Medium"
        }
      ]
    },
    {
      "id": "FEAT-MST-009",
      "epic_id": "EPIC-MST-004",
      "title": "Entity Relationship (CRM/SRM)",
      "description": "Management of Customers and Suppliers.",
      "user_stories": [
        {
          "title": "Customer Loyalty Profile",
          "story": "As a user, I want to maintain customer records so that I can apply loyalty discounts and track purchase history.",
          "acceptance_criteria": [
            "Given a Customer record, When saved, Then the system should allow defining a default Discount Type.",
            "Given a Customer creation, When an Email/Phone already exists, Then the system must flag a potential duplicate."
          ],
          "priority": "High"
        },
        {
          "title": "Supplier Masterfile",
          "story": "As a purchasing officer, I want to manage supplier contacts and terms so that I can streamline procurement.",
          "acceptance_criteria": [
            "Given a Supplier record, When saved, Then it must include default Payment Terms (e.g., COD, Net30).",
            "Given a Supplier, When viewed, Then the system should link to active Purchase Orders (Integration Check)."
          ],
          "priority": "Medium"
        }
      ]
    },
    {
      "id": "FEAT-MST-010",
      "epic_id": "EPIC-MST-004",
      "title": "Commercial Rules (Discounts)",
      "description": "Management of promotional and structural discounts.",
      "user_stories": [
        {
          "title": "Complex Discount Rules",
          "story": "As a manager, I want to define discounts (Percentage, Fixed, BOGO) so that I can implement marketing promotions.",
          "acceptance_criteria": [
            "Given a Discount creation, When type is 'Percentage', Then the value must be between 0 and 100.",
            "Given a Discount, When saved, Then it must have a Start and End Date or be marked as 'Always Active'.",
            "Given multiple discounts on one item, When calculating, Then the system must follow a 'Stackable' or 'Highest Only' rule defined in the master."
          ],
          "priority": "High"
        }
      ]
    },
    {
      "id": "FEAT-MST-011",
      "epic_id": "EPIC-MST-004",
      "title": "System Meta-Data & Config Master",
      "description": "Technical lookups for core logic (Tax, Terminals, Units).",
      "user_stories": [
        {
          "title": "Financial Configurations (Tax & COA)",
          "story": "As an accountant, I want to define Tax rates and Chart of Accounts so that financial transactions are posted correctly.",
          "acceptance_criteria": [
            "Given a Tax setup, When saved, Then it must include a specific Account Code from the COA master.",
            "Given a Pay-Type (Cash, Card, GCash), When created, Then it must be mapped to a specific GL Account for reconciliation."
          ],
          "priority": "Critical"
        },
        {
          "title": "Operational Configurations (Terminal, Unit, Term, Period)",
          "story": "As a system admin, I want to manage technical masterfiles (Terminals, Units of Measure, Payment Terms, Accounting Periods) to support daily operations.",
          "acceptance_criteria": [
            "Given a Terminal record, When saved, Then it must be bound to a specific BranchID.",
            "Given a Unit of Measure (UOM), When saved, Then it must allow defining a base-conversion factor (e.g., 1 Case = 24 Pcs).",
            "Given an Accounting Period, When 'Closed', Then no new transactions can be saved for that date range."
          ],
          "priority": "Critical"
        }
      ]
    }
  ]
}

```