import type { User } from "./user"

export interface Answer {
  id: number
  question_id: number
  user_id: number
  content: string
  createdAt?: string
  updatedAt?: string
  user?: User
}

export interface Question {
  id: number
  course_id: number
  user_id: number
  content: string
  createdAt?: string
  updatedAt?: string
  user?: User
  answers?: Answer[]
}

export interface QuestionResponse {
  status: number
  data: Question
  message: string
}

export interface QuestionListResponse {
  status: number
  data: Question[]
  message: string
}

export interface AnswerResponse {
  status: number
  data: Answer
  message: string
}

export interface CreateQuestionData {
  course_id: number
  content: string
}

export interface CreateAnswerData {
  question_id: number
  content: string
}

