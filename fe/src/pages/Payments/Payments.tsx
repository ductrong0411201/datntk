import { useState, useEffect } from "react"
import MainLayout from "src/layouts/MainLayout"
import BaseTable from "src/components/BaseTable/BaseTable"
import { getPaymentsApi, deletePaymentApi, createPaymentApi, updatePaymentApi, type Payment } from "src/apis/payment.api"
import { getUsersApi, type UserListItem } from "src/apis/user.api"
import { getPaymentMethodsApi, type PaymentMethod } from "src/apis/paymentMethod.api"
import { message, Modal, Form, Input, Select, InputNumber, DatePicker } from "antd"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

function Payments() {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, paymentMethodsData] = await Promise.all([
          getUsersApi(1, 1000),
          getPaymentMethodsApi(1, 1000)
        ])
        setUsers(usersData.items)
        setPaymentMethods(paymentMethodsData.items)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error)
      }
    }
    loadData()
  }, [])

  const columns: ColumnsType<Payment> = [
    {
      title: "Người dùng",
      dataIndex: ["user", "name"],
      key: "user",
      render: (_: unknown, record: Payment) => record.user?.name || "N/A"
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: ["paymentMethod", "name"],
      key: "paymentMethod",
      render: (_: unknown, record: Payment) => record.paymentMethod?.name || "N/A"
    },
    {
      title: "Khóa học",
      dataIndex: ["course", "name"],
      key: "course",
      render: (_: unknown, record: Payment) => record.course?.name || "N/A"
    },
    {
      title: "Số tiền",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "date",
      key: "date",
      sorter: true,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY")
    }
  ]

  const handleAdd = () => {
    setEditingPayment(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleView = (record: Payment) => {
    Modal.info({
      title: "Chi tiết thanh toán",
      width: 600,
      content: (
        <div>
          <p><strong>Người dùng:</strong> {record.user?.name || "N/A"}</p>
          <p><strong>Phương thức thanh toán:</strong> {record.paymentMethod?.name || "N/A"}</p>
          <p><strong>Khóa học:</strong> {record.course?.name || "N/A"}</p>
          <p><strong>Số tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price)}</p>
          <p><strong>Ngày thanh toán:</strong> {dayjs(record.date).format("DD/MM/YYYY")}</p>
          {record.description && <p><strong>Mô tả:</strong> {record.description}</p>}
        </div>
      )
    })
  }

  const handleEdit = (record: Payment) => {
    setEditingPayment(record)
    form.setFieldsValue({
      user_id: record.user_id,
      payment_method_id: record.payment_method_id,
      course_id: record.course_id,
      price: record.price,
      description: record.description,
      date: dayjs(record.date)
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (record: Payment): Promise<void> => {
    await deletePaymentApi(record.id)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const paymentData = {
        ...values,
        date: values.date.format("YYYY-MM-DD")
      }

      if (editingPayment) {
        await updatePaymentApi(editingPayment.id, paymentData)
        message.success("Cập nhật thanh toán thành công")
      } else {
        await createPaymentApi(paymentData)
        message.success("Tạo thanh toán thành công")
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingPayment(null)
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
    setEditingPayment(null)
  }

  return (
    <MainLayout>
      <BaseTable<Payment>
        title="Danh sách thanh toán"
        columns={columns}
        fetchData={getPaymentsApi}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getDeleteMessage={(record) => `Bạn có chắc chắn muốn xóa thanh toán này?`}
        loading={loading}
        refreshKey={refreshKey}
      />
      <Modal
        title={editingPayment ? "Sửa thanh toán" : "Thêm thanh toán mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        okText={editingPayment ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="user_id"
            label="Người dùng"
            rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}
          >
            <Select placeholder="Chọn người dùng" showSearch optionFilterProp="children">
              {users.map(user => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name} ({user.userName})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="payment_method_id"
            label="Phương thức thanh toán"
            rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
          >
            <Select placeholder="Chọn phương thức thanh toán">
              {paymentMethods.map(method => (
                <Select.Option key={method.id} value={method.id}>
                  {method.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="course_id"
            label="Khóa học"
            rules={[{ required: true, message: "Vui lòng nhập ID khóa học" }]}
          >
            <InputNumber placeholder="Nhập ID khóa học" style={{ width: "100%" }} min={1} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Số tiền"
            rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
          >
            <InputNumber 
              placeholder="Nhập số tiền" 
              style={{ width: "100%" }} 
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày thanh toán"
            rules={[{ required: true, message: "Vui lòng chọn ngày thanh toán" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
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

export default Payments

