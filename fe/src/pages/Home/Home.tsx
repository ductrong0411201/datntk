import { useEffect, useState } from "react"
import { Row, Col, Typography, Badge, Spin } from "antd"
import UserLayout from "src/layouts/UserLayout"
import MainLayout from "src/layouts/MainLayout"
import Banner from "src/components/Banner/Banner"
import CourseCard from "src/components/CourseCard/CourseCard"
import { getCourcesApi } from "src/apis/cource.api"
import type { Cource } from "src/@types/cource"
import { useNavigate } from "react-router-dom"
import { USER_PATH } from "src/constants/paths"
import { useUser } from "src/hooks/useUser"

const { Title } = Typography

export default function Home() {
  const [courses, setCourses] = useState<Cource[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { hasAnyRole } = useUser()

  const isAdminOrManager = hasAnyRole(["admin", "quanly"])

  useEffect(() => {
    if (!isAdminOrManager) {
      loadCourses()
    }
  }, [isAdminOrManager])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const response = await getCourcesApi(1, 12)
      setCourses(response.items || [])
    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseClick = (courseId: number) => {
    navigate(`${USER_PATH.COURSES.url}/${courseId}`)
  }

  const content = (
    <>
      {!isAdminOrManager && <Banner />}
      
      <div style={{ marginBottom: "32px" }}>
        {!isAdminOrManager && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0 }}>
              Khóa học Pro
            </Title>
            <Badge count="MỚI" style={{ backgroundColor: "#1890ff" }} />
          </div>
        )}

        {isAdminOrManager ? (
          <h2 className="mb-4">Trang chủ quản trị</h2>
        ) : (
          <>
            {loading ? (
              <div style={{ textAlign: "center", padding: "48px" }}>
                <Spin size="large" />
              </div>
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
              <div style={{ textAlign: "center", padding: "48px", color: "#8c8c8c" }}>
                Chưa có khóa học nào
              </div>
            )}
          </>
        )}
      </div>
    </>
  )

  if (isAdminOrManager) {
    return <MainLayout>{content}</MainLayout>
  }

  return <UserLayout>{content}</UserLayout>
}
