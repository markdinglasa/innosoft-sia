import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from "../generic"
import { MstAccountEntity } from '../masterfiles/MstAccount.entity'
import { MstPayTypeEntity } from '../masterfiles/MstPayType.entity'
import { TrnCollectionEntity } from './TrnCollection.entity'
import { TrnStockInEntity } from './TrnStockIn.entity'

@Entity(POSEntity.TRN_COLLECTION_LINE)
export class TrnCollectionLineEntity extends BaseEntity {
  constructor() {
    super()
    this.collectionId = 0
    this.amount = 0
    this.payTypeId = 0
    this.checkNumber = null
    this.checkDate = null
    this.checkBank = null
    this.creditCardVerificationCode = null
    this.creditCardNumber = null
    this.creditCardType = null
    this.creditCardBank = null
    this.giftCertificateNumber = null
    this.otherInformation = null
    this.stockInId = null
    this.accountId = 0
    this.creditCardReferenceNumber = null
    this.creditCardHolderName = null
    this.creditCardExpiry = null
  }

  @Column({ name: 'CollectionId', type: 'int', nullable: false })
  collectionId: number

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  @Column({ name: 'PayTypeId', type: 'int', nullable: false })
  payTypeId: number

  @Column({ name: 'CheckNumber', type: 'nvarchar', length: 50, nullable: true })
  checkNumber: string | null

  @Column({ name: 'CheckDate', type: 'datetimeoffset', nullable: true })
  checkDate: Date | null

  @Column({ name: 'CheckBank', type: 'nvarchar', length: 50, nullable: true })
  checkBank: string | null

  @Column({ name: 'CreditCardVerificationCode', type: 'nvarchar', length: 50, nullable: true })
  creditCardVerificationCode: string | null

  @Column({ name: 'CreditCardNumber', type: 'nvarchar', length: 50, nullable: true })
  creditCardNumber: string | null

  @Column({ name: 'CreditCardType', type: 'nvarchar', length: 50, nullable: true })
  creditCardType: string | null

  @Column({ name: 'CreditCardBank', type: 'nvarchar', length: 50, nullable: true })
  creditCardBank: string | null

  @Column({ name: 'GiftCertificateNumber', type: 'nvarchar', length: 50, nullable: true })
  giftCertificateNumber: string | null

  @Column({ name: 'OtherInformation', type: 'nvarchar', length: 255, nullable: true })
  otherInformation: string | null

  @Column({ name: 'StockInId', type: 'int', nullable: true })
  stockInId: number | null

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  @Column({ name: 'CreditCardReferenceNumber', type: 'nvarchar', length: 50, nullable: true })
  creditCardReferenceNumber: string | null

  @Column({ name: 'CreditCardHolderName', type: 'nvarchar', length: 100, nullable: true })
  creditCardHolderName: string | null

  @Column({ name: 'CreditCardExpiry', type: 'nvarchar', length: 50, nullable: true })
  creditCardExpiry: string | null

  // FK Relationships
  @ManyToOne(() => TrnCollectionEntity)
  @JoinColumn({ name: 'CollectionId' })
  collection?: TrnCollectionEntity

  @ManyToOne(() => MstPayTypeEntity)
  @JoinColumn({ name: 'PayTypeId' })
  payType?: MstPayTypeEntity

  @ManyToOne(() => TrnStockInEntity)
  @JoinColumn({ name: 'StockInId' })
  stockIn?: TrnStockInEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity
}
