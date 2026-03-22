
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.SYS_NOTIFICATION)
export class SysNotificationEntity {
  constructor() {
    this.notificationDate = new Date()
    this.userId = 0
    this.link = ''
    this.notificationDescription = ''
    this.notificationType = 'Info' // Info, Warning, Error
    this.isRead = false
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id!: number

  @Column({ name: 'NotificationDate', type: 'datetimeoffset', nullable: false })
  notificationDate: Date

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number

  @Column({ name: 'Link', type: 'nvarchar', length: 255, nullable: false })
  link: string

  @Column({ name: 'NotificationDescription', type: 'nvarchar', length: 255, nullable: false })
  notificationDescription: string

  @Column({ name: 'NotificationType', type: 'nvarchar', length: 50, nullable: false })
  notificationType: string

  @Column({ name: 'IsRead', type: 'bit', default: false })
  isRead: boolean
}
