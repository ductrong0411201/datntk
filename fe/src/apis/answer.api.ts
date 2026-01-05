import { apiClient } from "./base.api"
import type { Answer, AnswerResponse, CreateAnswerData } from "../@types/question"

export const getAnswersByQuestionIdApi = async (questionId: number): Promise<Answer[]> => {
  const response = await apiClient.get<{ status: number; data: Answer[]; message: string }>(`/questions/${questionId}/answers`)

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách câu trả lời thất bại")
}

export const createAnswerApi = async (data: CreateAnswerData): Promise<Answer> => {
  const response = await apiClient.post<AnswerResponse>("/answers", data)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Tạo câu trả lời thất bại")
}

