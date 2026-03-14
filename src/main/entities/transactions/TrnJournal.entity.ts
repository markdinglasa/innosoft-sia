import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.TRN_JOURNAL)
export class TrnJournalEntity {
  constructor() {
    this.id = 0
    this.journalDate = new Date()
    this.journalRefDocument = ''
    this.accountId = 0
    this.debitAmount = 0
    this.creditAmount = 0
    this.salesId = null
    this.stockInId = null
    this.stockOutId = null
    this.collectionId = null
    this.dcMemoId = null
    this.disbursementId = null
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'JournalDate', type: 'datetime', nullable: false })
  journalDate: Date

  @Column({ name: 'JournalRefDocument', type: 'nvarchar', length: 50, nullable: false })
  journalRefDocument: string

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  @Column({ name: 'DebitAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  debitAmount: number

  @Column({ name: 'CreditAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  creditAmount: number

  @Column({ name: 'SalesId', type: 'int', nullable: true })
  salesId: number | null

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
}
