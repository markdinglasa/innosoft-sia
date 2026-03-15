export interface IpcResponseItem<T = any> {
  success: boolean
  data?: T
  error?: IpcErrorResponse
}

export interface IpcErrorResponse {
  message: string
  statusCode: number
  metadata?: any
}
