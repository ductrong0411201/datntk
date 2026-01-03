import { apiClient } from "./base.api"
import type { CourseStudent, Course, CourseListResponse, CourseResponse, CreateCourseData } from "../@types/course"

export const getCoursesApi = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  search?: string,
  filters?: Record<string, any>
): Promise<CourseListResponse["data"]> => {
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
  
  const response = await apiClient.get<CourseListResponse>("/courses", { params })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách khóa học thất bại")
}

export const getCourseByIdApi = async (id: number): Promise<Course> => {
  const response = await apiClient.get<CourseResponse>(`/courses/${id}`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy thông tin khóa học thất bại")
}

export const createCourseApi = async (data: CreateCourseData): Promise<Course> => {
  const response = await apiClient.post<CourseResponse>("/courses", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo khóa học thất bại")
}

export const updateCourseApi = async (id: number, data: Partial<Omit<Course, "id" | "createdAt" | "updatedAt" | "subject" | "teacher">>): Promise<Course> => {
  const response = await apiClient.put<CourseResponse>(`/courses/${id}`, data)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Cập nhật khóa học thất bại")
}

export const deleteCourseApi = async (id: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/courses/${id}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa khóa học thất bại")
}

export const getCourseStudentsApi = async (courseId: number): Promise<CourseStudent[]> => {
  const response = await apiClient.get<{ status: number; data: CourseStudent[]; message: string }>(`/courses/${courseId}/students`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách học sinh thất bại")
}

export const addStudentToCourseApi = async (courseId: number, studentId: number): Promise<CourseStudent> => {
  const response = await apiClient.post<{ status: number; data: CourseStudent; message: string }>(`/courses/${courseId}/students`, { student_id: studentId })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Thêm học sinh vào khóa học thất bại")
}

export const removeStudentFromCourseApi = async (courseId: number, studentId: number): Promise<void> => {
  const response = await apiClient.delete<{ status: number; message: string }>(`/courses/${courseId}/students/${studentId}`)

  if (response?.status === 200) {
    return
  }

  throw new Error(response?.message || "Xóa học sinh khỏi khóa học thất bại")
}

