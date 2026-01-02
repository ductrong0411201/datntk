import { apiClient } from "./base.api"
import type { PaymentMethod, PaymentMethodListResponse, PaymentMethodResponse } from "../@types/paymentMethod"

export const getPaymentMethodsApi = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  search?: string,
  filters?: Record<string, any>
): Promise<PaymentMethodListResponse["data"]> => {
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
  
  const response = await apiClient.get<PaymentMethodListResponse>("/payment-methods", { params })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách phương thức thanh toán thất bại")
}

export const getPaymentMethodByIdApi = async (id: number): Promise<PaymentMethod> => {
  const response = await apiClient.get<PaymentMethodResponse>(`/payment-methods/${id}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin phương thức thanh toán thất bại")
}

export const createPaymentMethodApi = async (data: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">): Promise<PaymentMethod> => {
  const response = await apiClient.post<PaymentMethodResponse>("/payment-methods", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo phương thức thanh toán thất bại")
}

export const updatePaymentMethodApi = async (id: number, data: Partial<Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">>): Promise<PaymentMethod> => {
  const response = await apiClient.put<PaymentMethodResponse>(`/payment-methods/${id}`, data)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Cập nhật phương thức thanh toán thất bại")
}

export const deletePaymentMethodApi = async (id: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/payment-methods/${id}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa phương thức thanh toán thất bại")
}

