import { useState, useEffect } from "react"
import { Button, Table, Modal, Form, Select, message } from "antd"
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { getCourceStudentsApi, addStudentToCourceApi, removeStudentFromCourceApi } from "src/apis/cource.api"
import { getStudentsApi } from "src/apis/student.api"
import type { CourceStudent } from "src/@types/cource"
import type { UserListItem } from "src/apis/user.api"

interface CourseStudentsTableProps {
  courceId: number | undefined
  title?: string
  readOnly?: boolean
  canEdit?: boolean
  showAddButton?: boolean
  showActions?: boolean
}

function CourseStudentsTable({ 
  courceId, 
  title = "Danh sách học sinh",
  readOnly = false,
  canEdit = true,
  showAddButton = true,
  showActions = true
}: CourseStudentsTableProps) {
  const canModify = !readOnly && canEdit
  const shouldShowAddButton = canModify && showAddButton
  const shouldShowActions = canModify && showActions
  const [students, setStudents] = useState<CourceStudent[]>([])
  const [allStudents, setAllStudents] = useState<UserListItem[]>([])
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false)
  const [studentForm] = Form.useForm()
  const [loadingStudents, setLoadingStudents] = useState(false)

  useEffect(() => {
    if (courceId) {
      loadStudents()
    }
  }, [courceId])

  useEffect(() => {
    if (shouldShowAddButton) {
      loadAllStudents()
    }
  }, [shouldShowAddButton])

  const loadStudents = async () => {
    if (!courceId) return
    try {
      setLoadingStudents(true)
      const studentsData = await getCourceStudentsApi(courceId)
      setStudents(studentsData)
    } catch (error) {
      console.error("Lỗi khi tải danh sách học sinh:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadAllStudents = async () => {
    try {
      const studentsList = await getStudentsApi()
      setAllStudents(studentsList)
    } catch (error) {
      console.error("Lỗi khi tải danh sách học sinh:", error)
    }
  }

  const handleAddStudent = () => {
    if (!courceId) {
      message.error("Vui lòng lưu khóa học trước khi thêm học sinh")
      return
    }
    studentForm.resetFields()
    setIsStudentModalVisible(true)
  }

  const handleStudentModalOk = async () => {
    try {
      const values = await studentForm.validateFields()
      if (!courceId) {
        message.error("Vui lòng lưu khóa học trước khi thêm học sinh")
        return
      }

      setLoadingStudents(true)
      const newStudent = await addStudentToCourceApi(courceId, values.student_id)
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
    if (!courceId) return

    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa học sinh này khỏi khóa học?",
      onOk: async () => {
        try {
          setLoadingStudents(true)
          await removeStudentFromCourceApi(courceId, studentId)
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

  const getStudentColumns = (): ColumnsType<CourceStudent> => {
    const columns: ColumnsType<CourceStudent> = [
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
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        render: (phone: string) => phone || "N/A"
      }
    ]

    if (shouldShowActions) {
      columns.push({
        title: "Thao tác",
        key: "action",
        render: (_: unknown, record: CourceStudent) => (
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

  if (!courceId) {
    return null
  }

  return (
    <>
      <div style={{ marginTop: 16, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 500, fontSize: 16 }}>{title}</span>
        {shouldShowAddButton && (
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={handleAddStudent}
          />
        )}
      </div>
      <Table
        columns={studentColumns}
        dataSource={students}
        rowKey="id"
        pagination={false}
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

