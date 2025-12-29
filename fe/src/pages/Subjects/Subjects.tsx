import { useState } from "react"
import MainLayout from "src/layouts/MainLayout"
import BaseTable from "src/components/BaseTable/BaseTable"
import { getSubjectsApi, deleteSubjectApi, createSubjectApi, updateSubjectApi, type Subject } from "src/apis/subject.api"
import { message, Modal, Form, Input } from "antd"
import type { ColumnsType } from "antd/es/table"

function Subjects() {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const columns: ColumnsType<Subject> = [
    {
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
      sorter: true
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "Không có mô tả"
    }
  ]

  const handleAdd = () => {
    setEditingSubject(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleView = (record: Subject) => {
    Modal.info({
      title: "Chi tiết môn học",
      width: 600,
      content: (
        <div>
          <p><strong>Tên môn học:</strong> {record.name}</p>
          <p><strong>Mô tả:</strong> {record.description || "Không có mô tả"}</p>
        </div>
      )
    })
  }

  const handleEdit = (record: Subject) => {
    setEditingSubject(record)
    form.setFieldsValue({
      name: record.name,
      description: record.description
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (record: Subject): Promise<void> => {
    await deleteSubjectApi(record.id)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (editingSubject) {
        await updateSubjectApi(editingSubject.id, values)
        message.success("Cập nhật môn học thành công")
      } else {
        await createSubjectApi(values)
        message.success("Tạo môn học thành công")
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingSubject(null)
      setRefreshKey(prev => prev + 1)
    } catch (error:any) {
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
    setEditingSubject(null)
  }

  return (
    <MainLayout>
      <BaseTable<Subject>
        title="Danh sách môn học"
        columns={columns}
        fetchData={getSubjectsApi}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getDeleteMessage={(record) => `Bạn có chắc chắn muốn xóa môn học "${record.name}"?`}
        loading={loading}
        refreshKey={refreshKey}
      />
      <Modal
        title={editingSubject ? "Sửa môn học" : "Thêm môn học mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        okText={editingSubject ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea 
              placeholder="Nhập mô tả (tùy chọn)" 
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  )
}

export default Subjects

