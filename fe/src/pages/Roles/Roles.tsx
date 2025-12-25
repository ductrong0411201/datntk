import { useState, useEffect } from "react"
import MainLayout from "src/layouts/MainLayout"
import BaseTable from "src/components/BaseTable/BaseTable"
import { getRolesApi, deleteRoleApi, createRoleApi, updateRoleApi, getRoleByIdApi, type Role } from "src/apis/role.api"
import { getPermissionsApi, type Permission } from "src/apis/permission.api"
import { message, Modal, Form, Input, Checkbox, Table, Divider } from "antd"
import type { ColumnsType } from "antd/es/table"

function Roles() {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [permissions, setPermissions] = useState<Permission[]>([])
  
  const actions = ["CREATE", "READ", "UPDATE", "DELETE"]
  
  const getResourceTypes = () => {
    const resourceTypes = new Set(permissions.map(p => p.resourceType))
    return Array.from(resourceTypes).sort()
  }
  
  const getPermissionId = (resourceType: string, action: string) => {
    return permissions.find(
      p => p.resourceType === resourceType && p.action === action
    )?.id
  }

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getPermissionsApi()
        setPermissions(data)
      } catch (error) {
        message.error("Lấy danh sách permissions thất bại")
      }
    }
    fetchPermissions()
  }, [])

  const columns: ColumnsType<Role> = [
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
      sorter: true
    },
    {
      title: "Mã vai trò",
      dataIndex: "code",
      key: "code",
      sorter: true
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description"
    }
  ]

  const handleAdd = () => {
    setEditingRole(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleView = (record: Role) => {
    Modal.info({
      title: "Chi tiết vai trò",
      width: 600,
      content: (
        <div>
          <p><strong>Tên vai trò:</strong> {record.name}</p>
          <p><strong>Mã vai trò:</strong> {record.code}</p>
          <p><strong>Mô tả:</strong> {record.description || "Không có"}</p>
        </div>
      )
    })
  }

  const handleEdit = async (record: Role) => {
    try {
      setLoading(true)
      const roleDetail = await getRoleByIdApi(record.id)
      setEditingRole(roleDetail)
      const permissionIds = roleDetail.permissions?.map((p: Permission) => p.id) || []
      form.setFieldsValue({
        ...roleDetail,
        permissions: permissionIds
      })
      setIsModalVisible(true)
    } catch (error) {
      message.error("Lấy thông tin vai trò thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (record: Role): Promise<void> => {
    await deleteRoleApi(record.id)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const { permissions, ...roleData } = values
      const payload = {
        ...roleData,
        permissions: permissions || []
      }

      if (editingRole) {
        await updateRoleApi(editingRole.id, payload)
        message.success("Cập nhật vai trò thành công")
      } else {
        await createRoleApi(payload)
        message.success("Tạo vai trò thành công")
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingRole(null)
      setRefreshKey(prev => prev + 1)
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Thao tác thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setEditingRole(null)
  }


  return (
    <MainLayout>
      <BaseTable<Role>
        title="Danh sách vai trò"
        columns={columns}
        fetchData={getRolesApi}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getDeleteMessage={(record) => `Bạn có chắc chắn muốn xóa vai trò "${record.name}"?`}
        loading={loading}
        refreshKey={refreshKey}
      />
      <Modal
        title={editingRole ? "Sửa vai trò" : "Thêm vai trò mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        okText={editingRole ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[{ required: true, message: "Vui lòng nhập tên vai trò" }]}
          >
            <Input placeholder="Nhập tên vai trò" />
          </Form.Item>
          <Form.Item
            name="code"
            label="Mã vai trò"
            rules={[
              { required: true, message: "Vui lòng nhập mã vai trò" },
            ]}
          >
            <Input placeholder="Nhập mã vai trò (VD: ADMIN, USER)" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả" />
          </Form.Item>
          <Divider />
          <Form.Item
            name="permissions"
            label="Quyền truy cập"
          >
            <Checkbox.Group style={{ width: "100%" }}>
                <div style={{ maxHeight: "400px", overflow: "auto" }}>
                  <Table
                  dataSource={getResourceTypes().map((resourceType, index) => ({
                    key: index,
                    resourceType
                  }))}
                  columns={[
                    {
                      title: "Resource Type",
                      dataIndex: "resourceType",
                      key: "resourceType",
                      width: 150,
                      fixed: "left"
                    },
                    ...actions.map(action => ({
                      title: action,
                      key: action,
                      align: "center" as const,
                      width: 100,
                      render: (_: any, record: { resourceType: string }) => {
                        const permissionId = getPermissionId(record.resourceType, action)
                        if (!permissionId) return null
                        
                        return (
                          <Checkbox value={permissionId} />
                        )
                      }
                    }))
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                />
                </div>
              </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  )
}

export default Roles

