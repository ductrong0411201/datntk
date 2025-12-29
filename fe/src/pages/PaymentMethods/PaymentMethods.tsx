import { useState } from "react"
import MainLayout from "src/layouts/MainLayout"
import BaseTable from "src/components/BaseTable/BaseTable"
import { getPaymentMethodsApi, deletePaymentMethodApi, createPaymentMethodApi, updatePaymentMethodApi, type PaymentMethod } from "src/apis/paymentMethod.api"
import { message, Modal, Form, Input } from "antd"
import type { ColumnsType } from "antd/es/table"

function PaymentMethods() {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const columns: ColumnsType<PaymentMethod> = [
    {
      title: "Tên phương thức",
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
    setEditingPaymentMethod(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleView = (record: PaymentMethod) => {
    Modal.info({
      title: "Chi tiết phương thức thanh toán",
      width: 600,
      content: (
        <div>
          <p><strong>Tên phương thức:</strong> {record.name}</p>
          <p><strong>Mô tả:</strong> {record.description || "Không có mô tả"}</p>
        </div>
      )
    })
  }

  const handleEdit = (record: PaymentMethod) => {
    setEditingPaymentMethod(record)
    form.setFieldsValue({
      name: record.name,
      description: record.description
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (record: PaymentMethod): Promise<void> => {
    await deletePaymentMethodApi(record.id)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (editingPaymentMethod) {
        await updatePaymentMethodApi(editingPaymentMethod.id, values)
        message.success("Cập nhật phương thức thanh toán thành công")
      } else {
        await createPaymentMethodApi(values)
        message.success("Tạo phương thức thanh toán thành công")
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingPaymentMethod(null)
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
    setEditingPaymentMethod(null)
  }

  return (
    <MainLayout>
      <BaseTable<PaymentMethod>
        title="Danh sách phương thức thanh toán"
        columns={columns}
        fetchData={getPaymentMethodsApi}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getDeleteMessage={(record) => `Bạn có chắc chắn muốn xóa phương thức thanh toán "${record.name}"?`}
        loading={loading}
        refreshKey={refreshKey}
      />
      <Modal
        title={editingPaymentMethod ? "Sửa phương thức thanh toán" : "Thêm phương thức thanh toán mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        okText={editingPaymentMethod ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Tên phương thức"
            rules={[{ required: true, message: "Vui lòng nhập tên phương thức thanh toán" }]}
          >
            <Input placeholder="Nhập tên phương thức thanh toán" />
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

export default PaymentMethods

