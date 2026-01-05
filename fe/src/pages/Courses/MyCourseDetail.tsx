import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Typography, Spin, message, Tabs, Collapse, Table, Form, Input, Button, Avatar, Empty } from "antd"
import { UserOutlined, MessageOutlined } from "@ant-design/icons"
import UserLayout from "src/layouts/UserLayout"
import { getCourseByIdApi, getCourseStudentsApi } from "src/apis/course.api"
import { getQuestionsByCourseIdApi, createQuestionApi } from "src/apis/question.api"
import { createAnswerApi } from "src/apis/answer.api"
import type { Course, Lesson } from "src/@types/course"
import type { Question, Answer } from "src/@types/question"
import type { CourseStudent } from "src/@types/course"
import type { LessonGroup } from "./CourseDetail.types"
import { USER_PATH } from "src/constants/paths"
import { useUser } from "src/hooks/useUser"
import dayjs from "dayjs"
import styled from "styled-components"
import {
  DetailWrapper,
  InfoCard,
  SectionTitle,
  CourseContentHeader,
  CourseContentSummary,
  ExpandLink,
  LessonItem
} from "./CourseDetail.styles"

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse
const { TextArea } = Input

const TabContent = styled.div`
  margin-top: 24px;
`

const QuestionItem = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
`

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

const QuestionContent = styled.div`
  margin-bottom: 16px;
  color: #262626;
`

const AnswerItem = styled.div`
  margin-left: 48px;
  margin-bottom: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
`

const AnswerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`

const AnswerForm = styled.div`
  margin-left: 48px;
  margin-top: 12px;
`

const AnswerFormComponent = ({ questionId, onSubmit }: { questionId: number; onSubmit: (values: { content: string }) => void }) => {
  const [form] = Form.useForm()
  
  return (
    <Form
      form={form}
      onFinish={(values) => {
        onSubmit(values)
        form.resetFields()
      }}
      layout="inline"
      style={{ width: "100%" }}
    >
      <Form.Item
        name="content"
        rules={[{ required: true, message: "Vui lòng nhập câu trả lời" }]}
        style={{ flex: 1, marginRight: 8 }}
      >
        <Input.TextArea
          rows={2}
          placeholder="Trả lời câu hỏi này..."
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Trả lời
        </Button>
      </Form.Item>
    </Form>
  )
}

export default function MyCourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, hasRole } = useUser()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<CourseStudent[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [expandedPanels, setExpandedPanels] = useState<string[]>([])
  const [questionForm] = Form.useForm()
  const [answerForms] = useState<{ [key: number]: any }>({})

  useEffect(() => {
    if (id) {
      loadCourse()
    }
  }, [id])

  useEffect(() => {
    if (course) {
      loadStudents()
      loadQuestions()
    }
  }, [course])

  const loadCourse = async () => {
    if (!id) return
    try {
      setLoading(true)
      const courseData = await getCourseByIdApi(Number(id))
      setCourse(courseData)
    } catch (error) {
      message.error("Không thể tải thông tin khóa học")
      navigate(USER_PATH.COURSES.url)
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async () => {
    if (!course) return
    try {
      setLoadingStudents(true)
      const studentsData = await getCourseStudentsApi(course.id)
      setStudents(studentsData)
    } catch (error) {
      console.error("Lỗi khi tải danh sách học sinh:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadQuestions = async () => {
    if (!course) return
    try {
      setLoadingQuestions(true)
      const questionsData = await getQuestionsByCourseIdApi(course.id)
      setQuestions(questionsData)
    } catch (error) {
      console.error("Lỗi khi tải câu hỏi:", error)
    } finally {
      setLoadingQuestions(false)
    }
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
      title: `Buổi ${index + 1}: ${dayjs(date).format("DD/MM/YYYY")}`,
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

  const handleCreateQuestion = async (values: { content: string }) => {
    if (!course) return
    try {
      const newQuestion = await createQuestionApi({
        course_id: course.id,
        content: values.content
      })
      setQuestions([newQuestion, ...questions])
      questionForm.resetFields()
      message.success("Đặt câu hỏi thành công")
    } catch (error: any) {
      message.error(error instanceof Error ? error.message : "Đặt câu hỏi thất bại")
    }
  }

  const handleCreateAnswer = async (questionId: number, values: { content: string }) => {
    try {
      const newAnswer = await createAnswerApi({
        question_id: questionId,
        content: values.content
      })
      
      setQuestions(questions.map(q => 
        q.id === questionId 
          ? { ...q, answers: [...(q.answers || []), newAnswer] }
          : q
      ))
      
      message.success("Trả lời thành công")
    } catch (error: any) {
      message.error(error instanceof Error ? error.message : "Trả lời thất bại")
    }
  }

  const studentColumns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      key: "userName"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone: string) => phone || "N/A"
    }
  ]

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
  const isStudent = hasRole("hocsinh")

  const tabItems = [
    {
      key: "info",
      label: "Thông tin chung",
      children: (
        <TabContent>
          <InfoCard>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 14 }}>Tên khóa học</Text>
                <div style={{ fontSize: 18, fontWeight: 500, marginTop: 4 }}>
                  {course.name}
                </div>
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: 14 }}>Môn học</Text>
                <div style={{ marginTop: 4 }}>
                  {course.subject?.name || "N/A"}
                </div>
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: 14 }}>Giảng viên</Text>
                <div style={{ marginTop: 4 }}>
                  {course.teacher?.name || "N/A"}
                  {course.teacher?.email && (
                    <span style={{ color: "#8c8c8c", marginLeft: 8 }}>
                      ({course.teacher.email})
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: 14 }}>Khối lớp</Text>
                <div style={{ marginTop: 4 }}>
                  Lớp {course.grade}
                </div>
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: 14 }}>Ngày bắt đầu</Text>
                <div style={{ marginTop: 4 }}>
                  {dayjs(course.start_date).format("DD/MM/YYYY")}
                </div>
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: 14 }}>Ngày kết thúc</Text>
                <div style={{ marginTop: 4 }}>
                  {dayjs(course.end_date).format("DD/MM/YYYY")}
                </div>
              </div>
              
              {course.description && (
                <div>
                  <Text type="secondary" style={{ fontSize: 14 }}>Mô tả</Text>
                  <div style={{ marginTop: 4, lineHeight: 1.6 }}>
                    {course.description}
                  </div>
                </div>
              )}
            </div>
          </InfoCard>
        </TabContent>
      )
    },
    {
      key: "content",
      label: "Nội dung khóa học",
      children: (
        <TabContent>
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
                  {lessonGroups.length}  buổi học • Thời lượng {totalDuration.hours} giờ {totalDuration.minutes} phút
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
        </TabContent>
      )
    },
    {
      key: "members",
      label: "Danh sách thành viên",
      children: (
        <TabContent>
          <InfoCard>
            <SectionTitle level={3}>Danh sách học sinh</SectionTitle>
            {loadingStudents ? (
              <Spin style={{ display: "block", textAlign: "center", padding: "40px 0" }} />
            ) : students.length > 0 ? (
              <Table
                columns={studentColumns}
                dataSource={students}
                rowKey="id"
                pagination={false}
              />
            ) : (
              <Empty description="Chưa có học sinh nào đăng ký" />
            )}
          </InfoCard>
        </TabContent>
      )
    },
    {
      key: "qa",
      label: "Hỏi đáp",
      children: (
        <TabContent>
          <InfoCard>
            <SectionTitle level={3}>Hỏi đáp</SectionTitle>
            
            {isStudent && (
              <Form
                form={questionForm}
                onFinish={handleCreateQuestion}
                style={{ marginBottom: 24 }}
              >
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Đặt câu hỏi của bạn..."
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<MessageOutlined />}>
                    Đặt câu hỏi
                  </Button>
                </Form.Item>
              </Form>
            )}

            {loadingQuestions ? (
              <Spin style={{ display: "block", textAlign: "center", padding: "40px 0" }} />
            ) : questions.length > 0 ? (
              questions.map((question) => (
                <QuestionItem key={question.id}>
                  <QuestionHeader>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                      <Text strong>{question.user?.name || "Người dùng"}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(question.createdAt).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </div>
                  </QuestionHeader>
                  <QuestionContent>{question.content}</QuestionContent>
                  
                  {question.answers && question.answers.length > 0 && (
                    <div>
                      {question.answers.map((answer) => (
                        <AnswerItem key={answer.id}>
                          <AnswerHeader>
                            <Avatar size="small" icon={<UserOutlined />} />
                            <Text strong>{answer.user?.name || "Người dùng"}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {dayjs(answer.createdAt).format("DD/MM/YYYY HH:mm")}
                            </Text>
                          </AnswerHeader>
                          <div>{answer.content}</div>
                        </AnswerItem>
                      ))}
                    </div>
                  )}

                  <AnswerForm>
                    <AnswerFormComponent
                      questionId={question.id}
                      onSubmit={(values) => handleCreateAnswer(question.id, values)}
                    />
                  </AnswerForm>
                </QuestionItem>
              ))
            ) : (
              <Empty description="Chưa có câu hỏi nào" />
            )}
          </InfoCard>
        </TabContent>
      )
    }
  ]

  return (
    <UserLayout>
      <DetailWrapper>
        <Title level={1} style={{ marginBottom: 24 }}>
          {course.name}
        </Title>

        <Tabs items={tabItems} defaultActiveKey="info" />
      </DetailWrapper>
    </UserLayout>
  )
}

