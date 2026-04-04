/**
 * Standard response for a parent-child save operation.
 * Used across the Masterfile Hub to ensure consistent feedback.
 */
export interface ParentChildSaveResult {
  success: boolean
  parentId: number | string
  updatedAt: string
  insertedChildren: number
  updatedChildren: number
  removedChildren: number
  message?: string
}

/**
 * Generic payload for parent-child CRUD operations.
 */
export interface ParentChildSavePayload<TParent, TChild> {
  parent: TParent
  children: TChild[]
  deletedChildIds?: (number | string)[] // Explicit IDs to delete if any
}

/**
 * Configuration for the Parent-Child Sync Engine.
 */
export interface ParentChildSaveConfig {
  childForeignKey: string
  softDeleteChildren?: boolean
  upsertChildren?: boolean // If true, matches by primary key or inserts
}
