export interface PaymentMethod {
  id: number
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface PaymentMethodListResponse {
  status: number
  data: {
    items: PaymentMethod[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message: string
}

export interface PaymentMethodResponse {
  status: number
  data: PaymentMethod
  message: string
}

