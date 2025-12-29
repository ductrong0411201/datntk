import { apiClient } from "./base.api"

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

export const getPaymentsApi = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  search?: string,
  filters?: Record<string, any>
): Promise<PaymentListResponse["data"]> => {
  const params: any = { page, limit }
  if (sortBy) {
    params.sortBy = sortBy
    params.sortOrder = sortOrder || "ASC"
  }
  if (search && search.trim()) {
    params.search = search.trim()
  }
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
        params[key] = filters[key]
      }
    })
  }
  
  const response = await apiClient.get<PaymentListResponse>("/payments", { params })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách thanh toán thất bại")
}

export const getPaymentByIdApi = async (id: number): Promise<Payment> => {
  const response = await apiClient.get<PaymentResponse>(`/payments/${id}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin thanh toán thất bại")
}

export const createPaymentApi = async (data: Omit<Payment, "id" | "createdAt" | "updatedAt" | "user" | "paymentMethod" | "course">): Promise<Payment> => {
  const response = await apiClient.post<PaymentResponse>("/payments", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo thanh toán thất bại")
}

export const updatePaymentApi = async (id: number, data: Partial<Omit<Payment, "id" | "createdAt" | "updatedAt" | "user" | "paymentMethod" | "course">>): Promise<Payment> => {
  const response = await apiClient.put<PaymentResponse>(`/payments/${id}`, data)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Cập nhật thanh toán thất bại")
}

export const deletePaymentApi = async (id: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/payments/${id}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa thanh toán thất bại")
}

