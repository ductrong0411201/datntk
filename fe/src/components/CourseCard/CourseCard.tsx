import { useState } from "react"
import { Card, Typography, Space } from "antd"
import { CrownOutlined } from "@ant-design/icons"
import type { Course } from "src/@types/course"
import { getRandomSubjectImage } from "src/utils/subjectImages"
import {
  CourseCardWrapper,
  CoverWrapper,
  CoverImage,
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

  const thumbnailImage = getRandomSubjectImage(course.subject?.name, course.id)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
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
          <CoverWrapper>
            {!imageError && (
              <CoverImage
                src={thumbnailImage}
                alt={course.name}
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{ opacity: imageLoaded ? 1 : 0 }}
              />
            )}
            <CrownOutlined style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              fontSize: "24px",
              color: "#ffd700",
              zIndex: 2
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

