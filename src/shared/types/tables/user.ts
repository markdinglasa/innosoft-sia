export interface User {
  UserName: string
  Password: string
  FullName: string
  UserCardNumber: string
  EntryUserId: number
  EntryDateTime: Date
  UpdateUserId: number
  UpdateDateTime: Date
  IsLocked: number
}

export interface LogData {
  UserName: string
  Password: string
}
