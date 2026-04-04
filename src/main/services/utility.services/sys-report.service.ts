import { getRepository } from 'typeorm'
import { TrnOrderEntity } from '../../entities/transactions/TrnOrder.entity'
import { TrnCollectionEntity } from '../../entities/transactions/TrnCollection.entity'
import { TrnShiftEntity } from '../../entities/transactions/TrnShift.entity'

export interface ShiftSummary {
  shiftId: number
  userName: string
  terminalName: string
  openDate: Date
  closeDate?: Date
  startingCash: number
  totalGrossSales: number
  totalNetSales: number
  totalDiscount: number
  totalTax: number
  totalCashPayments: number
  totalOtherPayments: number
  totalCollected: number
  transactionCount: number
}

export class ReportService {
  /**
   * Generates a summary for a specific shift (X-Reading).
   */
  async getXReading(shiftId: number): Promise<ShiftSummary> {
    const shiftRepo = getRepository(TrnShiftEntity)
    const orderRepo = getRepository(TrnOrderEntity)
    const collectionRepo = getRepository(TrnCollectionEntity)

    const shift = await shiftRepo.findOne({ 
      where: { id: shiftId },
      relations: ['user', 'terminal']
    })

    if (!shift) throw new Error('Shift not found.')

    // Aggregate Orders within shift time range for this terminal and user
    // In our simplified model, we correlate orders to the shift owner and terminal
    // A more robust way would be adding shiftId to TrnOrder directly, but for now we query by criteria
    // Actually, FEAT-TRX-011 and my previous implementation implies we should keep track of shiftId
    
    // Total Orders logic
    const orders = await orderRepo.find({
      where: { 
        terminalId: shift.terminalId,
        preparedBy: shift.userId,
        isCancelled: false
      }
    })

    // Filter orders between shift open and close (if closed)
    const shiftOrders = orders.filter(o => 
      o.orderDate >= shift.openDate && 
      (!shift.closeDate || o.orderDate <= shift.closeDate)
    )

    const totalGrossSales = shiftOrders.reduce((sum, o) => sum + Number(o.amount), 0)
    
    // Aggregation logic for collections
    const collections = await collectionRepo.find({
      where: { 
        terminalId: shift.terminalId,
        preparedBy: shift.userId,
        isCancelled: false
      },
      relations: ['collectionLines', 'collectionLines.payType']
    })

    const shiftCollections = collections.filter(c => 
      c.collectionDate >= shift.openDate && 
      (!shift.closeDate || c.collectionDate <= shift.closeDate)
    )

    let totalCashPayments = 0
    let totalOtherPayments = 0
    let totalCollected = 0

    shiftCollections.forEach(c => {
      totalCollected += Number(c.amount)
      c.collectionLines?.forEach(line => {
        if (line.payType?.name.toLowerCase().includes('cash')) {
          totalCashPayments += Number(line.amount)
        } else {
          totalOtherPayments += Number(line.amount)
        }
      })
    })

    return {
      shiftId: shift.id,
      userName: shift.user?.fullName || 'Unknown',
      terminalName: shift.terminal?.name || 'Terminal',
      openDate: shift.openDate,
      closeDate: shift.closeDate,
      startingCash: Number(shift.startingCash),
      totalGrossSales,
      totalNetSales: totalGrossSales, 
      totalDiscount: 0,
      totalTax: 0, 
      totalCashPayments,
      totalOtherPayments,
      totalCollected,
      transactionCount: shiftOrders.length
    }
  }

  /**
   * Generates a daily summary for a terminal (Z-Reading).
   */
  async getZReading(_terminalId: number, _date: Date): Promise<any> {
     // Implementation for daily terminal aggregation across shifts
     return { message: 'Z-Reading logic to be finalized.' }
  }
}
