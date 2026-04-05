# Standardized Form Validation and UI Migration

I have completed the migration of all POS Masterfile forms to a standardized, type-safe validation system using **Zod** and **React Hook Form**.

## Summary of Changes

### 1. Global Theme Updates

- **File**: `src/renderer/src/theme.ts`
- **Change**: Added a global style override for `MuiFormLabel-asterisk` to ensure that mandatory field markers are rendered in the theme's error color (`colors.red`). This ensures visibility even when fields are not currently in an error state.

### 2. Validation & UI Standardization

The following forms have been migrated to the new pattern:

1.  **Terminal** (`mst-terminal`)
2.  **Item Group** (`mst-item-group`)
3.  **Discount** (`mst-discount`)
4.  **Pay Type** (`mst-pay-type`)
5.  **Supplier** (`mst-supplier`)
6.  **Item** (`mst-item`)
7.  **Table Group** (`mst-table-group`)
8.  **Period** (`mst-period`)
9.  **Tax** (`mst-tax`)
10. **Item Component** (`mst-item-component`)

### 3. Established Pattern

Each migrated form now follows this standard:

- **Colocated Zod Schema**: Defined at the top of the file for easy maintenance.
- **Resolver**: `useForm` is initialized with `zodResolver(schema)`.
- **UI Indicators**:
  - `required={true}` added to all mandatory MUI `TextField` or `Select` components.
  - `error={!!errors[field]}` for visual feedback.
  - `helperText={errors[field]?.message}` for descriptive error messages.
- **Type Safety**: Using `z.infer` for form data types.

## Migration Details

| Module             | Required Fields                    | Validation Logic                      |
| :----------------- | :--------------------------------- | :------------------------------------ |
| **Terminal**       | Name, Code                         | Non-empty string                      |
| **Item Group**     | Name                               | Non-empty string                      |
| **Discount**       | Name, Type, Value                  | Non-empty string, non-negative value  |
| **Supplier**       | Name, Address                      | Non-empty string                      |
| **Item**           | Code, Name, Base Unit, Price, Cost | Non-empty string, non-negative values |
| **Tax**            | Code, Name, Rate                   | Non-empty string, non-negative rate   |
| **Item Component** | Item ID, Component ID, Qty         | ID > 0, Qty >= 1                      |

## Performance & UX Impact

- **Instant Feedback**: Errors are now displayed immediately when trying to save an invalid form.
- **No Refocusing**: The validation is handled cleanly without losing focus on fields.
- **Visual Consistency**: All mandatory fields now have a red asterisk across the entire POS workspace.

## Next Steps

- [ ] **Manual Verification**: Test each form in the UI to confirm the red asterisk and error messages are appearing as expected.
- [ ] **Optional**: If you need to add more complex validation (e.g. async duplication check), you can now easily add them to the Zod schemas using `.refine()`.

