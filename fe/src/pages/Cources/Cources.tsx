import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "src/layouts/MainLayout"
import BaseTable from "src/components/BaseTable/BaseTable"
import { getCourcesApi, deleteCourceApi } from "src/apis/cource.api"
import type { Cource } from "src/@types/cource"
import { Modal } from "antd"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"
import { PATH } from "src/constants/paths"

function Cources() {
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const navigate = useNavigate()

  const columns: ColumnsType<Cource> = [
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
      sorter: true
    },
    {
      title: "Môn học",
      dataIndex: ["subject", "name"],
      key: "subject",
      render: (_: unknown, record: Cource) => record.subject?.name || "N/A"
    },
    {
      title: "Giáo viên",
      dataIndex: ["teacher", "name"],
      key: "teacher",
      render: (_: unknown, record: Cource) => record.teacher?.name || "N/A"
    },
    {
      title: "Khối lớp",
      dataIndex: "grade",
      key: "grade",
      sorter: true
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      sorter: true,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      sorter: true,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    }
  ]

  const handleAdd = () => {
    navigate(`${PATH.COURSES.url}/new`)
  }

  const handleView = (record: Cource) => {
    Modal.info({
      title: "Chi tiết khóa học",
      width: 600,
      content: (
        <div>
          <p><strong>Tên khóa học:</strong> {record.name}</p>
          <p><strong>Môn học:</strong> {record.subject?.name || "N/A"}</p>
          <p><strong>Giáo viên:</strong> {record.teacher?.name || "N/A"}</p>
          <p><strong>Khối lớp:</strong> {record.grade}</p>
          <p><strong>Ngày bắt đầu:</strong> {dayjs(record.start_date).format("DD/MM/YYYY")}</p>
          <p><strong>Ngày kết thúc:</strong> {dayjs(record.end_date).format("DD/MM/YYYY")}</p>
          <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price)}</p>
          {record.description && <p><strong>Mô tả:</strong> {record.description}</p>}
        </div>
      )
    })
  }

  const handleEdit = (record: Cource) => {
    navigate(`${PATH.COURSES.url}/${record.id}/edit`)
  }

  const handleDelete = async (record: Cource): Promise<void> => {
    await deleteCourceApi(record.id)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <MainLayout>
      <BaseTable<Cource>
        title="Danh sách khóa học"
        columns={columns}
        fetchData={getCourcesApi}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getDeleteMessage={(record) => `Bạn có chắc chắn muốn xóa khóa học "${record.name}"?`}
        loading={loading}
        refreshKey={refreshKey}
      />
    </MainLayout>
  )
}

export default Cources

