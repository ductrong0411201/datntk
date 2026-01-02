import { apiClient } from "./base.api"
import type { CourceStudent, Cource, CourceListResponse, CourceResponse, CreateCourceData } from "../@types/cource"

export const getCourcesApi = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  search?: string,
  filters?: Record<string, any>
): Promise<CourceListResponse["data"]> => {
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
  
  const response = await apiClient.get<CourceListResponse>("/cources", { params })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách khóa học thất bại")
}

export const getCourceByIdApi = async (id: number): Promise<Cource> => {
  const response = await apiClient.get<CourceResponse>(`/cources/${id}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin khóa học thất bại")
}

export const createCourceApi = async (data: CreateCourceData): Promise<Cource> => {
  const response = await apiClient.post<CourceResponse>("/cources", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo khóa học thất bại")
}

export const updateCourceApi = async (id: number, data: Partial<Omit<Cource, "id" | "createdAt" | "updatedAt" | "subject" | "teacher">>): Promise<Cource> => {
  const response = await apiClient.put<CourceResponse>(`/cources/${id}`, data)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Cập nhật khóa học thất bại")
}

export const deleteCourceApi = async (id: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/cources/${id}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa khóa học thất bại")
}

export const getCourceStudentsApi = async (courceId: number): Promise<CourceStudent[]> => {
  const response = await apiClient.get<{ status: number; data: CourceStudent[]; message: string }>(`/cources/${courceId}/students`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách học sinh thất bại")
}

export const addStudentToCourceApi = async (courceId: number, studentId: number): Promise<CourceStudent> => {
  const response = await apiClient.post<{ status: number; data: CourceStudent; message: string }>(`/cources/${courceId}/students`, { student_id: studentId })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Thêm học sinh vào khóa học thất bại")
}

export const removeStudentFromCourceApi = async (courceId: number, studentId: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/cources/${courceId}/students/${studentId}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa học sinh khỏi khóa học thất bại")
}

