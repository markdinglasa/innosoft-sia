import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'
import { MstAccountEntity } from '../masterfiles/MstAccount.entity'
import { TrnCollectionEntity } from './TrnCollection.entity'
import { TrnDebitCreditMemoEntity } from './TrnDebitCreditMemo.entity'
import { TrnDisbursementEntity } from './TrnDisbursement.entity'
import { TrnOrderEntity } from './TrnOrder.entity'
import { TrnStockInEntity } from './TrnStockIn.entity'
import { TrnStockOutEntity } from './TrnStockOut.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'

@Entity(POSEntity.TRN_JOURNAL)
export class TrnJournalEntity {
  constructor() {
    this.id = 0
    this.journalDate = new Date()
    this.journalRefDocument = ''
    this.accountId = 0
    this.debitAmount = 0
    this.creditAmount = 0
    this.orderId = null
    this.stockInId = null
    this.stockOutId = null
    this.collectionId = null
    this.dcMemoId = null
    this.disbursementId = null
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'JournalDate', type: 'datetimeoffset', nullable: false })
  journalDate: Date

  @Column({ name: 'JournalRefDocument', type: 'nvarchar', length: 50, nullable: false })
  journalRefDocument: string

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  @Column({ name: 'DebitAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  debitAmount: number

  @Column({ name: 'CreditAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  creditAmount: number

  @Column({ name: 'OrderId', type: 'int', nullable: true })
  orderId: number | null

  @Column({ name: 'StockInId', type: 'int', nullable: true })
  stockInId: number | null

  @Column({ name: 'StockOutId', type: 'int', nullable: true })
  stockOutId: number | null

  @Column({ name: 'CollectionId', type: 'int', nullable: true })
  collectionId: number | null

  @Column({ name: 'DCMemoId', type: 'int', nullable: true })
  dcMemoId: number | null

  @Column({ name: 'DisbursementId', type: 'int', nullable: true })
  disbursementId: number | null

  // FK Relationships
  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity

  @ManyToOne(() => TrnCollectionEntity)
  @JoinColumn({ name: 'CollectionId' })
  collection?: TrnCollectionEntity

  @ManyToOne(() => TrnDebitCreditMemoEntity)
  @JoinColumn({ name: 'DCMemoId' })
  dcMemo?: TrnDebitCreditMemoEntity

  @ManyToOne(() => TrnDisbursementEntity)
  @JoinColumn({ name: 'DisbursementId' })
  disbursement?: TrnDisbursementEntity

  @ManyToOne(() => TrnOrderEntity)
  @JoinColumn({ name: 'OrderId' })
  order?: TrnOrderEntity

  @ManyToOne(() => TrnStockInEntity)
  @JoinColumn({ name: 'StockInId' })
  stockIn?: TrnStockInEntity

  @ManyToOne(() => TrnStockOutEntity)
  @JoinColumn({ name: 'StockOutId' })
  stockOut?: TrnStockOutEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'EntryUserId' })
  entryUser?: MstUserEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'UpdateUserId' })
  updateUser?: MstUserEntity
}
