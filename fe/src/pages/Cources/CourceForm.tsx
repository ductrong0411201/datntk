import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MainLayout from "src/layouts/MainLayout"
import { createCourceApi, updateCourceApi, getCourceByIdApi } from "src/apis/cource.api"
import { getSubjectsApi } from "src/apis/subject.api"
import { getTeachersApi } from "src/apis/user.api"
import type { Subject } from "src/@types/subject"
import type { UserListItem } from "src/@types/user"
import CourseStudentsTable from "src/components/CourseStudentsTable/CourseStudentsTable"
import { message, Form, Input, Select, InputNumber, DatePicker, TimePicker, Button, Card, Typography, Row, Col, Table, Modal } from "antd"
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import { ADMIN_PATH } from "src/constants/paths"
import type { ColumnsType } from "antd/es/table"

const { Title } = Typography

const DAYS_OF_WEEK = [
  { label: "Chủ nhật", value: 0 },
  { label: "Thứ 2", value: 1 },
  { label: "Thứ 3", value: 2 },
  { label: "Thứ 4", value: 3 },
  { label: "Thứ 5", value: 4 },
  { label: "Thứ 6", value: 5 },
  { label: "Thứ 7", value: 6 },
]

interface LessonItem {
  id: string
  name?: string
  dayOfWeek: number
  startTime: string
  endTime: string
  date?: string // Ngày học (chỉ có khi load từ database)
}

function CourceForm() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<UserListItem[]>([])
  const [lessons, setLessons] = useState<LessonItem[]>([])
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false)
  const [lessonForm] = Form.useForm()
  const isEditMode = !!id

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true)
        const [subjectsData, teachersData] = await Promise.all([
          getSubjectsApi(1, 1000),
          getTeachersApi()
        ])
        setSubjects(subjectsData.items)
        setTeachers(teachersData)

        if (id) {
          const courceData = await getCourceByIdApi(Number(id))
          form.setFieldsValue({
            name: courceData.name,
            subject_id: courceData.subject_id,
            teacher_id: courceData.teacher_id,
            grade: courceData.grade,
            start_date: dayjs(courceData.start_date),
            end_date: dayjs(courceData.end_date),
            price: courceData.price,
            description: courceData.description
          })

          // Load và convert lessons từ database sang format LessonItem
          if (courceData.lessons && courceData.lessons.length > 0) {
            const lessonItems: LessonItem[] = courceData.lessons.map(lesson => ({
              id: lesson.id.toString(),
              name: lesson.name,
              dayOfWeek: dayjs(lesson.start).day(),
              startTime: dayjs(lesson.start).format("HH:mm"),
              endTime: dayjs(lesson.end).format("HH:mm"),
              date: dayjs(lesson.start).format("DD/MM/YYYY")
            }))
            setLessons(lessonItems)
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error)
        message.error("Lỗi khi tải dữ liệu")
        navigate(ADMIN_PATH.COURSES.url)
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [id, form, navigate])

  const handleSubmit = async (values: any) => {
    try {
      if (!isEditMode && lessons.length === 0) {
        message.error("Vui lòng thêm ít nhất một buổi học")
        return
      }

      setLoading(true)

      if (isEditMode && id) {
        const updateData = {
          ...values,
          start_date: values.start_date.format("YYYY-MM-DD"),
          end_date: values.end_date.format("YYYY-MM-DD")
        }
        await updateCourceApi(Number(id), updateData)
        message.success("Cập nhật khóa học thành công")
      } else {

        const createData = {
          ...values,
          start_date: values.start_date.format("YYYY-MM-DD"),
          end_date: values.end_date.format("YYYY-MM-DD"),
          lessonDays: lessons,
        }
        await createCourceApi(createData)
        message.success("Tạo khóa học thành công")
      }

      navigate(ADMIN_PATH.COURSES.url)
    } catch (error: any) {
      if (error?.errorFields) {
        return
      }
      message.error(error instanceof Error ? error.message : "Thao tác thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleAddLesson = () => {
    lessonForm.resetFields()
    setIsLessonModalVisible(true)
  }

  const handleLessonModalOk = () => {
    lessonForm.validateFields().then(values => {
      console.log('lesson values', values)
      const newLesson: LessonItem = {
        id: Date.now().toString(),
        name: values.name,
        dayOfWeek: values.dayOfWeek,
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm")
      }
      setLessons([...lessons, newLesson])
      console.log(lessons)
      setIsLessonModalVisible(false)
      lessonForm.resetFields()
    }).catch(() => { })
  }

  const handleLessonModalCancel = () => {
    setIsLessonModalVisible(false)
    lessonForm.resetFields()
  }

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId))
  }

  const getUniqueLessons = (lessons: LessonItem[]): LessonItem[] => {
    const uniqueMap = new Map<string, LessonItem>()
    
    lessons.forEach(lesson => {
      const key = `${lesson.dayOfWeek}-${lesson.startTime}-${lesson.endTime}`
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, lesson)
      }
    })
    
    return Array.from(uniqueMap.values())
  }

  const getLessonColumns = (): ColumnsType<LessonItem> => {
    const baseColumns: ColumnsType<LessonItem> = []
    
    if (!isEditMode) {
      baseColumns.push({
        title: "Ngày học",
        dataIndex: "date",
        key: "date",
        render: (date: string | undefined, record: LessonItem) => {
          if (date) {
            return date
          }
          return DAYS_OF_WEEK.find(d => d.value === record.dayOfWeek)?.label || ""
        }
      })
    }
    
    baseColumns.push(
      {
        title: "Thứ",
        dataIndex: "dayOfWeek",
        key: "dayOfWeek",
        render: (day: number) => DAYS_OF_WEEK.find(d => d.value === day)?.label || ""
      },
      {
        title: "Giờ bắt đầu",
        dataIndex: "startTime",
        key: "startTime"
      },
      {
        title: "Giờ kết thúc",
        dataIndex: "endTime",
        key: "endTime"
      }
    )

    if (!isEditMode) {
      baseColumns.push({
        title: "Thao tác",
        key: "action",
        render: (_: unknown, record: LessonItem) => (
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteLesson(record.id)}
          >
            Xóa
          </Button>
        )
      })
    }

    return baseColumns
  }

  const lessonColumns = getLessonColumns()
  const displayLessons = isEditMode ? getUniqueLessons(lessons) : lessons

  return (
    <MainLayout>
      <Card style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {isEditMode ? "Sửa khóa học" : "Thêm khóa học mới"}
            </Title>
          </div>
          <div>
            <Button
              type="primary"
              loading={loading}
              size="large"
              onClick={() => form.submit()}
            >
              {isEditMode ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          disabled={loadingData}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên khóa học"
                rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
              >
                <Input placeholder="Nhập tên khóa học" size="large" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="subject_id"
                label="Môn học"
                rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
              >
                <Select placeholder="Chọn môn học" size="large">
                  {subjects.map(subject => (
                    <Select.Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="teacher_id"
                label="Giáo viên"
                rules={[{ required: true, message: "Vui lòng chọn giáo viên" }]}
              >
                <Select placeholder="Chọn giáo viên" showSearch optionFilterProp="children" size="large">
                  {teachers.map(teacher => (
                    <Select.Option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.userName})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>


          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="grade"
                label="Khối lớp"
                rules={[{ required: true, message: "Vui lòng nhập khối lớp" }]}
              >
                <InputNumber placeholder="Nhập khối lớp" style={{ width: "100%" }} min={1} max={12} size="large" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="start_date"
                label="Ngày bắt đầu"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="end_date"
                label="Ngày kết thúc"
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber
                  placeholder="Nhập giá"
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined) => value ? value.replace(/\$\s?|(,*)/g, '') : 0}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả"
              >
                <Input.TextArea
                  placeholder="Nhập mô tả (tùy chọn)"
                  rows={4}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div style={{ marginTop: 16, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500, fontSize: 16 }}>Danh sách buổi học</span>
                {!isEditMode && (
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={handleAddLesson}
                  />
                )}
              </div>
              <Table
                columns={lessonColumns}
                dataSource={displayLessons}
                rowKey={(record) => isEditMode ? `${record.dayOfWeek}-${record.startTime}-${record.endTime}` : record.id}
                pagination={false}
                locale={{ emptyText: "Chưa có buổi học nào." }}
                style={{ marginBottom: 8 }}
              />
            </Col>
          </Row>
          {(
            <Row gutter={16}>
              <Col span={24}>
                <CourseStudentsTable courceId={id ? Number(id) : undefined} />
              </Col>
            </Row>
          )}
        </Form>

        <Modal
          title="Thêm buổi học"
          open={isLessonModalVisible}
          onOk={handleLessonModalOk}
          onCancel={handleLessonModalCancel}
          okText="Thêm"
          cancelText="Hủy"
        >
          <Form
            form={lessonForm}
            layout="vertical"
            autoComplete="off"
          >

            <Form.Item
              name="dayOfWeek"
              label="Thứ"
              rules={[{ required: true, message: "Vui lòng chọn thứ" }]}
            >
              <Select placeholder="Chọn thứ">
                {DAYS_OF_WEEK.map(day => (
                  <Select.Option key={day.value} value={day.value}>
                    {day.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="startTime"
              label="Giờ bắt đầu"
              rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}
            >
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="Giờ kết thúc"
              rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc" }]}
            >
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </MainLayout >
  )
}

export default CourceForm

