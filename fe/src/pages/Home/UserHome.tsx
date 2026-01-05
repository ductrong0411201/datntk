import { useEffect, useState, useMemo } from "react"
import { Row, Col, Typography, Spin } from "antd"
import Banner from "src/components/Banner/Banner"
import CourseCard from "src/components/CourseCard/CourseCard"
import { getCoursesApi } from "src/apis/course.api"
import type { Course } from "src/@types/course"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import {
  ContentWrapper,
  TitleWrapper,
  LoadingWrapper,
  EmptyWrapper
} from "./Home.styles"

const { Title } = Typography

export default function UserHome() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const response = await getCoursesApi(1, 1000)
      setCourses(response.items || [])
    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error)
    } finally {
      setLoading(false)
    }
  }

  const { newCourses, otherCourses } = useMemo(() => {
    const now = dayjs()
    const newCoursesList: Course[] = []
    const otherCoursesList: Course[] = []

    courses.forEach(course => {
      const startDate = dayjs(course.start_date)
      if (startDate.isAfter(now)) {
        newCoursesList.push(course)
      } else {
        otherCoursesList.push(course)
      }
    })

    return {
      newCourses: newCoursesList,
      otherCourses: otherCoursesList
    }
  }, [courses])

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`)
  }

  const renderCourses = (coursesList: Course[]) => {
    if (coursesList.length === 0) {
      return (
        <EmptyWrapper>
          Chưa có khóa học nào
        </EmptyWrapper>
      )
    }

    return (
      <Row gutter={[24, 24]}>
        {coursesList.map((course) => (
          <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
            <CourseCard
              course={course}
              onClick={() => handleCourseClick(course.id)}
            />
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <>
      <Banner />
      
      <ContentWrapper>
        <TitleWrapper>
          <Title level={2} style={{ margin: 0 }}>
            Khóa học mới
          </Title>
        </TitleWrapper>

        {loading ? (
          <LoadingWrapper>
            <Spin size="large" />
          </LoadingWrapper>
        ) : (
          renderCourses(newCourses)
        )}
      </ContentWrapper>

      <ContentWrapper>
        <TitleWrapper>
          <Title level={2} style={{ margin: 0 }}>
            Khóa học khác
          </Title>
        </TitleWrapper>

        {loading ? (
          <LoadingWrapper>
            <Spin size="large" />
          </LoadingWrapper>
        ) : (
          renderCourses(otherCourses)
        )}
      </ContentWrapper>
    </>
  )
}

