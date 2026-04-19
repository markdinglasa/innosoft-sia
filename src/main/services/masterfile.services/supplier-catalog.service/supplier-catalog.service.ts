import { MstItemEntity } from '../../../entities/masterfiles/MstItem.entity'
import { MstSupplierCatalogEntity } from '../../../entities/masterfiles/MstSupplierCatalog.entity'
import { AppDataSource } from '../../../typeORM/configurations'
import { BaseService } from '../../base.service'

export class SupplierCatalogService extends BaseService<MstSupplierCatalogEntity> {
  constructor() {
    super(MstSupplierCatalogEntity)
  }

  /**
   * Parses a CSV string and updates the supplier catalog.
   * CSV Schema: SupplierItemCode, SupplierItemName, InternalItemCode, UnitCost, LeadTime, MOQ
   */
  async importFromCsv(
    supplierId: number,
    csvContent: string
  ): Promise<{ imported: number; skipped: number }> {
    const lines = csvContent.split('\n')
    let imported = 0
    let skipped = 0

    // Skip header if it contains known keywords
    const startIndex = lines[0].toLowerCase().includes('code') ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const [supplierItemCode, supplierItemName, internalItemCode, unitCost, leadTime, moq] =
        line.split(',')

      if (!supplierItemCode || !internalItemCode) {
        skipped++
        continue
      }

      // Find the internal item by code
      const item =
        (await AppDataSource.getRepository(MstItemEntity).findOneBy({
          itemCode: internalItemCode.trim()
        })) ||
        (await AppDataSource.getRepository(MstItemEntity).findOneBy({
          barCode: internalItemCode.trim()
        }))

      if (!item) {
        skipped++
        continue
      }

      // Check if catalog entry already exists
      let catalogEntry = await this.repository.findOneBy({
        supplierId,
        supplierItemCode: supplierItemCode.trim()
      })

      if (catalogEntry) {
        // Update existing
        catalogEntry.supplierItemName = supplierItemName?.trim() || catalogEntry.supplierItemName
        catalogEntry.unitCost = Number.parseFloat(unitCost) || catalogEntry.unitCost
        catalogEntry.leadTimeDays = Number.parseInt(leadTime) || catalogEntry.leadTimeDays
        catalogEntry.minimumOrderQuantity =
          Number.parseFloat(moq) || catalogEntry.minimumOrderQuantity
        catalogEntry.lastUpdated = new Date()
        await this.repository.save(catalogEntry)
      } else {
        // Create new
        catalogEntry = this.repository.create({
          supplierId,
          itemId: item.id,
          supplierItemCode: supplierItemCode.trim(),
          supplierItemName: supplierItemName?.trim() || item.name,
          unitCost: Number.parseFloat(unitCost) || item.cost,
          leadTimeDays: Number.parseInt(leadTime) || 0,
          minimumOrderQuantity: Number.parseFloat(moq) || 1,
          lastUpdated: new Date(),
          isActive: true
        })
        await this.repository.save(catalogEntry)
      }
      imported++
    }

    return { imported, skipped }
  }

  /**
   * Retrieves items for a specific supplier from the catalog.
   */
  async getSupplierItems(supplierId: number): Promise<MstSupplierCatalogEntity[]> {
    return await this.repository.find({
      where: { supplierId, isActive: true },
      relations: ['item', 'item.unit']
    })
  }

  /**
   * Helper to map a supplier item code to internal item for PO generation.
   */
  async findBySupplierCode(
    supplierId: number,
    supplierItemCode: string
  ): Promise<MstSupplierCatalogEntity | null> {
    return await this.repository.findOne({
      where: { supplierId, supplierItemCode, isActive: true },
      relations: ['item']
    })
  }
}

