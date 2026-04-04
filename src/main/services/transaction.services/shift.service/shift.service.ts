import { DeepPartial } from 'typeorm'
import { BadRequestException } from '../../../common/exceptions'
import { TrnShiftEntity } from '../../../entities/transactions/TrnShift.entity'
import { BaseService } from '../../base.service'
import { MutationResponse } from '@shared/types/pagination'

export interface IShiftService {
  openShift(userId: number, terminalId: number, startingCash: number): Promise<MutationResponse<TrnShiftEntity>>
  closeShift(shiftId: number, endingCash: number, remarks?: string): Promise<MutationResponse<TrnShiftEntity>>
  getCurrentShift(userId: number, terminalId: number): Promise<TrnShiftEntity | null>
  verifyActiveShift(userId: number, terminalId: number): Promise<void>
}


export class ShiftService extends BaseService<TrnShiftEntity> implements IShiftService {
  constructor() {
    super(TrnShiftEntity)
  }

  /**
   * Retrieves the currently active shift for a given user and terminal.
   */
  async getCurrentShift(userId: number, terminalId: number): Promise<TrnShiftEntity | null> {
    return await this.repository.findOne({
      where: {
        userId,
        terminalId,
        status: 'Open'
      },
      order: { openDate: 'DESC' }
    })
  }

  /**
   * Opens a new shift. Validates that no other shift is currently open for the same user/terminal.
   */
  async openShift(userId: number, terminalId: number, startingCash: number): Promise<MutationResponse<TrnShiftEntity>> {
    const existing = await this.getCurrentShift(userId, terminalId)
    if (existing) {
      throw new BadRequestException('A shift is already open for this user and terminal.')
    }

    const shiftData: DeepPartial<TrnShiftEntity> = {
      userId,
      terminalId,
      status: 'Open',
      openDate: new Date(),
      startingCash,
      expectedCash: startingCash,
      totalSales: 0,
      totalCollections: 0,
      totalDisbursements: 0
    }

    return await this.create(shiftData, userId)
  }

  /**
   * Closes an existing shift, calculating totals and variances.
   */
  async closeShift(shiftId: number, endingCash: number, remarks?: string): Promise<MutationResponse<TrnShiftEntity>> {
    const shift = await this.get(shiftId)
    if (!shift) {
      throw new BadRequestException('Shift not found.')
    }
    if (shift.status === 'Closed') {
      throw new BadRequestException('Shift is already closed.')
    }

    // TODO: Ideally, we should recalculate totals from TrnCollection and TrnDisbursement here
    // to ensure ExpectedCash is up-to-date before closing.
    
    const updateData: Partial<TrnShiftEntity> = {
      status: 'Closed',
      closeDate: new Date(),
      endingCash,
      remarks
    }

    return await this.update(shiftId, updateData, shift.userId)
  }

  /**
   * Verifies that an active shift exists. Throws if not.
   */
  async verifyActiveShift(userId: number, terminalId: number): Promise<void> {
    const shift = await this.getCurrentShift(userId, terminalId)
    if (!shift) {
      throw new BadRequestException('Action denied. No active shift found for this terminal/user.')
    }
  }
}

