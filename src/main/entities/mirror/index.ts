import { Column, Entity } from 'typeorm'
import { MirrorBaseEntity } from '../generic/mirror.base.entity'

@Entity('MstUnit')
export class MirrorUnitEntity extends MirrorBaseEntity {
  constructor() {
    super()
    this.unit = ''
  }

  @Column({ name: 'Unit', type: 'nvarchar', length: 50 })
  unit: string
}

@Entity('MstTax')
export class MirrorTaxEntity extends MirrorBaseEntity {
  constructor() {
    super()
    this.tax = ''
    this.rate = 0
  }

  @Column({ name: 'Tax', type: 'nvarchar', length: 50 })
  tax: string

  @Column({ name: 'Rate', type: 'decimal', precision: 18, scale: 5 })
  rate: number
}

@Entity('MstItem')
export class MirrorItemEntity extends MirrorBaseEntity {
  constructor() {
    super()
    this.itemCode = ''
    this.barCode = ''
    this.itemDescription = ''
    this.price = 0
    this.category = ''
    this.unitId = 0
    this.outTaxId = 0
  }

  @Column({ name: 'ItemCode', type: 'nvarchar', length: 255 })
  itemCode: string

  @Column({ name: 'BarCode', type: 'nvarchar', length: 255 })
  barCode: string

  @Column({ name: 'ItemDescription', type: 'nvarchar', length: 255 })
  itemDescription: string

  @Column({ name: 'Price', type: 'decimal', precision: 18, scale: 5 })
  price: number

  @Column({ name: 'Category', type: 'nvarchar', length: 255, nullable: true })
  category: string

  @Column({ name: 'UnitId', type: 'int' })
  unitId: number

  @Column({ name: 'OutTaxId', type: 'int' })
  outTaxId: number
}

@Entity('MstUser')
export class MirrorUserEntity extends MirrorBaseEntity {
  constructor() {
    super()
    this.userName = ''
    this.fullName = ''
    this.password = ''
    this.userType = ''
  }

  @Column({ name: 'UserName', type: 'nvarchar', length: 50 })
  userName: string

  @Column({ name: 'FullName', type: 'nvarchar', length: 255 })
  fullName: string

  @Column({ name: 'Password', type: 'nvarchar', length: 255 })
  password: string // Store hash for offline login

  @Column({ name: 'UserType', type: 'nvarchar', length: 50 })
  userType: string
}

@Entity('MstDiscount')
export class MirrorDiscountEntity extends MirrorBaseEntity {
  constructor() {
    super()
    this.discount = ''
    this.discountRate = 0
    this.isVatExempt = false
    this.discountAlias = ''
  }

  @Column({ name: 'Discount', type: 'nvarchar', length: 250 })
  discount: string

  @Column({ name: 'DiscountRate', type: 'decimal', precision: 18, scale: 5 })
  discountRate: number

  @Column({ name: 'IsVatExempt', type: 'boolean', default: false })
  isVatExempt: boolean

  @Column({ name: 'DiscountAlias', type: 'nvarchar', length: 100 })
  discountAlias: string
}

@Entity('MstPayType')
export class MirrorPayTypeEntity extends MirrorBaseEntity {
  constructor() {
    super()
    this.payType = ''
    this.accountId = null
    this.sortNumber = null
  }

  @Column({ name: 'PayType', type: 'nvarchar', length: 50 })
  payType: string

  @Column({ name: 'AccountId', type: 'int', nullable: true })
  accountId: number | null

  @Column({ name: 'SortNumber', type: 'int', nullable: true })
  sortNumber: number | null
}

@Entity('MstBranch')
export class MirrorBranchEntity extends MirrorBaseEntity {
  constructor() {
    super()
    this.name = ''
    this.address = ''
    this.isDefault = false
  }

  @Column({ name: 'Name', type: 'nvarchar', length: 250 })
  name: string

  @Column({ name: 'Address', type: 'text', nullable: true })
  address: string

  @Column({ name: 'IsDefault', type: 'boolean', default: false })
  isDefault: boolean
}

@Entity('MstTerminal')
export class MirrorTerminalEntity extends MirrorBaseEntity {
  constructor() {
    super()
    this.name = ''
    this.isDefault = false
  }

  @Column({ name: 'Name', type: 'nvarchar', length: 50 })
  name: string

  @Column({ name: 'IsDefault', type: 'boolean', default: false })
  isDefault: boolean
}

@Entity('MstCustomer')
export class MirrorCustomerEntity extends MirrorBaseEntity {
  constructor() {
    super()
    this.customer = ''
    this.address = ''
    this.contactPerson = ''
    this.contactNumber = ''
    this.tin = ''
  }

  @Column({ name: 'Customer', type: 'nvarchar', length: 50 })
  customer: string

  @Column({ name: 'Address', type: 'nvarchar', length: 255 })
  address: string

  @Column({ name: 'ContactPerson', type: 'nvarchar', length: 50 })
  contactPerson: string

  @Column({ name: 'ContactNumber', type: 'nvarchar', length: 50 })
  contactNumber: string

  @Column({ name: 'TIN', type: 'nvarchar', length: 50 })
  tin: string
}
