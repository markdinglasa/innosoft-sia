export interface Response {
  IsSomething?: boolean
  List?: any[]
  Data?: any | null
  Option?: string | null
  Message: string
}

export interface CommonResponse {
  success: boolean
  message: string
  data?: unknown
} 