import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstSupplierEntity } from '../../../entities/masterfiles/MstSupplier.entity'
import { BaseService } from '../../base.service'
import { CreateSupplierDto, UpdateSupplierDto } from './dto'

export interface ISupplierService {
  // Add specific Supplier methods here later
}

export class SupplierService extends BaseService<MstSupplierEntity> implements ISupplierService {
  constructor() {
    super(MstSupplierEntity)
  }

  /**
   * Search fields for Supplier keyword search.
   */
  protected get searchFields(): string[] {
    return ['supplier', 'address', 'telephoneNumber', 'cellphoneNumber', 'faxNumber', 'tin']
  }

  /**
   * Validates before creating a new Supplier.
   * Ensures Supplier Name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstSupplierEntity>): Promise<void> {
    const supplierDto = await transformAndValidate(CreateSupplierDto, data)

    const existingName = await this.repository.findOneBy({ supplier: supplierDto.supplier })
    if (existingName) {
      throw new BadRequestException(`Supplier '${supplierDto.supplier}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Supplier.
   * Ensures modified Supplier Name does not conflict.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstSupplierEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Supplier not found for update.')
    }

    const supplierDto = await transformAndValidate(UpdateSupplierDto, data)
    if (supplierDto.supplier && supplierDto.supplier !== currentEntity.supplier) {
      const existingName = await this.repository.findOneBy({ supplier: supplierDto.supplier })
      if (existingName) {
        throw new BadRequestException(`Supplier '${supplierDto.supplier}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Supplier.
   * Ensures they are not in-use.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Supplier not found for deletion.')
    }

    // TODO: Implement relational in-use check
    // e.g. "Cannot delete Supplier because they have existing Purchase Transactions"
  }
}
