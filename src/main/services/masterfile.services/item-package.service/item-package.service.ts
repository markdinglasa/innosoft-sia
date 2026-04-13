import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstItemPackageEntity } from '../../../entities/masterfiles/MstItemPackage.entity'
import { BaseService } from '../../base.service'
import { CreateItemPackageDto, UpdateItemPackageDto } from './dto'

export interface IItemPackageService {
  // Add specific ItemPackage methods here later
}

export class ItemPackageService extends BaseService<MstItemPackageEntity> implements IItemPackageService {
  constructor() {
    super(MstItemPackageEntity)
  }

  /**
   * Optional relations to include in results.
   */
  protected get listRelations(): string[] {
    return ['packageItem', 'unit']
  }

  /**
   * Search fields for ItemPackage keyword search.
    return ['itemId', 'packageItemId']
  }

  /**
   * Validates before creating a new ItemPackage.
   * Ensures the parent-package combination is unique.
   */
  protected async validateCreate(data: DeepPartial<MstItemPackageEntity>): Promise<void> {
    const packageDto = await transformAndValidate(CreateItemPackageDto, data)

    const existingPackage = await this.repository.findOneBy({ 
      itemId: packageDto.itemId,
      packageItemId: packageDto.packageItemId
    })
    
    if (existingPackage) {
      throw new BadRequestException('This package item is already assigned to this parent item.')
    }
  }

  /**
   * Validates before updating an existing ItemPackage.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstItemPackageEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Package not found for update.')
    }

    const packageDto = await transformAndValidate(UpdateItemPackageDto, data)
    
    const itemId = packageDto.itemId ?? currentEntity.itemId
    const packageItemId = packageDto.packageItemId ?? currentEntity.packageItemId

    if (itemId !== currentEntity.itemId || packageItemId !== currentEntity.packageItemId) {
      const existingPackage = await this.repository.findOneBy({ 
        itemId,
        packageItemId
      })
      
      if (existingPackage) {
        throw new BadRequestException('This package item is already assigned to this parent item.')
      }
    }
  }

  /**
   * Validates before deleting an ItemPackage.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Package not found for deletion.')
    }
  }
}
