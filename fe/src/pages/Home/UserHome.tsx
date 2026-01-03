import { useEffect, useState } from "react"
import { Row, Col, Typography, Badge, Spin } from "antd"
import Banner from "src/components/Banner/Banner"
import CourseCard from "src/components/CourseCard/CourseCard"
import { getCoursesApi } from "src/apis/course.api"
import type { Course } from "src/@types/course"
import { useNavigate } from "react-router-dom"
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
      const response = await getCoursesApi(1, 12)
      setCourses(response.items || [])
    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`)
  }

  return (
    <>
      <Banner />
      
      <ContentWrapper>
        <TitleWrapper>
          <Title level={2} style={{ margin: 0 }}>
            Khóa học Pro
          </Title>
          <Badge count="MỚI" style={{ backgroundColor: "#1890ff" }} />
        </TitleWrapper>

        {loading ? (
          <LoadingWrapper>
            <Spin size="large" />
          </LoadingWrapper>
        ) : (
          <Row gutter={[24, 24]}>
            {courses.map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                <CourseCard
                  course={course}
                  onClick={() => handleCourseClick(course.id)}
                />
              </Col>
            ))}
          </Row>
        )}

        {!loading && courses.length === 0 && (
          <EmptyWrapper>
            Chưa có khóa học nào
          </EmptyWrapper>
        )}
      </ContentWrapper>
    </>
  )
}

