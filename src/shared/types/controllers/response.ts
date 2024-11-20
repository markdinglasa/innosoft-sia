import { SIATables } from '../tables'

export interface Response {
  IsSomething?: boolean
  List?: SIATables
  Data?: any | null
  Option?: string | null
  Message: string
}
