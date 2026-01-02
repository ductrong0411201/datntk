export interface Subject {
  id: number
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface SubjectListResponse {
  status: number
  data: {
    items: Subject[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message: string
}

export interface SubjectResponse {
  status: number
  data: Subject
  message: string
}

