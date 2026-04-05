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
  async seed(): Promise<void> {
    console.log('[SeederService] Starting database seeding...')

    try {
      // 1. Independent Core
      const adminUser = await this.seedUsers()
      await this.seedAccessRights()
      const mainBranch = await this.seedBranches(adminUser)
      await this.seedAccounts(adminUser)

      // 2. Secondary Masterfiles
      await this.seedRoles(adminUser)
      await this.seedTerms(adminUser)
      await this.seedPeriods(adminUser, mainBranch)
      await this.seedTableGroups(adminUser, mainBranch)

      // 3. Dependent Masterfiles
      await this.seedTaxes(adminUser)
      await this.seedUnits(adminUser, mainBranch)
      await this.seedPayTypes(adminUser, mainBranch)
      await this.seedDiscounts(adminUser, mainBranch)
      await this.seedSuppliers(adminUser)
      await this.seedTables(adminUser)
      await this.seedTerminals(adminUser, mainBranch)

      // 4. User System
      await this.seedUserRoles(adminUser)
      await this.seedBranchAccess(adminUser, mainBranch)
      await this.seedAdministratorPermissions(adminUser)

      console.log('[SeederService] Seeding completed successfully.')
    } catch (error) {
      console.error('[SeederService] Seeding failed:', error)
      throw error
    }
  }

  private async seedAccessRights(): Promise<void> {
    const repo = AppDataSource.getRepository(MstAccessRightEntity)
    const existing = await repo.find({ select: ['action'] })
    const existingActions = new Set(existing.map((a) => a.action))

    const toCreate = DEFAULT_ACCESS_RIGHTS.filter((data) => !existingActions.has(data.action))

    if (toCreate.length > 0) {
      await repo.save(
        toCreate.map((data) => repo.create({ action: data.action, category: data.category }))
      )
    }
  }

  private async seedBranches(adminUser: MstUserEntity): Promise<MstBranchEntity> {
    const repo = AppDataSource.getRepository(MstBranchEntity)
    let mainBranch = await repo.findOneBy({ name: 'Main' })

    if (!mainBranch) {
      const data = DEFAULT_BRANCH.find((b) => b.name === 'Main') || DEFAULT_BRANCH[0]
      mainBranch = await repo.save(
        repo.create({
          name: data.name,
          address: data.address,
          description: data.description,
          isDefault: true,
          entryUserId: adminUser.id,
          entryDateTime: new Date()
        })
      )
    }

    for (const data of DEFAULT_BRANCH) {
      if (data.name === 'Main') continue
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        await repo.save(
          repo.create({
            name: data.name,
            address: data.address,
            description: data.description,
            isDefault: data.isDefault,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      }
    }
    return mainBranch
  }

  private async seedAccounts(adminUser: MstUserEntity): Promise<void> {
    const repo = AppDataSource.getRepository(MstAccountEntity)
    const existing = await repo.find({ select: ['name'] })
    const existingNames = new Set(existing.map((a) => a.name))

    const toCreate = DEFAULT_ACCOUNT.filter((data) => !existingNames.has(data.name))

    if (toCreate.length > 0) {
      await repo.save(
        toCreate.map((data) =>
          repo.create({
            name: data.name,
            type: data.type,
            code: data.code,
            isDefault: data.isDefault,
            isLocked: data.isLocked,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      )
    }
  }

  private async seedRoles(adminUser: MstUserEntity): Promise<void> {
    const repo = AppDataSource.getRepository(MstRoleEntity)
    const existing = await repo.find({ select: ['code'] })
    const existingCodes = new Set(existing.map((a) => a.code))

    const toCreate = DEFAULT_ROLES.filter((data) => !existingCodes.has(data.code))

    if (toCreate.length > 0) {
      await repo.save(
        toCreate.map((data) =>
          repo.create({
            code: data.code,
            name: data.name,
            description: data.description,
            isDefault: data.isDefault,
            isLocked: data.isLocked,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      )
    }
  }

  private async seedTerms(adminUser: MstUserEntity): Promise<void> {
    const repo = AppDataSource.getRepository(MstTermEntity)
    const termsToSeed = [...DEFAULT_TERMS]
    if (!termsToSeed.find((t) => t.name === 'Cash')) {
      termsToSeed.push({
        name: 'Cash',
        numberOfDays: 0,
        isDefault: false,
        isLocked: true,
        entryUser: 'admin',
        entryDateTime: new Date()
      })
    }

    const existing = await repo.find({ select: ['name'] })
    const existingNames = new Set(existing.map((a) => a.name))

    const toCreate = termsToSeed.filter((data) => !existingNames.has(data.name))

    if (toCreate.length > 0) {
      await repo.save(
        toCreate.map((data) =>
          repo.create({
            name: data.name,
            numberOfDays: data.numberOfDays,
            isDefault: (data as any).isDefault || false,
            isLocked: data.isLocked,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      )
    }
  }

  private async seedTaxes(adminUser: MstUserEntity): Promise<void> {
    const repo = AppDataSource.getRepository(MstTaxEntity)
    const accountRepo = AppDataSource.getRepository(MstAccountEntity)

    for (const data of DEFAULT_TAX) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const account = await accountRepo.findOneBy({ name: data.account })
        if (!account) continue

        await repo.save(
          repo.create({
            code: data.code,
            name: data.name,
            rate: data.rate,
            accountId: account.id,
            isDefault: data.isDefault,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      }
    }
  }

  private async seedUnits(adminUser: MstUserEntity, mainBranch: MstBranchEntity): Promise<void> {
    const repo = AppDataSource.getRepository(MstUnitEntity)
    const existing = await repo.find({ select: ['name'] })
    const existingNames = new Set(existing.map((a) => a.name))

    const toCreate = DEFAULT_UNIT.filter((data) => !existingNames.has(data.name))

    if (toCreate.length > 0) {
      await repo.save(
        toCreate.map((data) =>
          repo.create({
            branchId: mainBranch.id,
            name: data.name,
            description: data.description,
            isDefault: data.isDefault,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      )
    }
  }

  private async seedPayTypes(adminUser: MstUserEntity, mainBranch: MstBranchEntity): Promise<void> {
    const repo = AppDataSource.getRepository(MstPayTypeEntity)
    const accountRepo = AppDataSource.getRepository(MstAccountEntity)

    for (const data of DEFAULT_PAY_TYPE) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const account = await accountRepo.findOneBy({ name: data.account })
        await repo.save(
          repo.create({
            name: data.name,
            accountId: account?.id || null,
            sortNumber: data.sortNumber,
            isDefault: data.isDefault,
            branchId: mainBranch.id,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      }
    }
  }

  private async seedDiscounts(
    adminUser: MstUserEntity,
    mainBranch: MstBranchEntity
  ): Promise<void> {
    const repo = AppDataSource.getRepository(MstDiscountEntity)

    for (const data of DEFAULT_DISCOUNT) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        await repo.save(
          repo.create({
            branchId: mainBranch.id,
            name: data.name,
            discountRate: data.discountRate,
            isVATExempt: data.isVATExempt,
            discountAlias: data.discountAlias,
            isDefault: data.isDefault,
            entryUserId: adminUser.id,
            entryDateTime: new Date(),
            dayMon: (data as any).isMonday || false,
            dayTue: (data as any).isTuesday || false,
            dayWed: (data as any).isWednesday || false,
            dayThu: (data as any).isThursday || false,
            dayFri: (data as any).isFriday || false,
            daySat: (data as any).isSaturday || false,
            daySun: (data as any).isSunday || false,
            isDateScheduled: (data as any).isDateScheduled || false,
            isDayScheduled: (data as any).isDayScheduled || false
          } as any)
        )
      }
    }
  }

  private async seedSuppliers(adminUser: MstUserEntity): Promise<void> {
    const repo = AppDataSource.getRepository(MstSupplierEntity)
    const termRepo = AppDataSource.getRepository(MstTermEntity)
    const accountRepo = AppDataSource.getRepository(MstAccountEntity)

    for (const data of DEFAULT_SUPPLIER) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        const term = await termRepo.findOneBy({ name: data.term })
        const account = await accountRepo.findOneBy({ name: data.account })

        if (!term || !account) {
          console.warn(
            `[SeederService] Term(${data.term}) or Account(${data.account}) not found for supplier ${data.name}. Skipping.`
          )
          continue
        }

        await repo.save(
          repo.create({
            name: data.name,
            address: data.address,
            telephoneNumber: data.telephoneNumber,
            cellphoneNumber: data.cellphoneNumber,
            faxNumber: data.faxNumber,
            termId: term.id,
            tin: data.tin,
            accountId: account.id,
            isLocked: data.isLocked,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      }
    }
  }

  private async seedTableGroups(
    adminUser: MstUserEntity,
    mainBranch: MstBranchEntity
  ): Promise<void> {
    const repo = AppDataSource.getRepository(MstTableGroupEntity)

    for (const data of DEFAULT_TABLE_GROUP) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        await repo.save(
          repo.create({
            branchId: mainBranch.id,
            name: data.name,
            isDefault: data.isDefault,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      }
    }
  }

  private async seedTables(adminUser: MstUserEntity): Promise<void> {
    const repo = AppDataSource.getRepository(MstTableEntity)
    const groupRepo = AppDataSource.getRepository(MstTableGroupEntity)

    for (const data of DEFAULT_TABLE) {
      const exists = await repo.findOneBy({ tableCode: data.tableCode })
      if (!exists) {
        const group = await groupRepo.findOneBy({ name: data.tableGroup })
        if (!group) continue

        await repo.save(
          repo.create({
            tableGroupId: group.id,
            tableCode: data.tableCode,
            isDefault: data.isDefault,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      }
    }
  }

  private async seedPeriods(adminUser: MstUserEntity, mainBranch: MstBranchEntity): Promise<void> {
    const repo = AppDataSource.getRepository(MstPeriodEntity)

    for (const data of DEFAULT_PERIOD) {
      const exists = await repo.findOneBy({ name: data.name })
      if (!exists) {
        await repo.save(
          repo.create({
            name: data.name,
            branchId: mainBranch.id,
            isDefault: data.isDefault,
            entryUserId: adminUser.id,
            entryDateTime: new Date()
          })
        )
      }
    }
  }

  private async seedTerminals(
    adminUser: MstUserEntity,
    mainBranch: MstBranchEntity
  ): Promise<void> {
    const repo = AppDataSource.getRepository(MstTerminalEntity)
    const existing = await repo.find({ select: ['name'] })
    const existingNames = new Set(existing.map((a) => a.name))

    for (const data of DEFAULT_TERMINAL) {
      if (existingNames.has(data.name)) continue

      await repo.save(
        repo.create({
          name: data.name,
          branchId: mainBranch.id,
          isDefault: data.isDefault,
          isLocked: data.isLocked,
          entryUserId: adminUser.id,
          entryDateTime: new Date()
        })
      )
    }
  }

  private async seedUsers(): Promise<MstUserEntity> {
    const repo = AppDataSource.getRepository(MstUserEntity)
    for (const data of DEFAULT_USERS) {
      const exists = await repo.findOneBy({ username: data.username })
      if (!exists) {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        await repo.save(
          repo.create({
            username: data.username,
            password: hashedPassword,
            fullName: data.fullName,
            type: data.type,
            email: data.email,
            status: data.status,
            isLocked: data.isLocked,
            isDefault: data.isDefault,
            entryDateTime: new Date()
          })
        )
      }
    }

    const admin = await repo.findOneBy({ username: 'admin' })
    if (!admin) throw new Error('[SeederService] Failed to seed admin user.')
    return admin
  }

  private async seedUserRoles(adminUser: MstUserEntity): Promise<void> {
    const userRoleRepo = AppDataSource.getRepository(MstUserRolesEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)
    const roleRepo = AppDataSource.getRepository(MstRoleEntity)

    for (const mapping of DEFAULT_USER_ROLES) {
      const user = await userRepo.findOneBy({ username: mapping.user })
      const role = await roleRepo.findOneBy({ code: mapping.role })

      if (user && role) {
        const exists = await userRoleRepo.findOneBy({ userId: user.id, roleId: role.id })
        if (!exists) {
          await userRoleRepo.save(
            userRoleRepo.create({
              userId: user.id,
              roleId: role.id,
              isDefault: true,
              entryUserId: adminUser.id,
              entryDateTime: new Date()
            })
          )
        }
      }
    }
  }

  private async seedBranchAccess(
    adminUser: MstUserEntity,
    mainBranch: MstBranchEntity
  ): Promise<void> {
    const repo = AppDataSource.getRepository(MstBranchAccessEntity)
    const userRepo = AppDataSource.getRepository(MstUserEntity)

    for (const data of DEFAULT_BRANCH_ACCESS) {
      const user = await userRepo.findOneBy({ username: data.user })
      if (user) {
        const exists = await repo.findOneBy({ userId: user.id, branchId: mainBranch.id })
        if (!exists) {
          await repo.save(
            repo.create({
              userId: user.id,
              branchId: mainBranch.id,
              entryUserId: adminUser.id,
              entryDateTime: new Date()
            })
          )
        }
      }
    }
  }

  private async seedAdministratorPermissions(adminUser: MstUserEntity): Promise<void> {
    const roleRepo = AppDataSource.getRepository(MstRoleEntity)
    const accessRightRepo = AppDataSource.getRepository(MstAccessRightEntity)
    const permissionRepo = AppDataSource.getRepository(MstPermissionsEntity)

    const adminRole = await roleRepo.findOneBy({ code: 'ADMINISTRATOR' })
    if (!adminRole) return

    const allAccessRights = await accessRightRepo.find()
    const existingPermissions = await permissionRepo.find({
      where: { roleId: adminRole.id },
      select: ['accessRightId']
    })

    const existingIds = new Set(existingPermissions.map((p) => p.accessRightId))
    const toCreate = allAccessRights.filter((ar) => !existingIds.has(ar.id))

    if (toCreate.length > 0) {
      const chunkSize = 50
      for (let i = 0; i < toCreate.length; i += chunkSize) {
        const chunk = toCreate.slice(i, i + chunkSize)
        await permissionRepo.save(
          chunk.map((ar) =>
            permissionRepo.create({
              roleId: adminRole.id,
              accessRightId: ar.id,
              entryUserId: adminUser.id,
              entryDateTime: new Date()
            })
          )
        )
      }
    }
  }
}

export const seederService = new SeederService()

