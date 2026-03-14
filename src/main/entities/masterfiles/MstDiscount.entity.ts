// CREATE TABLE [dbo].[MstDiscount](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Discount] [nvarchar](50) NOT NULL,
// 	[DiscountRate] [decimal](18, 5) NOT NULL,
// 	[IsVatExempt] [bit] NOT NULL,
// 	[IsDateScheduled] [bit] NOT NULL,
// 	[DateStart] [datetime] NULL,
// 	[DateEnd] [datetime] NULL,
// 	[IsTimeScheduled] [bit] NOT NULL,
// 	[TimeStart] [datetime] NULL,
// 	[TimeEnd] [datetime] NULL,
// 	[IsDayScheduled] [bit] NOT NULL,
// 	[DayMon] [bit] NOT NULL,
// 	[DayTue] [bit] NOT NULL,
// 	[DayWed] [bit] NOT NULL,
// 	[DayThu] [bit] NOT NULL,
// 	[DayFri] [bit] NOT NULL,
// 	[DaySat] [bit] NOT NULL,
// 	[DaySun] [bit] NOT NULL,
// 	[EntryUserId] [int] NOT NULL,
// 	[EntryDateTime] [datetime] NOT NULL,
// 	[UpdateUserId] [int] NOT NULL,
// 	[UpdateDateTime] [datetime] NOT NULL,
// 	[IsLocked] [bit] NOT NULL,
// 	[DiscountAlias] [nvarchar](100) NULL,

import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_DISCOUNT)
export class MstDiscountEntity extends BaseEntity {
  constructor() {
    super()
    this.discount = ''
    this.discountRate = 0
    this.isVatExempt = false
    this.isDateScheduled = false
    this.dateStart = new Date()
    this.dateEnd = new Date()
    this.isTimeScheduled = false
    this.timeStart = new Date()
    this.timeEnd = new Date()
    this.isDayScheduled = false
    this.dayMon = false
    this.dayTue = false
    this.dayWed = false
    this.dayThu = false
    this.dayFri = false
    this.daySat = false
    this.daySun = false
    this.discountAlias = ''
  }

  @Column({ name: 'Discount', type: 'nvarchar', length: 250, nullable: false })
  discount: string

  @Column({ name: 'DiscountRate', type: 'decimal', nullable: false })
  discountRate: number

  @Column({ name: 'IsVatExempt', type: 'bit', nullable: false })
  isVatExempt: boolean  

  @Column({ name: 'IsDateScheduled', type: 'bit', nullable: false })
  isDateScheduled: boolean

  @Column({ name: 'DateStart', type: 'datetime', nullable: false })
  dateStart: Date

  @Column({ name: 'DateEnd', type: 'datetime', nullable: false })
  dateEnd: Date

  @Column({ name: 'IsTimeScheduled', type: 'bit', nullable: false })
  isTimeScheduled: boolean

  @Column({ name: 'TimeStart', type: 'datetime', nullable: false })
  timeStart: Date

  @Column({ name: 'TimeEnd', type: 'datetime', nullable: false })
  timeEnd: Date

  @Column({ name: 'IsDayScheduled', type: 'bit', nullable: false })
  isDayScheduled: boolean

  @Column({ name: 'DayMon', type: 'bit', nullable: false })
  dayMon: boolean

  @Column({ name: 'DayTue', type: 'bit', nullable: false })
  dayTue: boolean

  @Column({ name: 'DayWed', type: 'bit', nullable: false })
  dayWed: boolean

  @Column({ name: 'DayThu', type: 'bit', nullable: false })
  dayThu: boolean

  @Column({ name: 'DayFri', type: 'bit', nullable: false })
  dayFri: boolean

  @Column({ name: 'DaySat', type: 'bit', nullable: false })
  daySat: boolean

  @Column({ name: 'DaySun', type: 'bit', nullable: false })
  daySun: boolean

  @Column({ name: 'DiscountAlias', type: 'nvarchar', length: 100, nullable: false })
  discountAlias: string
}
