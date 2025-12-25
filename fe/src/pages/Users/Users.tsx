import { useState, useEffect } from "react"
import MainLayout from "src/layouts/MainLayout"
import BaseTable from "src/components/BaseTable/BaseTable"
import { getUsersApi, deleteUserApi, createUserApi, updateUserApi, changePasswordApi, type UserListItem } from "src/apis/user.api"
import { getRolesApi, type Role } from "src/apis/role.api"
import { message, Modal, Form, Input, Select, Button } from "antd"
import { KeyOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"

function Users() {
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null)
  const [changingPasswordUser, setChangingPasswordUser] = useState<UserListItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await getRolesApi(1, 100)
        setRoles(response.items)
      } catch (error) {
        console.error("Lỗi khi tải danh sách vai trò:", error)
      }
    }
    loadRoles()
  }, [])

  const columns: ColumnsType<UserListItem> = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      sorter: true
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      key: "userName",
      sorter: true
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true
    },
    {
      title: "Vai trò",
      dataIndex: ["roleDetail", "name"],
      key: "role",
      render: (_: unknown, record: UserListItem) => record.roleDetail?.name || "Chưa có"
    }
  ]

  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleView = (record: UserListItem) => {
    Modal.info({
      title: "Chi tiết người dùng",
      width: 600,
      content: (
        <div>
          <p><strong>Họ và tên:</strong> {record.name}</p>
          <p><strong>Tên đăng nhập:</strong> {record.userName}</p>
          <p><strong>Email:</strong> {record.email}</p>
          <p><strong>Vai trò:</strong> {record.roleDetail?.name || "Chưa có"}</p>
          <p><strong>Mã vai trò:</strong> {record.roleDetail?.code || "Chưa có"}</p>
        </div>
      )
    })
  }

  const handleEdit = (record: UserListItem) => {
    setEditingUser(record)
    form.setFieldsValue({
      name: record.name,
      userName: record.userName,
      email: record.email,
      role: record.role
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (record: UserListItem): Promise<void> => {
    await deleteUserApi(record.id)
  }

  const handleChangePassword = (record: UserListItem) => {
    setChangingPasswordUser(record)
    passwordForm.resetFields()
    setIsPasswordModalVisible(true)
  }

  const handlePasswordModalOk = async () => {
    try {
      const values = await passwordForm.validateFields()
      if (!changingPasswordUser) return

      setPasswordLoading(true)
      await changePasswordApi(changingPasswordUser.id, values.password)
      message.success("Đổi mật khẩu thành công")
      setIsPasswordModalVisible(false)
      passwordForm.resetFields()
      setChangingPasswordUser(null)
    } catch (error) {
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
    setChangingPasswordUser(null)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (editingUser) {
        await updateUserApi(editingUser.id, values)
        message.success("Cập nhật người dùng thành công")
      } else {
        await createUserApi(values)
        message.success("Tạo người dùng thành công")
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingUser(null)
      setRefreshKey(prev => prev + 1)
    } catch (error) {
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
    setEditingUser(null)
  }

  return (
    <MainLayout>
      <BaseTable<UserListItem>
        title="Danh sách người dùng"
        columns={columns}
        fetchData={getUsersApi}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getDeleteMessage={(record) => `Bạn có chắc chắn muốn xóa người dùng "${record.name}"?`}
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
        title={editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        okText={editingUser ? "Cập nhật" : "Tạo mới"}
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
            <Input placeholder="Nhập tên đăng nhập" disabled={!!editingUser} />
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
          {!editingUser && (
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
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              {roles
                .filter(role => editingUser || role.code !== "admin")
                .map(role => (
                  <Select.Option key={role.id} value={role.id}>
                    {role.name} ({role.code})
                  </Select.Option>
                ))}
            </Select>
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

export default Users

