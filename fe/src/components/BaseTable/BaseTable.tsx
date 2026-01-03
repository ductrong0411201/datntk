import React, { useEffect, useState } from "react"
import { Table, Button, Space, Typography, Card, message, Modal, Pagination, Input, Select } from "antd"
import { ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import type { TableProps } from "antd/es/table"
import {
  BaseTableWrapper,
  TableContainer,
  HeaderContainer,
  HeaderTop,
  FiltersContainer,
  TableWrapper,
  TableContent,
  PaginationWrapper
} from "./BaseTable.styles"

const { Title } = Typography

interface FilterOption {
  field: string
  label: string
  options: { label: string; value: string | number }[]
}

interface BaseTableProps<T> {
  title: string
  columns: TableProps<T>["columns"]
  fetchData: (page: number, limit: number, sortBy?: string, sortOrder?: "ASC" | "DESC", search?: string, filters?: Record<string, any>) => Promise<{
    items: T[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>
  onAdd?: () => void
  onView?: (record: T) => void
  onEdit?: (record: T) => void
  onDelete?: (record: T) => Promise<void>
  getDeleteMessage?: (record: T) => string
  customActions?: (record: T) => React.ReactNode
  filterOptions?: FilterOption[]
  loading?: boolean
  refreshKey?: number
}

const { Search } = Input

function BaseTable<T extends { id: string | number }>(props: BaseTableProps<T>) {
  const { title, columns, fetchData, onAdd, onView, onEdit, onDelete, getDeleteMessage, customActions, filterOptions, loading: externalLoading, refreshKey } = props
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [sortInfo, setSortInfo] = useState<{
    field?: string
    order?: "ascend" | "descend"
  }>({})
  const [searchValue, setSearchValue] = useState<string>("")
  const [filters, setFilters] = useState<Record<string, any>>({})
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const paginationRef = React.useRef<HTMLDivElement>(null)
  const tableWrapperRef = React.useRef<HTMLDivElement>(null)
  const tableContentRef = React.useRef<HTMLDivElement>(null)
  const [tableHeight, setTableHeight] = useState<number>(0)

  useEffect(() => {
    const calculateTableHeight = () => {
      if (tableWrapperRef.current && paginationRef.current && tableContentRef.current) {
        // Sử dụng getBoundingClientRect để có giá trị chính xác hơn
        const wrapperRect = tableWrapperRef.current.getBoundingClientRect()
        const paginationRect = paginationRef.current.getBoundingClientRect()
        const contentRect = tableContentRef.current.getBoundingClientRect()
        
        // Tính chiều cao từ top của wrapper đến top của pagination
        // Đây là không gian thực tế có sẵn cho table
        let height = paginationRect.top - wrapperRect.top
        
        // Nếu có thể đo từ content, sử dụng giá trị đó để chính xác hơn
        if (contentRect.height > 0) {
          // Chiều cao của content trừ đi một chút để đảm bảo không bị overflow
          height = contentRect.height - 1
        }
        
        // Đảm bảo chiều cao không âm và có giá trị tối thiểu
        setTableHeight(Math.max(height, 200))
      }
    }

    // Delay để đảm bảo DOM đã render xong, đặc biệt khi data hoặc pageSize thay đổi
    const timeoutId1 = setTimeout(calculateTableHeight, 100)
    const timeoutId2 = setTimeout(calculateTableHeight, 250)
    
    // Tính toán ngay lập tức nếu có thể
    calculateTableHeight()
    
    const resizeObserver = new ResizeObserver(() => {
      // Delay nhỏ khi resize để tránh tính toán quá nhiều lần
      setTimeout(calculateTableHeight, 50)
    })
    
    if (tableWrapperRef.current) {
      resizeObserver.observe(tableWrapperRef.current)
    }
    if (paginationRef.current) {
      resizeObserver.observe(paginationRef.current)
    }
    if (tableContentRef.current) {
      resizeObserver.observe(tableContentRef.current)
    }

    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
      resizeObserver.disconnect()
    }
  }, [data, pagination.current, pagination.pageSize, pagination.total])

  const loadData = async (
    page: number = pagination.current,
    limit: number = pagination.pageSize,
    sortBy?: string,
    sortOrder?: "ASC" | "DESC",
    search?: string,
    filterValues?: Record<string, any>
  ) => {
    try {
      setLoading(true)
      const response = await fetchData(page, limit, sortBy, sortOrder, search, filterValues)
      setData(response.items)
      setPagination(prev => ({
        ...prev,
        current: response.meta.page,
        pageSize: response.meta.limit,
        total: response.meta.total
      }))
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Lỗi khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (refreshKey !== undefined && refreshKey > 0) {
      const sortBy = sortInfo.field
      const sortOrder = sortInfo.order === "ascend" ? "ASC" : sortInfo.order === "descend" ? "DESC" : undefined
      loadData(pagination.current, pagination.pageSize, sortBy, sortOrder, searchValue || undefined, Object.keys(filters).length > 0 ? filters : undefined)
    }
  }, [refreshKey])

  const handleTableChange = (
    paginationConfig: any,
    _filters: any,
    sorter: any
  ) => {
    const page = paginationConfig?.current || pagination.current
    const pageSize = paginationConfig?.pageSize || pagination.pageSize
    const sortBy = sorter?.field
    const sortOrder = sorter?.order === "ascend" ? "ASC" : sorter?.order === "descend" ? "DESC" : undefined
    
    if (sortBy) {
      setSortInfo({
        field: sortBy,
        order: sorter.order
      })
    }
    
    loadData(page, pageSize, sortBy, sortOrder, searchValue || undefined, Object.keys(filters).length > 0 ? filters : undefined)
  }

  const handleReload = () => {
    const sortBy = sortInfo.field
    const sortOrder = sortInfo.order === "ascend" ? "ASC" : sortInfo.order === "descend" ? "DESC" : undefined
    loadData(pagination.current, pagination.pageSize, sortBy, sortOrder, searchValue || undefined, Object.keys(filters).length > 0 ? filters : undefined)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination(prev => ({ ...prev, current: 1 }))
    const sortBy = sortInfo.field
    const sortOrder = sortInfo.order === "ascend" ? "ASC" : sortInfo.order === "descend" ? "DESC" : undefined
    loadData(1, pagination.pageSize, sortBy, sortOrder, value || undefined, Object.keys(filters).length > 0 ? filters : undefined)
  }

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...filters }
    if (value === undefined || value === null || value === "") {
      delete newFilters[field]
    } else {
      newFilters[field] = value
    }
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, current: 1 }))
    const sortBy = sortInfo.field
    const sortOrder = sortInfo.order === "ascend" ? "ASC" : sortInfo.order === "descend" ? "DESC" : undefined
    loadData(1, pagination.pageSize, sortBy, sortOrder, searchValue || undefined, Object.keys(newFilters).length > 0 ? newFilters : undefined)
  }

  const handleDelete = (record: T) => {
    if (!onDelete) return

    const defaultMessage = "Bạn có chắc chắn muốn xóa bản ghi này?"
    const deleteMessage = getDeleteMessage ? getDeleteMessage(record) : defaultMessage

    Modal.confirm({
      title: "Xác nhận xóa",
      content: deleteMessage,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await onDelete(record)
          message.success("Xóa thành công")
          loadData(pagination.current, pagination.pageSize)
        } catch (error) {
          message.error(error instanceof Error ? error.message : "Xóa thất bại")
        }
      }
    })
  }

  const sttColumn = [
    {
      title: "STT",
      key: "stt",
      width: 80,
      fixed: "left" as const,
      render: (_: unknown, __: T, index: number) => {
        const stt = (pagination.current - 1) * pagination.pageSize + index + 1
        return stt
      }
    }
  ]

  const actionColumns = [
    {
      title: "Hành động",
      key: "action",
      width: customActions ? 180 : 120,
      fixed: "right" as const,
      render: (_: unknown, record: T) => (
        <Space size="middle">
          {onView && (
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              size="small"
              title="Xem"
            />
          )}
          {onEdit && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
              title="Sửa"
            />
          )}
          {customActions && customActions(record)}
          {onDelete && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              size="small"
              title="Xóa"
            />
          )}
        </Space>
      )
    }
  ]

  const tableColumns = [...sttColumn, ...(columns || []), ...actionColumns]

  return (
    <BaseTableWrapper>
      <Card>
        <TableContainer ref={tableContainerRef}>
          <HeaderContainer ref={headerRef}>
            <HeaderTop>
              <Title level={4} style={{ margin: 0 }}>
                {title}
              </Title>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReload}
                  loading={loading || externalLoading}
                >
                  Làm mới
                </Button>
                {onAdd && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAdd}
                  >
                    Thêm mới
                  </Button>
                )}
              </Space>
            </HeaderTop>
            <FiltersContainer>
              <Search
                placeholder="Tìm kiếm..."
                allowClear
                style={{ width: 300 }}
                onSearch={handleSearch}
                onChange={(e) => {
                  if (!e.target.value) {
                    handleSearch("")
                  }
                }}
              />
              {filterOptions && filterOptions.length > 0 && (
                <>
                  {filterOptions.map(filter => (
                    <Select
                      key={filter.field}
                      placeholder={filter.label}
                      allowClear
                      style={{ minWidth: 150 }}
                      value={filters[filter.field]}
                      onChange={(value) => handleFilterChange(filter.field, value)}
                    >
                      {filter.options.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  ))}
                </>
              )}
            </FiltersContainer>
          </HeaderContainer>
          <TableWrapper ref={tableWrapperRef}>
            <TableContent ref={tableContentRef}>
              <Table<T>
                columns={tableColumns}
                dataSource={data}
                rowKey="id"
                loading={loading || externalLoading}
                pagination={false}
                onChange={handleTableChange}
                scroll={{ x: "max-content", y: tableHeight }}
              />
            </TableContent>
            <PaginationWrapper ref={paginationRef}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger
                showTotal={(total) => `Tổng ${total} bản ghi`}
                pageSizeOptions={["10", "20", "50", "100"]}
                locale={{
                  items_per_page: " / trang"
                }}
                onChange={(page, pageSize) => {
                  const sortBy = sortInfo.field
                  const sortOrder = sortInfo.order === "ascend" ? "ASC" : sortInfo.order === "descend" ? "DESC" : undefined
                  loadData(page, pageSize, sortBy, sortOrder, searchValue || undefined, Object.keys(filters).length > 0 ? filters : undefined)
                }}
                onShowSizeChange={(_current, size) => {
                  const sortBy = sortInfo.field
                  const sortOrder = sortInfo.order === "ascend" ? "ASC" : sortInfo.order === "descend" ? "DESC" : undefined
                  loadData(1, size, sortBy, sortOrder, searchValue || undefined, Object.keys(filters).length > 0 ? filters : undefined)
                }}
              />
            </PaginationWrapper>
          </TableWrapper>
        </TableContainer>
      </Card>
    </BaseTableWrapper>
  )
}

export default BaseTable

