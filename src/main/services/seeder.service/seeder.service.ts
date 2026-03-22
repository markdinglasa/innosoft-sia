import * as bcrypt from 'bcrypt'
import { DEFAULT_ACCESS_RIGHTS } from '../../data/default-records/default-access-rights.record'
import { DEFAULT_ACCOUNT } from '../../data/default-records/default-account.record'
import { DEFAULT_BRANCH_ACCESS } from '../../data/default-records/default-branch-access.record'
import { DEFAULT_BRANCH } from '../../data/default-records/default-branch.record'
import { DEFAULT_DISCOUNT } from '../../data/default-records/default-discount.record'
import { DEFAULT_PAY_TYPE } from '../../data/default-records/default-paytype.record'
import { DEFAULT_PERIOD } from '../../data/default-records/default-period.record'
import { DEFAULT_ROLES } from '../../data/default-records/default-roles.record'
import { DEFAULT_SUPPLIER } from '../../data/default-records/default-supplier.record'
import { DEFAULT_TABLE_GROUP } from '../../data/default-records/default-table-group.record'
import { DEFAULT_TABLE } from '../../data/default-records/default-table.record'
import { DEFAULT_TAX } from '../../data/default-records/default-tax.record'
import { DEFAULT_TERMS } from '../../data/default-records/default-term.record'
import { DEFAULT_TERMINAL } from '../../data/default-records/default-terminal.record'
import { DEFAULT_UNIT } from '../../data/default-records/default-unit.record'
import { DEFAULT_USER_ROLES } from '../../data/default-records/default-user-roles.record'
import { DEFAULT_USERS } from '../../data/default-records/default-user.record'
import {
  MstAccessRightEntity,
  MstAccountEntity,
  MstBranchAccessEntity,
  MstBranchEntity,
  MstDiscountEntity,
  MstPayTypeEntity,
  MstPeriodEntity,
  MstPermissionsEntity,
  MstRoleEntity,
  MstSupplierEntity,
  MstTableEntity,
  MstTableGroupEntity,
  MstTaxEntity,
  MstTermEntity,
  MstTerminalEntity,
  MstUnitEntity,
  MstUserEntity,
  MstUserRolesEntity
} from '../../entities/masterfiles'
import { AppDataSource } from '../../typeORM/configurations'

/**
 * SeederService handles the population of default data into the database.
 * It ensures that essential records exist and are correctly configured.
 */
export class SeederService {
  /**
   * Main entry point for seeding. Orchestrates the seeding process in the correct order.
   */
  async seed(): Promise<void> {
    console.log('[SeederService] Starting database seeding...')
    
    try {
      // 1. Independent Core
      await this.seedUsers()
      await this.seedAccessRights()
      await this.seedBranches()
      await this.seedAccounts()
      
      // 2. Secondary Masterfiles
      await this.seedRoles()
      await this.seedTerms()
      await this.seedPeriods()
      await this.seedTableGroups()
      
      // 3. Dependent Masterfiles
      await this.seedTaxes()
      await this.seedUnits()
      await this.seedPayTypes()
      await this.seedDiscounts()
      await this.seedSuppliers()
      await this.seedTables()
      await this.seedTerminals()
      
      // 4. User System
      await this.seedUserRoles()
      await this.seedBranchAccess()
      await this.seedAdministratorPermissions()
      
      console.log('[SeederService] Seeding completed successfully.')
    } catch (error) {
      console.error('[SeederService] Seeding failed:', error)
      throw error
    }
  }

  private async seedAccessRights(): Promise<void> {
    const repo = AppDataSource.getRepository(MstAccessRightEntity)
    for (const data of DEFAULT_ACCESS_RIGHTS) {
      const exists = await repo.findOneBy({ action: data.action })
      if (!exists) {
        await repo.save(repo.create({ action: data.action, category: data.category }))
      }
    }
  }

  private async seedBranches(): Promise<void> {
    const repo = AppDataSource.getRepository(MstBranchEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    for (const data of DEFAULT_BRANCH) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const user = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          name: data.name,
          address: data.address,
          description: data.description,
          isDefault: true,
          entryUserId: user?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedAccounts(): Promise<void> {
    const repo = AppDataSource.getRepository(MstAccountEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    for (const data of DEFAULT_ACCOUNT) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const user = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          name: data.name,
          type: data.type,
          code: data.code,
          isDefault: data.isDefault,
          isLocked: data.isLocked,
          entryUserId: user?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedRoles(): Promise<void> {
    const repo = AppDataSource.getRepository(MstRoleEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    for (const data of DEFAULT_ROLES) {
      const exists = await repo.findOneBy({ code: data.code })
      if (!exists) {
        const user = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          code: data.code,
          name: data.name,
          description: data.description,
          isDefault: data.isDefault,
          isLocked: data.isLocked,
          entryUserId: user?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedTerms(): Promise<void> {
    const repo = AppDataSource.getRepository(MstTermEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    for (const data of DEFAULT_TERMS) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const user = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          name: data.name,
          numberOfDays: data.numberOfDays,
          isDefault: (data ).isDefault || false,
          isLocked: data.isLocked,
          entryUserId: user?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedTaxes(): Promise<void> {
    const repo = AppDataSource.getRepository(MstTaxEntity)
    const accountRepo = AppDataSource.getRepository(MstAccountEntity)
           const userRepo = AppDataSource.getRepository(MstUserEntity)
   
    for (const data of DEFAULT_TAX) {
      const exists = await repo.findOneBy({ name:(data ).name })
      if (!exists) {
        const user = await userRepo.findOneBy({ username: data.entryUser })
        const account = await accountRepo.findOneBy({ name: data.account })
        await repo.save(repo.create({
          code: (data ).code,
          name: (data ).name,
          rate: data.rate,
          accountId: account?.id || 0,
          isDefault: data.isDefault,
          entryUserId: user?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedUnits(): Promise<void> {
    const repo = AppDataSource.getRepository(MstUnitEntity)
    const branchRepo = AppDataSource.getRepository(MstBranchEntity)
       const userRepo = AppDataSource.getRepository(MstUserEntity)
   
    for (const data of DEFAULT_UNIT) {
      const exists = await repo.findOneBy({ name: (data ).name || (data ).name })
      if (!exists) {
        const branch = await branchRepo.findOneBy({ name: data.branch })
        const user = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          branchId: branch?.id || 0,
          name:  (data ).name,
          description: data.description,
          isDefault: data.isDefault,
          entryUserId: user?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedPayTypes(): Promise<void> {
    const repo = AppDataSource.getRepository(MstPayTypeEntity)
    const accountRepo = AppDataSource.getRepository(MstAccountEntity)
    const branchRepo = AppDataSource.getRepository(MstBranchEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
   
    for (const data of DEFAULT_PAY_TYPE) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const account = await accountRepo.findOneBy({ name: data.account })
        const branch = await branchRepo.findOneBy({ name: data.branch })
        const user = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          name: data.name,
          accountId: account?.id || null,
          sortNumber: data.sortNumber,
          isDefault: data.isDefault,
          branchId: branch?.id || 0, // Defaulting to main branch
          entryUserId: user?.id || 1,
          entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedDiscounts(): Promise<void> {
    const repo = AppDataSource.getRepository(MstDiscountEntity)
    const branchRepo = AppDataSource.getRepository(MstBranchEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    
    for (const data of DEFAULT_DISCOUNT) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const branch = await branchRepo.findOneBy({ name: data.branch })
       const user = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          branchId: branch?.id || 0,
          name: data.name,
          discountRate: data.discountRate,
          isVATExempt: data.isVATExempt,
          discountAlias: data.discountAlias,
          isDefault: data.isDefault,
          entryUserId: user?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedSuppliers(): Promise<void> {
    const repo = AppDataSource.getRepository(MstSupplierEntity)
    const termRepo = AppDataSource.getRepository(MstTermEntity)
    const accountRepo = AppDataSource.getRepository(MstAccountEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    
    for (const data of DEFAULT_SUPPLIER) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const term = await termRepo.findOneBy({ name: data.term })
        const account = await accountRepo.findOneBy({ name: data.account })
        const user = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          name: data.name,
          address: data.address,
          telephoneNumber: data.telephoneNumber,
          cellphoneNumber: data.cellphoneNumber,
          faxNumber: data.faxNumber,
          termId: term?.id || 0,
          tin: data.tin,
          accountId: account?.id || 0,
          isLocked: data.isLocked,
          entryUserId: user?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedTableGroups(): Promise<void> {
    const repo = AppDataSource.getRepository(MstTableGroupEntity)
    const branchRepo = AppDataSource.getRepository(MstBranchEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    
    for (const data of DEFAULT_TABLE_GROUP) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const branch = await branchRepo.findOneBy({ name: data.branch })
        const user = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          branchId: branch?.id || 0,
          name: data.name,
          isDefault: data.isDefault,
          entryUserId: user?.id|| 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedTables(): Promise<void> {
    const repo = AppDataSource.getRepository(MstTableEntity)
    const groupRepo = AppDataSource.getRepository(MstTableGroupEntity)
     const userRepo = AppDataSource.getRepository(MstUserEntity)
    
    for (const data of DEFAULT_TABLE) {
      const exists = await repo.findOneBy({ tableCode: (data ).tableCode })
      if (!exists) {
        const group = await groupRepo.findOneBy({ name: data.tableGroup })
        const userLog = await userRepo.findOneBy({ username: data.entryUser })
        await repo.save(repo.create({
          tableGroupId: group?.id || 0,
          tableCode: (data ).tableCode,
          isDefault: data.isDefault,
          entryUserId: userLog?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedPeriods(): Promise<void> {
    const repo = AppDataSource.getRepository(MstPeriodEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    const branchRepo = AppDataSource.getRepository(MstBranchEntity)
    
    for (const data of DEFAULT_PERIOD) {
      const exists = await repo.findOneBy({ name: data.name })
      const user = await userRepo.findOneBy({ username: data.entryUser }) 
      const branch = await branchRepo.findOneBy({ name: data.branch })
      if (!exists) {
        await repo.save(repo.create({
          name: data.name,
          branchId: branch?.id || 0,
          isDefault: data.isDefault,
          entryUserId: user?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedTerminals(): Promise<void> {
    const repo = AppDataSource.getRepository(MstTerminalEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    const branchRepo = AppDataSource.getRepository(MstBranchEntity)
    for (const data of DEFAULT_TERMINAL) {
      const exists = await repo.findOneBy({ name: data.name })
      const user = await userRepo.findOneBy({ username: data.entryUser })
      const branch = await branchRepo.findOneBy({ name: data.branch })
      if (!exists) {
        await repo.save(repo.create({
          name: data.name,
          branchId: branch?.id || 0,
          isDefault: data.isDefault,
          isLocked: data.isLocked,
          entryUserId: user?.id || 1,
          entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedUsers(): Promise<void> {
    const repo = AppDataSource.getRepository(MstUserEntity)
    for (const data of DEFAULT_USERS) {
      const exists = await repo.findOneBy({ username: data.username })
      if (!exists) {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        await repo.save(repo.create({
          username: data.username,
          password: hashedPassword,
          fullName: data.fullName,
          type: data.type,
          email: data.email,
          status: data.status,
          isLocked: data.isLocked,
          isDefault: data.isDefault,
          entryDateTime: new Date()
        }))
      }
    }
  }

  private async seedUserRoles(): Promise<void> {
    const userRoleRepo = AppDataSource.getRepository(MstUserRolesEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    const roleRepo = AppDataSource.getRepository(MstRoleEntity)
    
    for (const mapping of DEFAULT_USER_ROLES) {
      const user = await userRepo.findOneBy({ username: mapping.user })
      const role = await roleRepo.findOneBy({ code: mapping.role })
      const userLog = await userRepo.findOneBy({ username: mapping.entryUser })
      if (user && role) {
        const exists = await userRoleRepo.findOneBy({ userId: user.id, roleId: role.id })
        if (!exists) {
          await userRoleRepo.save(userRoleRepo.create({
            userId: user.id,
            roleId: role.id,
            isDefault: true,
            entryUserId: userLog?.id || 1,
            entryDateTime: new Date()
          }))
        }
      }
    }
  }

  private async seedBranchAccess(): Promise<void> {
    const repo = AppDataSource.getRepository(MstBranchAccessEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    const branchRepo = AppDataSource.getRepository(MstBranchEntity)
    
    for (const data of DEFAULT_BRANCH_ACCESS) {
      const user = await userRepo.findOneBy({ username: data.user })
      const branch = await branchRepo.findOneBy({ name: data.branch })
      const userLog = await userRepo.findOneBy({ username: data.entryUser })
      if (user && branch) {
        const exists = await repo.findOneBy({ userId: user.id, branchId: branch.id })
        if (!exists) {
          await repo.save(repo.create({
            userId: user.id,
            branchId: branch.id,
            entryUserId: userLog?.id || 1,
            entryDateTime: new Date()
          }))
        }
      }
    }
  }

  private async seedAdministratorPermissions(): Promise<void> {
    const roleRepo = AppDataSource.getRepository(MstRoleEntity)
    const accessRightRepo = AppDataSource.getRepository(MstAccessRightEntity)
    const permissionRepo = AppDataSource.getRepository(MstPermissionsEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    
    const adminRole = await roleRepo.findOneBy({ code: 'ADMINISTRATOR' })
    if (!adminRole) return

    const adminUser = await userRepo.findOneBy({ username: 'admin' })
    const allAccessRights = await accessRightRepo.find()
    
    for (const ar of allAccessRights) {
      const exists = await permissionRepo.findOneBy({ roleId: adminRole.id, accessRightId: ar.id })
      if (!exists) {
        await permissionRepo.save(permissionRepo.create({
          roleId: adminRole.id,
          accessRightId: ar.id,
          entryUserId: adminUser?.id || 1,
           entryDateTime: new Date()
        }))
      }
    }
  }
}

export const seederService = new SeederService()
