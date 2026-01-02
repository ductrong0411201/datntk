export interface Payment {
  id: number
  user_id: number
  payment_method_id: number
  course_id: number
  price: number
  description?: string
  date: string
  createdAt?: string
  updatedAt?: string
  user?: {
    id: number
    name: string
    userName: string
    email: string
  }
  paymentMethod?: {
    id: number
    name: string
    description?: string
  }
  course?: {
    id: number
    name: string
    price: number
  }
}

export interface PaymentListResponse {
  status: number
  data: {
    items: Payment[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message: string
}

export interface PaymentResponse {
  status: number
  data: Payment
  message: string
}

