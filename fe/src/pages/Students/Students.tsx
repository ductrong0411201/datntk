import { useState } from "react"
import MainLayout from "src/layouts/MainLayout"
import BaseTable from "src/components/BaseTable/BaseTable"
import { getStudentsApi, deleteStudentApi, createStudentApi, updateStudentApi, changeStudentPasswordApi, type UserListItem } from "src/apis/student.api"
import { message, Modal, Form, Input, Button, DatePicker } from "antd"
import { KeyOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

function Students() {
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
  const [editingStudent, setEditingStudent] = useState<UserListItem | null>(null)
  const [changingPasswordStudent, setChangingPasswordStudent] = useState<UserListItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchStudents = async (page: number = 1, limit: number = 10) => {
    const students = await getStudentsApi()
    const start = (page - 1) * limit
    const end = start + limit
    return {
      items: students.slice(start, end),
      meta: {
        page,
        limit,
        total: students.length,
        totalPages: Math.ceil(students.length / limit)
      }
    }
  }

  const columns: ColumnsType<UserListItem> = [
    {
      title: "Họ và tên",
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
    }
  ]

  const handleAdd = () => {
    setEditingStudent(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleView = (record: UserListItem) => {
    Modal.info({
      title: "Chi tiết học sinh",
      width: 600,
      content: (
        <div>
          <p><strong>Họ và tên:</strong> {record.name}</p>
          <p><strong>Tên đăng nhập:</strong> {record.userName}</p>
          <p><strong>Email:</strong> {record.email}</p>
          <p><strong>Vai trò:</strong> {record.roleDetail?.name || "Học sinh"}</p>
          {record.phoneNumber && <p><strong>Số điện thoại:</strong> {record.phoneNumber}</p>}
          {record.address && <p><strong>Địa chỉ:</strong> {record.address}</p>}
          {record.dateOfBirth && <p><strong>Ngày sinh:</strong> {dayjs(record.dateOfBirth).format("DD/MM/YYYY")}</p>}
        </div>
      )
    })
  }

  const handleEdit = (record: UserListItem) => {
    setEditingStudent(record)
    form.setFieldsValue({
      name: record.name,
      userName: record.userName,
      email: record.email,
      phoneNumber: record.phoneNumber,
      address: record.address,
      dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : null
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (record: UserListItem): Promise<void> => {
    await deleteStudentApi(record.id)
    setRefreshKey(prev => prev + 1)
  }

  const handleChangePassword = (record: UserListItem) => {
    setChangingPasswordStudent(record)
    passwordForm.resetFields()
    setIsPasswordModalVisible(true)
  }

  const handlePasswordModalOk = async () => {
    try {
      const values = await passwordForm.validateFields()
      if (!changingPasswordStudent) return

      setPasswordLoading(true)
      await changeStudentPasswordApi(changingPasswordStudent.id, values.password)
      message.success("Đổi mật khẩu thành công")
      setIsPasswordModalVisible(false)
      passwordForm.resetFields()
      setChangingPasswordStudent(null)
    } catch (error: any) {
      if (error?.errorFields) {
        return
      }
      message.error(error instanceof Error ? error.message : "Đổi mật khẩu thất bại")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handlePasswordModalCancel = () => {
    setIsPasswordModalVisible(false)
    passwordForm.resetFields()
    setChangingPasswordStudent(null)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const submitData = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null
      }

      if (editingStudent) {
        await updateStudentApi(editingStudent.id, submitData)
        message.success("Cập nhật học sinh thành công")
      } else {
        await createStudentApi(submitData)
        message.success("Tạo học sinh thành công")
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingStudent(null)
      setRefreshKey(prev => prev + 1)
    } catch (error: any) {
      if (error?.errorFields) {
        return
      }
      message.error(error instanceof Error ? error.message : "Thao tác thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setEditingStudent(null)
  }

  return (
    <MainLayout>
      <BaseTable<UserListItem>
        title="Danh sách học sinh"
        columns={columns}
        fetchData={fetchStudents}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getDeleteMessage={(record) => `Bạn có chắc chắn muốn xóa học sinh "${record.name}"?`}
        customActions={(record) => (
          <Button
            type="link"
            icon={<KeyOutlined />}
            onClick={() => handleChangePassword(record)}
            size="small"
            title="Đổi mật khẩu"
          />
        )}
        loading={loading}
        refreshKey={refreshKey}
      />
      <Modal
        title={editingStudent ? "Sửa học sinh" : "Thêm học sinh mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        okText={editingStudent ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="userName"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input placeholder="Nhập tên đăng nhập" disabled={!!editingStudent} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          {!editingStudent && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input.TextArea placeholder="Nhập địa chỉ" rows={2} />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Đổi mật khẩu"
        open={isPasswordModalVisible}
        onOk={handlePasswordModalOk}
        onCancel={handlePasswordModalCancel}
        confirmLoading={passwordLoading}
        okText="Đổi mật khẩu"
        cancelText="Hủy"
      >
        <Form
          form={passwordForm}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp"))
                }
              })
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  )
}

export default Students

