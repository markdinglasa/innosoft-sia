export interface PaginationOptionsDto {
  page?: number
  limit?: number
  search?: string
  orderBy?: string
  order?: 'ASC' | 'DESC'
  filters?: Record<string, any>[]
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

export interface MutationResponse<T> {
  metadata?: T | T[]
  success: boolean
  message: string
}
