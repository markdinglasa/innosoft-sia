import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstCustomerEntity } from '../../../entities/masterfiles/MstCustomer.entity'
import { BaseService } from '../../base.service'
import { CreateCustomerDto, UpdateCustomerDto } from './dto'

export interface ICustomerService {
  // Add specific Customer methods here later
}

export class CustomerService extends BaseService<MstCustomerEntity> implements ICustomerService {
  constructor() {
    super(MstCustomerEntity)
  }

  /**
   * Search fields for Customer keyword search.
   */
  protected get searchFields(): string[] {
    return ['customer', 'address', 'contactPerson', 'contactNumber', 'tin']
  }

  /**
   * Validates before creating a new Customer.
   * Ensures Customer Name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstCustomerEntity>): Promise<void> {
    const customerDto = await transformAndValidate(CreateCustomerDto, data)

    const existingName = await this.repository.findOneBy({ customer: customerDto.customer })
    if (existingName) {
      throw new BadRequestException(`Customer '${customerDto.customer}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Customer.
   * Ensures modified Customer Name does not conflict.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstCustomerEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Customer not found for update.')
    }

    const customerDto = await transformAndValidate(UpdateCustomerDto, data)
    if (customerDto.customer && customerDto.customer !== currentEntity.customer) {
      const existingName = await this.repository.findOneBy({ customer: customerDto.customer as string })
      if (existingName) {
        throw new BadRequestException(`Customer '${customerDto.customer}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Customer.
   * Ensures they are not in-use.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Customer not found for deletion.')
    }

    // TODO: Implement relational in-use check
    // e.g. "Cannot delete Customer because they have existing Sales Transactions"
  }
}
