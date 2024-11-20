export interface User {
  Id: number
  UserName: string
  Password?: string
  FullName?: string
  UserCardNumber?: string | null
  EntryUserId?: number
  EntryDateTime?: string
  UpdateUserId?: number | null
  UpdateDateTime?: string | null
  IsLocked?: number
}

export interface LogData {
  UserName: string
  Password: string
}

export interface UserManager {
  UserTable: Array<User> | []
}
