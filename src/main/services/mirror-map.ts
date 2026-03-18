import { 
  MirrorItemEntity, MirrorUnitEntity, MirrorTaxEntity, MirrorUserEntity,
  MirrorDiscountEntity, MirrorPayTypeEntity, MirrorBranchEntity, MirrorTerminalEntity, MirrorCustomerEntity 
} from '../entities/mirror'

/**
 * Maps main MSSQL entity names to their local SQLite mirror entities.
 * This is used by BaseService to determine if an offline read fallback is available.
 */
export const MirrorMapping: Record<string, any> = {
  'MstItem': MirrorItemEntity,
  'MstUnit': MirrorUnitEntity,
  'MstTax': MirrorTaxEntity,
  'MstUser': MirrorUserEntity,
  'MstDiscount': MirrorDiscountEntity,
  'MstPayType': MirrorPayTypeEntity,
  'MstBranch': MirrorBranchEntity,
  'MstTerminal': MirrorTerminalEntity,
  'MstCustomer': MirrorCustomerEntity
}

/**
 * Helper to get the mirror entity for a given entity target.
 */
export const getMirrorEntity = (entity: any): any | null => {
  // Handle string names or class constructors
  const name = typeof entity === 'string' ? entity : entity?.name
  return MirrorMapping[name] || null
}
