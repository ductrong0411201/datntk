import { apiClient } from "./base.api"

export interface Lesson {
  id: number
  name: string
  start: string
  end: string
}

export interface Cource {
  id: number
  name: string
  subject_id: number
  grade: number
  start_date: string
  end_date: string
  description?: string
  teacher_id: number
  price: number
  createdAt?: string
  updatedAt?: string
  subject?: {
    id: number
    name: string
  }
  teacher?: {
    id: number
    name: string
    userName: string
    email: string
  }
  lessons?: Lesson[]
}

export interface CourceListResponse {
  status: number
  data: {
    items: Cource[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message: string
}

export interface CourceResponse {
  status: number
  data: Cource
  message: string
}

export interface LessonConfig {
  id?: string
  name?: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface CreateCourceData {
  name: string
  subject_id: number
  grade: number
  start_date: string
  end_date: string
  description?: string
  teacher_id: number
  price: number
  lessonDays: LessonConfig[]
}

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

