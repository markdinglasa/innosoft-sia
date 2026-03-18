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
