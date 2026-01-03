import { useState, useEffect } from "react"
import { Button, Table, Modal, Form, Select, message } from "antd"
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { getCourseStudentsApi, addStudentToCourseApi, removeStudentFromCourseApi } from "src/apis/course.api"
import { getUsersApi } from "src/apis/user.api"
import type { CourseStudent } from "src/@types/course"
import type { UserListItem } from "src/@types/user"
import dayjs from "dayjs"
import { TitleWrapper, TitleText } from "./CourseStudentsTable.styles"

interface CourseStudentsTableProps {
  courseId: number | undefined
  title?: string
  readOnly?: boolean
  canEdit?: boolean
  showAddButton?: boolean
  showActions?: boolean
}

function CourseStudentsTable({ 
  courseId, 
  title = "Danh sách học sinh",
  readOnly = false,
  canEdit = true,
  showAddButton = true,
  showActions = true
}: CourseStudentsTableProps) {
  const canModify = !readOnly && canEdit
  const shouldShowAddButton = canModify && showAddButton
  const shouldShowActions = canModify && showActions
  const [students, setStudents] = useState<CourseStudent[]>([])
  const [allStudents, setAllStudents] = useState<UserListItem[]>([])
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false)
  const [studentForm] = Form.useForm()
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })

  useEffect(() => {
    if (courseId) {
      loadStudents()
    }
  }, [courseId])

  useEffect(() => {
    if (shouldShowAddButton) {
      loadAllStudents()
    }
  }, [shouldShowAddButton])

  const loadStudents = async () => {
    if (!courseId) return
    try {
      setLoadingStudents(true)
      const studentsData = await getCourseStudentsApi(courseId)
      setStudents(studentsData)
    } catch (error) {
      console.error("Lỗi khi tải danh sách học sinh:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadAllStudents = async () => {
    try {
      const studentsList = await getUsersApi(1, 1000, "name", "ASC", undefined, { roleCode: "hocsinh" })
      setAllStudents(studentsList.items)
    } catch (error) {
      console.error("Lỗi khi tải danh sách học sinh:", error)
    }
  }

  const handleAddStudent = () => {
    if (!courseId) {
      message.error("Vui lòng lưu khóa học trước khi thêm học sinh")
      return
    }
    studentForm.resetFields()
    setIsStudentModalVisible(true)
  }

  const handleStudentModalOk = async () => {
    try {
      const values = await studentForm.validateFields()
      if (!courseId) {
        message.error("Vui lòng lưu khóa học trước khi thêm học sinh")
        return
      }

      setLoadingStudents(true)
      const newStudent = await addStudentToCourseApi(courseId, values.student_id)
      setStudents([...students, newStudent])
      setIsStudentModalVisible(false)
      studentForm.resetFields()
      message.success("Thêm học sinh vào khóa học thành công")
    } catch (error: any) {
      if (error?.errorFields) {
        return
      }
      message.error(error instanceof Error ? error.message : "Thêm học sinh thất bại")
    } finally {
      setLoadingStudents(false)
    }
  }

  const handleStudentModalCancel = () => {
    setIsStudentModalVisible(false)
    studentForm.resetFields()
  }

  const handleDeleteStudent = async (studentId: number) => {
    if (!courseId) return

    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa học sinh này khỏi khóa học?",
      onOk: async () => {
        try {
          setLoadingStudents(true)
          await removeStudentFromCourseApi(courseId, studentId)
          setStudents(students.filter(s => s.id !== studentId))
          message.success("Xóa học sinh khỏi khóa học thành công")
        } catch (error: any) {
          message.error(error instanceof Error ? error.message : "Xóa học sinh thất bại")
        } finally {
          setLoadingStudents(false)
        }
      }
    })
  }

  const getStudentColumns = (): ColumnsType<CourseStudent> => {
    const columns: ColumnsType<CourseStudent> = [
      {
        title: "STT",
        key: "stt",
        width: 60,
        align: "center",
        render: (_: unknown, __: unknown, index: number) => {
          return (pagination.current - 1) * pagination.pageSize + index + 1
        }
      },
      {
        title: "Họ và tên",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Ngày sinh",
        dataIndex: "dateOfBirth",
        key: "dateOfBirth",
        render: (dateOfBirth: string) => dateOfBirth ? dayjs(dateOfBirth).format("DD/MM/YYYY") : "N/A"
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        render: (phoneNumber: string) => phoneNumber || ""
      }
    ]

    if (shouldShowActions) {
      columns.push({
        title: "Thao tác",
        key: "action",
        render: (_: unknown, record: CourseStudent) => (
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteStudent(record.id)}
            loading={loadingStudents}
          >
            Xóa
          </Button>
        )
      })
    }

    return columns
  }

  const studentColumns = getStudentColumns()

  if (!courseId) {
    return null
  }

  return (
    <>
      <TitleWrapper>
        <TitleText>{title}</TitleText>
        {shouldShowAddButton && (
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={handleAddStudent}
          />
        )}
      </TitleWrapper>
      <Table
        columns={studentColumns}
        dataSource={students}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: students.length,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} học sinh`,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize: pageSize || 10 })
          },
          onShowSizeChange: (_current, size) => {
            setPagination({ current: 1, pageSize: size })
          }
        }}
        loading={loadingStudents}
        locale={{ emptyText: "Chưa có học sinh nào." }}
      />

      {shouldShowAddButton && (
        <Modal
          title="Thêm học sinh vào khóa học"
          open={isStudentModalVisible}
          onOk={handleStudentModalOk}
          onCancel={handleStudentModalCancel}
          okText="Thêm"
          cancelText="Hủy"
          confirmLoading={loadingStudents}
        >
          <Form
            form={studentForm}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              name="student_id"
              label="Học sinh"
              rules={[{ required: true, message: "Vui lòng chọn học sinh" }]}
            >
              <Select
                placeholder="Chọn học sinh"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {allStudents
                  .filter(student => !students.some(s => s.id === student.id))
                  .map(student => (
                    <Select.Option key={student.id} value={student.id}>
                      {student.name} ({student.userName}) - {student.email}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  )
}

export default CourseStudentsTable

