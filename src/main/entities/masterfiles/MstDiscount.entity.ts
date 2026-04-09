import { AfterLoad, Column, Entity, OneToMany } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstDiscountItemEntity } from './MstDiscountItem.entity'

@Entity(POSEntity.MST_DISCOUNT)
export class MstDiscountEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.name = ''
    this.discountRate = 0
    this.isVATExempt = false
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
    this.mandated = false
    this.isDefault = false
  }
  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'Discount', type: 'nvarchar', length: 250, nullable: false })
  name: string

  @Column({ name: 'DiscountRate', type: 'decimal', nullable: false })
  discountRate: number

  @Column({ name: 'IsVATExempt', type: 'bit', nullable: false })
  isVATExempt: boolean

  @Column({ name: 'IsDateScheduled', type: 'bit', nullable: false })
  isDateScheduled: boolean

  @Column({ name: 'DateStart', type: 'datetimeoffset', nullable: false })
  dateStart: Date

  @Column({ name: 'DateEnd', type: 'datetimeoffset', nullable: false })
  dateEnd: Date

  @Column({ name: 'IsTimeScheduled', type: 'bit', nullable: false })
  isTimeScheduled: boolean

  @Column({ name: 'TimeStart', type: 'datetimeoffset', nullable: false })
  timeStart: Date

  @Column({ name: 'TimeEnd', type: 'datetimeoffset', nullable: false })
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


  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean

  // Virtual property set after loading from DB
  mandated: boolean

  static mandatedDiscounts = [
    'PWD',
    'Senior Citizen Discount',
    'MOV',
    'Athlete Discount',
    'National Athlete',
    'Single Parent'
  ]

  @AfterLoad()
  setMandated() {
    this.mandated = MstDiscountEntity.mandatedDiscounts.includes(this.name)
  }

  @OneToMany(() => MstDiscountItemEntity, (discountItem) => discountItem.discount)
  discountItems?: MstDiscountItemEntity[]
}
