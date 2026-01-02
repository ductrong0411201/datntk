import { apiClient } from "./base.api"
import type { Subject, SubjectListResponse, SubjectResponse } from "../@types/subject"

export const getSubjectsApi = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  search?: string,
  filters?: Record<string, any>
): Promise<SubjectListResponse["data"]> => {
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
  
  const response = await apiClient.get<SubjectListResponse>("/subjects", { params })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách môn học thất bại")
}

export const getSubjectByIdApi = async (id: number): Promise<Subject> => {
  const response = await apiClient.get<SubjectResponse>(`/subjects/${id}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin môn học thất bại")
}

export const createSubjectApi = async (data: Omit<Subject, "id" | "createdAt" | "updatedAt">): Promise<Subject> => {
  const response = await apiClient.post<SubjectResponse>("/subjects", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo môn học thất bại")
}

export const updateSubjectApi = async (id: number, data: Partial<Omit<Subject, "id" | "createdAt" | "updatedAt">>): Promise<Subject> => {
  const response = await apiClient.put<SubjectResponse>(`/subjects/${id}`, data)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Cập nhật môn học thất bại")
}

export const deleteSubjectApi = async (id: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/subjects/${id}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa môn học thất bại")
}

