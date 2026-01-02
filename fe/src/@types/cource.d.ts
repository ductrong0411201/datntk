export interface Lesson {
  id: number
  name: string
  start: string
  end: string
}

export interface CourceStudent {
  id: number
  name: string
  userName: string
  email: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
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

