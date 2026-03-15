import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.TRN_SALES_DRAFT)
export class TrnSalesDraftEntity {
  constructor() {
    this.id = 0
    this.docRef = ''
    this.docDate = new Date()
    this.itemCode = ''
    this.itemId = 0
    this.price = 0
    this.quantity = 0
    this.amount = 0
    this.customerCode = ''
    this.customer = ''
    this.contactPerson = ''
    this.address = ''
    this.phoneNumber = ''
    this.mobilePhoneNumber = ''
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'DocRef', type: 'nvarchar', length: 50, nullable: false })
  docRef: string

  @Column({ name: 'DocDate', type: 'datetimeoffset', nullable: false })
  docDate: Date

  @Column({ name: 'ItemCode', type: 'nvarchar', length: 50, nullable: false })
  itemCode: string

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'Price', type: 'decimal', precision: 18, scale: 5, nullable: false })
  price: number

  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 5, nullable: false })
  quantity: number

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  @Column({ name: 'CustomerCode', type: 'nvarchar', length: 255, nullable: false })
  customerCode: string

  @Column({ name: 'Customer', type: 'nvarchar', length: 255, nullable: false })
  customer: string

  @Column({ name: 'ContactPerson', type: 'nvarchar', length: 255, nullable: false })
  contactPerson: string

  @Column({ name: 'Address', type: 'nvarchar', length: 255, nullable: false })
  address: string

  @Column({ name: 'PhoneNumber', type: 'nvarchar', length: 255, nullable: false })
  phoneNumber: string

  @Column({ name: 'MobilePhoneNumber', type: 'nvarchar', length: 255, nullable: false })
  mobilePhoneNumber: string
}
