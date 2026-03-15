import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'
import { TrnDebitCreditMemoEntity } from './TrnDebitCreditMemo.entity'
import { TrnOrderEntity } from './TrnOrder.entity'
import { MstAccountEntity } from '../masterfiles/MstAccount.entity'

@Entity(POSEntity.TRN_DEBIT_CREDIT_MEMO_LINE)
export class TrnDebitCreditMemoLineEntity {
  constructor() {
    this.id = 0
    this.dcMemoId = 0
    this.orderId = null
    this.accountId = 0
    this.particulars = null
    this.debitAmount = 0
    this.creditAmount = 0
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'DCMemoId', type: 'int', nullable: false })
  dcMemoId: number

  @Column({ name: 'OrderId', type: 'int', nullable: true })
  orderId: number | null

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  @Column({ name: 'Particulars', type: 'nvarchar', length: 255, nullable: true })
  particulars: string | null

  @Column({ name: 'DebitAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  debitAmount: number

  @Column({ name: 'CreditAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  creditAmount: number

  // FK Relationships
  @ManyToOne(() => TrnDebitCreditMemoEntity)
  @JoinColumn({ name: 'DCMemoId' })
  dcMemo?: TrnDebitCreditMemoEntity

  @ManyToOne(() => TrnOrderEntity)
  @JoinColumn({ name: 'OrderId' })
  order?: TrnOrderEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity
}
