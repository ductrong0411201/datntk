export interface Lesson {
  id: number
  name: string
  start: string
  end: string
}

export interface CourseStudent {
  id: number
  name: string
  userName: string
  email: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
}

export interface Course {
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

export interface CourseListResponse {
  status: number
  data: {
    items: Course[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message: string
}

export interface CourseResponse {
  status: number
  data: Course
  message: string
}

export interface LessonConfig {
  id?: string
  name?: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface CreateCourseData {
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

