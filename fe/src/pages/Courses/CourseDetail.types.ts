import type { Lesson } from "src/@types/course"

export interface LessonGroup {
  title: string
  lessons: Lesson[]
}

export interface DurationInfo {
  hours: number
  minutes: number
  totalMinutes: number
}

