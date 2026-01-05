import { apiClient } from "./base.api"
import type { Question, QuestionResponse, QuestionListResponse, CreateQuestionData } from "../@types/question"

export const getQuestionsByCourseIdApi = async (courseId: number): Promise<Question[]> => {
  const response = await apiClient.get<QuestionListResponse>(`/courses/${courseId}/questions`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách câu hỏi thất bại")
}

export const createQuestionApi = async (data: CreateQuestionData): Promise<Question> => {
  const response = await apiClient.post<QuestionResponse>("/questions", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo câu hỏi thất bại")
}

