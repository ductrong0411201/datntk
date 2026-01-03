import { Card, Typography, Space } from "antd"
import { CrownOutlined } from "@ant-design/icons"
import type { Course } from "src/@types/course"
import {
  CourseCardWrapper,
  CoverWrapper,
  CourseTitle,
  PriceWrapper,
  TeacherWrapper
} from "./CourseCard.styles"

const { Text } = Typography

interface Props {
  course: Course
  onClick?: () => void
}

const CourseCard = ({ course, onClick }: Props) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫"
  }

  const getGradientColors = (index: number) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    ]
    return gradients[index % gradients.length]
  }

  return (
    <CourseCardWrapper onClick={onClick}>
      <Card
        hoverable
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          height: "100%",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
        cover={
          <CoverWrapper gradient={getGradientColors(course.id)}>
            <CrownOutlined style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              fontSize: "24px",
              color: "#ffd700"
            }} />
            <CourseTitle level={2}>
              {course.name}
            </CourseTitle>
          </CoverWrapper>
        }
      >
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text type="secondary" style={{ fontSize: "14px" }}>
            {course.subject?.name || "Khóa học"}
          </Text>
          <PriceWrapper>
            <div>
              <Text delete style={{ fontSize: "14px", color: "#8c8c8c" }}>
                {formatPrice(course.price * 2)}
              </Text>
              <Text strong style={{ fontSize: "18px", color: "#f5576c", marginLeft: "8px" }}>
                {formatPrice(course.price)}
              </Text>
            </div>
          </PriceWrapper>
          <TeacherWrapper>
            <Text style={{ fontSize: "14px" }}>
              <strong>Giảng viên:</strong> {course.teacher?.name || "Chưa có"}
            </Text>
          </TeacherWrapper>
          {course.lessons && course.lessons.length > 0 && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {course.lessons.length} buổi học
            </Text>
          )}
        </Space>
      </Card>
    </CourseCardWrapper>
  )
}

export default CourseCard

