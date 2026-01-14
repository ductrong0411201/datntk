import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Typography, Spin, message, Collapse, Modal, Button } from "antd"
import { CheckCircleOutlined, PlayCircleOutlined, ClockCircleOutlined, VideoCameraOutlined, LaptopOutlined } from "@ant-design/icons"
import UserLayout from "src/layouts/UserLayout"
import { getCourseByIdApi, getCourseStudentsApi, registerWithPaymentApi } from "src/apis/course.api"
import type { Course, Lesson } from "src/@types/course"
import type { LessonGroup } from "./CourseDetail.types"
import { USER_PATH, PATH } from "src/constants/paths"
import { useUser } from "src/hooks/useUser"
import dayjs from "dayjs"
import qrcodeImage from "src/assets/images/qrcode.jpg"
import { getRandomSubjectImage } from "src/utils/subjectImages"
import {
  DetailWrapper,
  ContentSection,
  LeftContent,
  RightSidebar,
  VideoCard,
  VideoThumbnail,
  VideoLink,
  PriceCard,
  PriceSection,
  PriceAmount,
  ActionButton,
  InfoCard,
  SectionTitle,
  LearningPoints,
  LearningPoint,
  CourseContentHeader,
  CourseContentSummary,
  ExpandLink,
  LessonItem,
  CourseInfoList,
  CourseInfoItem,
  PaymentModalContent,
  QRCodeContainer,
  QRCodeImage,
  PaymentInfo,
  PaymentButtons,
  VideoThumbnailImage
} from "./CourseDetail.styles"

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [checkingRegistration, setCheckingRegistration] = useState(true)
  const [expandedPanels, setExpandedPanels] = useState<string[]>([])
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  const [completingPayment, setCompletingPayment] = useState(false)
  const [thumbnailImageError, setThumbnailImageError] = useState(false)
  const [thumbnailImageLoaded, setThumbnailImageLoaded] = useState(false)
  console.log(user);
  useEffect(() => {
    if (id) {
      loadCourse()
    }
  }, [id])

  useEffect(() => {
    if (course && user) {
      checkRegistration()
    } else if (course && !user) {
      setCheckingRegistration(false)
    }
  }, [course, user])

  const loadCourse = async () => {
    if (!id) return
    try {
      setLoading(true)
      const courseData = await getCourseByIdApi(Number(id))
      setCourse(courseData)
    } catch (error) {
      message.error("Không thể tải thông tin khóa học")
      navigate(USER_PATH.HOME.url)
    } finally {
      setLoading(false)
    }
  }

  const checkRegistration = async () => {
    if (!course || !user) return
    try {
      setCheckingRegistration(true)
      const students = await getCourseStudentsApi(course.id)
      const registered = students.some(student => student.id === user.id)
      setIsRegistered(registered)
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng ký:", error)
    } finally {
      setCheckingRegistration(false)
    }
  }

  const handleRegister = () => {
    if (!course || !user) return
    setPaymentModalVisible(true)
  }

  const handleCompletePayment = async () => {
    if (!course || !user) return

    try {
      setCompletingPayment(true)
      
      // Gọi API đăng ký và thanh toán trong một transaction
      // student_id sẽ được lấy tự động từ token, không cần gửi từ frontend
      await registerWithPaymentApi(course.id, {
        payment_method_id: 1, // Thanh toán trực tuyến
        description: `Thanh toán khóa học: ${course.name}`
      })
      
      setIsRegistered(true)
      setPaymentModalVisible(false)
      message.success("Thanh toán thành công! Bạn đã được thêm vào khóa học.")
    } catch (error: any) {
      message.error(error instanceof Error ? error.message : "Hoàn thành thanh toán thất bại")
    } finally {
      setCompletingPayment(false)
    }
  }

  const handleCancelPayment = () => {
    setPaymentModalVisible(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ"
  }

  const formatDuration = (start: string, end: string) => {
    const startTime = dayjs(start)
    const endTime = dayjs(end)
    const diffMinutes = endTime.diff(startTime, "minute")
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}`
    }
    return `${minutes}:00`
  }

  const calculateTotalDuration = (lessons: Lesson[]) => {
    let totalMinutes = 0
    lessons.forEach(lesson => {
      const startTime = dayjs(lesson.start)
      const endTime = dayjs(lesson.end)
      totalMinutes += endTime.diff(startTime, "minute")
    })
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return { hours, minutes, totalMinutes }
  }

  const groupLessonsByDate = (lessons: Lesson[]): LessonGroup[] => {
    if (!lessons || lessons.length === 0) return []
    
    const groups: { [key: string]: Lesson[] } = {}
    
    lessons.forEach(lesson => {
      const date = dayjs(lesson.start).format("YYYY-MM-DD")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(lesson)
    })
    
    const sortedDates = Object.keys(groups).sort()
    
    return sortedDates.map((date, index) => ({
      title: ` ${index + 1}. ${dayjs(date).format("DD/MM/YYYY")}`,
      lessons: groups[date].sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
    }))
  }

  const handleExpandAll = () => {
    if (!course?.lessons) return
    const groups = groupLessonsByDate(course.lessons)
    setExpandedPanels(groups.map((_, index) => index.toString()))
  }

  const handleCollapseAll = () => {
    setExpandedPanels([])
  }

  if (loading) {
    return (
      <UserLayout>
        <DetailWrapper>
          <Spin size="large" style={{ display: "block", textAlign: "center", padding: "100px 0" }} />
        </DetailWrapper>
      </UserLayout>
    )
  }

  if (!course) {
    return null
  }

  const lessons = course.lessons || []
  const lessonGroups = groupLessonsByDate(lessons)
  const totalDuration = calculateTotalDuration(lessons)
  const isAllExpanded = expandedPanels.length === lessonGroups.length && lessonGroups.length > 0

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
    <UserLayout>
      <DetailWrapper>
        <Title level={1} style={{ marginBottom: 24 }}>
          {course.name}
        </Title>

        <ContentSection>
          <LeftContent>
            {course.description && (
              <Paragraph style={{ fontSize: 16, color: "#595959", marginBottom: 32 }}>
                {course.description}
              </Paragraph>
            )}

            <InfoCard>
              <SectionTitle level={3}>Bạn sẽ học được gì?</SectionTitle>
              <LearningPoints>
                <LearningPoint>
                  <CheckCircleOutlined className="icon" />
                  <Text>Các kiến thức cơ bản, nền móng của {course.subject?.name || "môn học"}</Text>
                </LearningPoint>
                <LearningPoint>
                  <CheckCircleOutlined className="icon" />
                  <Text>Các khái niệm, thuật ngữ cốt lõi khi học {course.subject?.name || "môn học"}</Text>
                </LearningPoint>
                <LearningPoint>
                  <CheckCircleOutlined className="icon" />
                  <Text>Nắm vững kiến thức từ cơ bản đến nâng cao</Text>
                </LearningPoint>
              </LearningPoints>
            </InfoCard>

            <InfoCard>
              <CourseContentHeader>
                <SectionTitle level={3} style={{ margin: 0 }}>Nội dung khóa học</SectionTitle>
                {lessonGroups.length > 0 && (
                  <ExpandLink onClick={isAllExpanded ? handleCollapseAll : handleExpandAll}>
                    {isAllExpanded ? "Thu gọn tất cả" : "Mở rộng tất cả"}
                  </ExpandLink>
                )}
              </CourseContentHeader>
              
              {lessonGroups.length > 0 ? (
                <>
                  <CourseContentSummary>
                    {lessonGroups.length} buổi học • Thời lượng {totalDuration.hours} giờ {totalDuration.minutes} phút
                  </CourseContentSummary>
                  
                  <Collapse
                    activeKey={expandedPanels}
                    onChange={(keys) => setExpandedPanels(keys as string[])}
                    style={{ marginTop: 16 }}
                  >
                    {lessonGroups.map((group, index) => (
                      <Panel
                        header={
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{group.title}</span>
                            <span style={{ color: "#8c8c8c", fontSize: 14 }}>
                              {group.lessons.length} bài học
                            </span>
                          </div>
                        }
                        key={index.toString()}
                      >
                        {group.lessons.map((lesson, lessonIndex) => (
                          <LessonItem key={lesson.id}>
                            <span className="lesson-name">
                              {lessonIndex + 1}. {lesson.name}
                            </span>
                            <span className="lesson-duration">
                              {formatDuration(lesson.start, lesson.end)}
                            </span>
                          </LessonItem>
                        ))}
                      </Panel>
                    ))}
                  </Collapse>
                </>
              ) : (
                <Text type="secondary">Chưa có nội dung khóa học</Text>
              )}
            </InfoCard>
          </LeftContent>

          <RightSidebar>
            <VideoCard>
              <VideoThumbnail gradient={getGradientColors(course.id)}>
                {!thumbnailImageError && (
                  <VideoThumbnailImage
                    src={getRandomSubjectImage(course.subject?.name, course.id)}
                    alt={course.name}
                    onError={() => setThumbnailImageError(true)}
                    onLoad={() => setThumbnailImageLoaded(true)}
                    style={{ opacity: thumbnailImageLoaded ? 1 : 0 }}
                  />
                )}
                <div className="video-title">
                  {course.name}
                </div>
              </VideoThumbnail>
            </VideoCard>

            <PriceCard>
              <PriceSection>
                <PriceAmount>
                  {course.price === 0 ? "Miễn phí" : formatPrice(course.price)}
                </PriceAmount>
              </PriceSection>

              {checkingRegistration ? (
                <Spin style={{ display: "block", textAlign: "center", padding: "20px 0" }} />
              ) : user?.roleDetail?.code === "giaovien" ? null : isRegistered ? (
                <ActionButton
                  type="default"
                  icon={<CheckCircleOutlined />}
                  disabled
                >
                  Đã đăng ký
                </ActionButton>
              ) : user?.roleDetail?.code === "hocsinh" ? (
                <ActionButton
                  type="primary"
                  size="large"
                  onClick={handleRegister}
                >
                  ĐĂNG KÝ HỌC
                </ActionButton>
              ) : (
                <ActionButton
                  type="primary"
                  size="large"
                  onClick={() => navigate(PATH.LOGIN.url + "?redirect=/courses/" + id)}
                >
                  ĐĂNG NHẬP ĐỂ ĐĂNG KÝ
                </ActionButton>
              )}

              <CourseInfoList>

                <CourseInfoItem>
                  <VideoCameraOutlined className="icon" />
                  <Text>Tổng số {lessons.length} buổi học</Text>
                </CourseInfoItem>
                <CourseInfoItem>
                  <ClockCircleOutlined className="icon" />
                  <Text>Thời lượng {totalDuration.hours} giờ {totalDuration.minutes} phút</Text>
                </CourseInfoItem>
                <CourseInfoItem>
                  <LaptopOutlined className="icon" />
                  <Text>Học mọi lúc, mọi nơi</Text>
                </CourseInfoItem>
              </CourseInfoList>
            </PriceCard>
          </RightSidebar>
        </ContentSection>
      </DetailWrapper>

      <Modal
        title="Thanh toán khóa học"
        open={paymentModalVisible}
        onCancel={handleCancelPayment}
        footer={null}
        width={600}
        centered
      >
        <PaymentModalContent>
          <PaymentInfo>
            <Text strong style={{ fontSize: 16 }}>Khóa học: </Text>
            <Text style={{ fontSize: 16 }}>{course.name}</Text>
            <div style={{ marginTop: 8 }}>
              <Text strong style={{ fontSize: 18, color: "#1890ff" }}>
                Số tiền: {course.price === 0 ? "Miễn phí" : formatPrice(course.price)}
              </Text>
            </div>
          </PaymentInfo>

          <QRCodeContainer>
            <Text strong style={{ marginBottom: 16, display: "block", textAlign: "center" }}>
              Quét mã QR để thanh toán
            </Text>
            <QRCodeImage src={qrcodeImage} alt="QR Code thanh toán" />
            <Text type="secondary" style={{ marginTop: 16, display: "block", textAlign: "center", fontSize: 12 }}>
              Vui lòng quét mã QR bằng ứng dụng ngân hàng của bạn để thanh toán
            </Text>
          </QRCodeContainer>

          <PaymentButtons>
            <Button onClick={handleCancelPayment} size="large">
              Hủy
            </Button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleCompletePayment}
              loading={completingPayment}
              size="large"
            >
              Đã hoàn thành thanh toán
            </Button>
          </PaymentButtons>
        </PaymentModalContent>
      </Modal>
    </UserLayout>
  )
}

