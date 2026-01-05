import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MainLayout from "src/layouts/MainLayout"
import { createCourseApi, updateCourseApi, getCourseByIdApi } from "src/apis/course.api"
import { getSubjectsApi } from "src/apis/subject.api"
import { getUsersApi } from "src/apis/user.api"
import { getDocumentsApi, uploadDocumentApi } from "src/apis/document.api"
import type { Subject } from "src/@types/subject"
import type { UserListItem } from "src/@types/user"
import type { Document } from "src/@types/document"
import CourseStudentsTable from "src/components/CourseStudentsTable/CourseStudentsTable"
import { message, Form, Input, Select, InputNumber, DatePicker, TimePicker, Button, Card, Typography, Row, Col, Table, Modal, Upload, Space } from "antd"
import { PlusOutlined, DeleteOutlined, EditOutlined, FileTextOutlined, UploadOutlined, DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import { ADMIN_PATH } from "src/constants/paths"
import type { ColumnsType } from "antd/es/table"
import { HeaderWrapper, LessonsHeader, LessonsTitle } from "./CourseForm.styles"

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

function CourseForm() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [allTeachers, setAllTeachers] = useState<UserListItem[]>([])
  const [teachers, setTeachers] = useState<UserListItem[]>([])
  const [lessons, setLessons] = useState<LessonItem[]>([])
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false)
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null)
  const [lessonForm] = Form.useForm()
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false)
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [documentForm] = Form.useForm()
  const [lessonDocumentCounts, setLessonDocumentCounts] = useState<Map<number, number>>(new Map())
  const [isViewDocumentModalVisible, setIsViewDocumentModalVisible] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null)
  const isEditMode = !!id

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true)
        const [subjectsData, teachersData] = await Promise.all([
          getSubjectsApi(1, 1000),
          getUsersApi(1, 1000, "name", "ASC", undefined, { roleCode: "giaovien" })
        ])
        setSubjects(subjectsData.items)
        setAllTeachers(teachersData.items)

        if (id) {
          const courseData = await getCourseByIdApi(Number(id))
          const subjectId = courseData.subject_id
          const filteredTeachers = subjectId
            ? teachersData.items.filter(teacher => teacher.subject_id === subjectId || teacher.subject?.id === subjectId)
            : teachersData.items
          setTeachers(filteredTeachers)

          form.setFieldsValue({
            name: courseData.name,
            subject_id: courseData.subject_id,
            teacher_id: courseData.teacher_id,
            grade: courseData.grade,
            start_date: dayjs(courseData.start_date),
            end_date: dayjs(courseData.end_date),
            price: courseData.price,
            description: courseData.description
          })

          if (courseData.lessons && courseData.lessons.length > 0) {
            const lessonItems: LessonItem[] = courseData.lessons.map(lesson => ({
              id: lesson.id.toString(),
              name: lesson.name,
              dayOfWeek: dayjs(lesson.start).day(),
              startTime: dayjs(lesson.start).format("HH:mm"),
              endTime: dayjs(lesson.end).format("HH:mm"),
              date: dayjs(lesson.start).format("DD/MM/YYYY")
            }))
            setLessons(lessonItems)
          }
        } else {
          setTeachers(teachersData.items)
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

  useEffect(() => {
    const loadAllLessonDocuments = async () => {
      if (!isEditMode || lessons.length === 0) return

      try {
        const lessonIds = lessons
          .map(lesson => lesson.id)
          .filter(id => id && !isNaN(Number(id)))
          .map(id => Number(id))

        if (lessonIds.length === 0) return

        const documentCounts = new Map<number, number>()

        await Promise.all(
          lessonIds.map(async (lessonId) => {
            try {
              const response = await getDocumentsApi(1, 1000, { lessonn_id: lessonId })
              documentCounts.set(lessonId, response.items.length)
            } catch (error) {
              console.error(`Lỗi khi tải tài liệu cho buổi học ${lessonId}:`, error)
              documentCounts.set(lessonId, 0)
            }
          })
        )

        setLessonDocumentCounts(documentCounts)
      } catch (error) {
        console.error("Lỗi khi tải danh sách tài liệu:", error)
      }
    }

    loadAllLessonDocuments()
  }, [isEditMode, lessons])

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
        await updateCourseApi(Number(id), updateData)
        message.success("Cập nhật khóa học thành công")
      } else {

        const createData = {
          ...values,
          start_date: values.start_date.format("YYYY-MM-DD"),
          end_date: values.end_date.format("YYYY-MM-DD"),
          lessonDays: lessons,
        }
        await createCourseApi(createData)
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
    if (editingLesson) {
      handleUpdateLesson()
    } else {
      lessonForm.validateFields().then(values => {
        const newLesson: LessonItem = {
          id: Date.now().toString(),
          name: values.name,
          dayOfWeek: values.dayOfWeek,
          startTime: values.startTime.format("HH:mm"),
          endTime: values.endTime.format("HH:mm")
        }
        setLessons([...lessons, newLesson])
        setIsLessonModalVisible(false)
        lessonForm.resetFields()
      }).catch(() => { })
    }
  }

  const handleLessonModalCancel = () => {
    setIsLessonModalVisible(false)
    setEditingLesson(null)
    lessonForm.resetFields()
  }

  const handleDocumentModalCancel = () => {
    setIsDocumentModalVisible(false)
    setSelectedLessonId(null)
    setDocuments([])
    documentForm.resetFields()
  }

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId))
  }

  const handleEditLesson = (lesson: LessonItem) => {
    setEditingLesson(lesson)
    lessonForm.setFieldsValue({
      name: lesson.name,
      dayOfWeek: lesson.dayOfWeek,
      startTime: dayjs(lesson.startTime, "HH:mm"),
      endTime: dayjs(lesson.endTime, "HH:mm")
    })
    setIsLessonModalVisible(true)
  }

  const handleUpdateLesson = () => {
    lessonForm.validateFields().then(values => {
      if (editingLesson) {
        const updatedLessons = lessons.map(lesson =>
          lesson.id === editingLesson.id
            ? {
              ...lesson,
              name: values.name,
              dayOfWeek: values.dayOfWeek,
              startTime: values.startTime.format("HH:mm"),
              endTime: values.endTime.format("HH:mm")
            }
            : lesson
        )
        setLessons(updatedLessons)
        setIsLessonModalVisible(false)
        setEditingLesson(null)
        lessonForm.resetFields()
      }
    }).catch(() => { })
  }

  const handleOpenDocumentModal = async (lessonId: string) => {
    if (!isEditMode) {
      message.warning("Chỉ có thể xem tài liệu khi đã lưu khóa học")
      return
    }
    const lessonIdNum = parseInt(lessonId)
    setSelectedLessonId(lessonIdNum)
    setIsDocumentModalVisible(true)
    await loadDocuments(lessonIdNum)
  }

  const loadDocuments = async (lessonId: number) => {
    try {
      setLoadingDocuments(true)
      const response = await getDocumentsApi(1, 1000, { lessonn_id: lessonId })
      setDocuments(response.items)
    } catch (error) {
      console.error("Lỗi khi tải tài liệu:", error)
      message.error("Không thể tải danh sách tài liệu")
    } finally {
      setLoadingDocuments(false)
    }
  }

  const handleUploadDocument = async (file: File) => {
    if (!selectedLessonId) return

    try {
      setUploadingDocument(true)

      await uploadDocumentApi({
        file,
        lesson_id: selectedLessonId
      })

      message.success("Upload tài liệu thành công")
      documentForm.setFieldsValue({ file: undefined })
      await loadDocuments(selectedLessonId)

      if (selectedLessonId) {
        const response = await getDocumentsApi(1, 1000, { lessonn_id: selectedLessonId })
        setLessonDocumentCounts(prev => {
          const newMap = new Map(prev)
          newMap.set(selectedLessonId, response.items.length)
          return newMap
        })
      }
    } catch (error: any) {
      message.error(error instanceof Error ? error.message : "Upload tài liệu thất bại")
    } finally {
      setUploadingDocument(false)
    }
  }

  const handleDownloadDocument = (document: Document) => {
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${document.file_path}`
    window.open(url, "_blank")
  }

  const handleViewDocument = (document: Document) => {
    setViewingDocument(document)
    setIsViewDocumentModalVisible(true)
  }

  const handleCloseViewDocument = () => {
    setIsViewDocumentModalVisible(false)
    setViewingDocument(null)
  }

  const getDocumentViewerUrl = (document: Document): string => {
    const fileUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${document.file_path}`
    const encodedUrl = encodeURIComponent(fileUrl)
    const ext = document.file_path?.toLowerCase().split('.').pop() || ''

    if (ext === 'pdf') {
      return fileUrl
    } else if (['doc', 'docx'].includes(ext)) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
    } else if (['ppt', 'pptx'].includes(ext)) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
    } else if (['xls', 'xlsx'].includes(ext)) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
    }

    return fileUrl
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }


  const getLessonColumns = (): ColumnsType<LessonItem> => {
    const baseColumns: ColumnsType<LessonItem> = [
      {
        title: "STT",
        key: "stt",
        width: 60,
        align: "center",
        render: (_: unknown, __: unknown, index: number) => index + 1
      }
    ]

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
        title: "Tên buổi học",
        dataIndex: "name",
        key: "name",
        render: (name: string | undefined) => name || "-"
      },
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
      },
      {
        title: "Tài liệu",
        key: "hasDocuments",
        width: 120,
        align: "center",
        render: (_: unknown, record: LessonItem) => {
          if (!isEditMode || !record.id) {
            return <span>-</span>
          }
          const lessonId = Number(record.id)
          const count = lessonDocumentCounts.get(lessonId) || 0
          return count > 0 ? (
            <Space>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <span>Có ({count})</span>
            </Space>
          ) : (
            <Space>
              <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
              <span>Chưa có</span>
            </Space>
          )
        }
      }
    )

    baseColumns.push({
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_: unknown, record: LessonItem) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditLesson(record)}
          >
            Sửa
          </Button>
          {isEditMode && (
            <Button
              type="link"
              icon={<FileTextOutlined />}
              onClick={() => handleOpenDocumentModal(record.id)}
            >
              Tài liệu
            </Button>
          )}
          {!isEditMode && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteLesson(record.id)}
            >
              Xóa
            </Button>
          )}
        </Space>
      )
    })

    return baseColumns
  }

  const lessonColumns = getLessonColumns()
  const displayLessons = lessons

  return (
    <MainLayout>
      <Card style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
        <HeaderWrapper>
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
        </HeaderWrapper>

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
                <Select
                  placeholder="Chọn môn học"
                  size="large"
                  onChange={(value) => {
                    const filteredTeachers = value
                      ? allTeachers.filter(teacher => teacher.subject_id === value || teacher.subject?.id === value)
                      : allTeachers
                    setTeachers(filteredTeachers)
                    const currentTeacherId = form.getFieldValue("teacher_id")
                    if (currentTeacherId) {
                      const currentTeacher = filteredTeachers.find(t => t.id === currentTeacherId)
                      if (!currentTeacher) {
                        form.setFieldValue("teacher_id", undefined)
                      }
                    }
                  }}
                >
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
                dependencies={["subject_id"]}
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
              <LessonsHeader>
                <LessonsTitle>Danh sách buổi học</LessonsTitle>
                {!isEditMode && (
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={handleAddLesson}
                  />
                )}
              </LessonsHeader>
              <Table
                columns={lessonColumns}
                dataSource={displayLessons}
                rowKey={(record) => record.id}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} buổi học`,
                  pageSizeOptions: ['5', '10', '20', '50']
                }}
                locale={{ emptyText: "Chưa có buổi học nào." }}
                style={{ marginBottom: 8 }}
              />
            </Col>
          </Row>
          {(
            <Row gutter={16}>
              <Col span={24}>
                <CourseStudentsTable courseId={id ? Number(id) : undefined} />
              </Col>
            </Row>
          )}
        </Form>

        <Modal
          title={editingLesson ? "Sửa buổi học" : "Thêm buổi học"}
          open={isLessonModalVisible}
          onOk={handleLessonModalOk}
          onCancel={handleLessonModalCancel}
          okText={editingLesson ? "Cập nhật" : "Thêm"}
          cancelText="Hủy"
        >
          <Form
            form={lessonForm}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label="Tên buổi học"
            >
              <Input placeholder="Nhập tên buổi học (tùy chọn)" />
            </Form.Item>
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

        <Modal
          title="Quản lý tài liệu"
          open={isDocumentModalVisible}
          onCancel={handleDocumentModalCancel}
          footer={null}
          width={800}
        >
          <Form
            form={documentForm}
            layout="vertical"
            style={{ marginBottom: 24 }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="file"
                  label="Chọn file hoặc kéo thả file vào đây"
                >
                  <Upload.Dragger
                    beforeUpload={async (file) => {
                      await handleUploadDocument(file)
                      return false
                    }}
                    maxCount={1}
                    accept=".doc,.docx,.pdf,.png,.jpg,.jpeg,.xls,.xlsx,.ppt,.pptx"
                    showUploadList={false}
                    disabled={uploadingDocument}
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                    </p>
                    <p className="ant-upload-text">Click hoặc kéo thả file vào đây để upload</p>
                    <p className="ant-upload-hint">
                      Hỗ trợ: DOC, DOCX, PDF, PPT, PPTX (tối đa 50MB)
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <div style={{ marginTop: 24 }}>
            <Typography.Title level={5}>Danh sách tài liệu</Typography.Title>
            {loadingDocuments ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Typography.Text>Đang tải...</Typography.Text>
              </div>
            ) : documents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Typography.Text type="secondary">Chưa có tài liệu nào</Typography.Text>
              </div>
            ) : (
              <Table
                columns={[
                  {
                    title: "STT",
                    key: "stt",
                    width: 60,
                    align: "center",
                    render: (_: unknown, __: unknown, index: number) => index + 1
                  },
                  {
                    title: "Tên file",
                    dataIndex: "name",
                    key: "name"
                  },
                  {
                    title: "Loại tài liệu",
                    key: "documentType",
                    render: (_: unknown, record: Document) => record.documentType?.name || "-"
                  },
                  {
                    title: "Kích thước",
                    key: "file_size",
                    render: (_: unknown, record: Document) => formatFileSize(record.file_size)
                  },
                  {
                    title: "Thao tác",
                    key: "action",
                    render: (_: unknown, record: Document) => (
                      <Space>
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewDocument(record)}
                        >
                          Xem
                        </Button>
                        <Button
                          type="link"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadDocument(record)}
                        >
                          Tải xuống
                        </Button>
                      </Space>
                    )
                  }
                ]}
                dataSource={documents}
                rowKey="id"
                pagination={false}
                size="small"
              />
            )}
          </div>
        </Modal>

        <Modal
          title={`Xem tài liệu: ${viewingDocument?.name || ""}`}
          open={isViewDocumentModalVisible}
          onCancel={handleCloseViewDocument}
          footer={null}
          width="90%"
          style={{ top: 20 }}
          styles={{ body: { padding: 0, height: "80vh" } }}
        >
          {viewingDocument && (
            <iframe
              src={getDocumentViewerUrl(viewingDocument)}
              style={{
                width: "100%",
                height: "100%",
                border: "none"
              }}
              title="Document Viewer"
            />
          )}
        </Modal>
      </Card>
    </MainLayout >
  )
}

export default CourseForm

