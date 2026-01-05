import { useEffect, useState } from "react"
import { Row, Col, Typography, Spin, Empty } from "antd"
import UserLayout from "src/layouts/UserLayout"
import CourseCard from "src/components/CourseCard/CourseCard"
import { getMyCoursesApi } from "src/apis/course.api"
import type { Course } from "src/@types/course"
import { useNavigate } from "react-router-dom"
import { useUser } from "src/hooks/useUser"
import styled from "styled-components"

const { Title } = Typography

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  margin-bottom: 24px;
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0;
`

const EmptyWrapper = styled.div`
  text-align: center;
  padding: 100px 0;
  color: #8c8c8c;
`

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user, hasRole } = useUser()

  useEffect(() => {
    loadMyCourses()
  }, [])

  const loadMyCourses = async () => {
    try {
      setLoading(true)
      const coursesData = await getMyCoursesApi()
      setCourses(coursesData || [])
    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseClick = (courseId: number) => {
    navigate(`/my-courses/${courseId}`)
  }

  const getPageTitle = () => {
    if (hasRole("giaovien")) {
      return "Khóa học tôi giảng dạy"
    }
    if (hasRole("hocsinh")) {
      return "Khóa học của tôi"
    }
    return "Khóa học của tôi"
  }

  return (
    <UserLayout>
      <Container>
        <Header>
          <Title level={2}>{getPageTitle()}</Title>
        </Header>

        {loading ? (
          <LoadingWrapper>
            <Spin size="large" />
          </LoadingWrapper>
        ) : courses.length > 0 ? (
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
        ) : (
          <EmptyWrapper>
            <Empty
              description={
                hasRole("giaovien")
                  ? "Bạn chưa có khóa học nào"
                  : "Bạn chưa đăng ký khóa học nào"
              }
            />
          </EmptyWrapper>
        )}
      </Container>
    </UserLayout>
  )
}

