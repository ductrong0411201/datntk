import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, Spin, message } from "antd"
import { UserOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { getUsersApi } from "src/apis/user.api"
import { getCoursesApi } from "src/apis/course.api"
import type { UserListItem } from "src/@types/user"
import type { Course } from "src/@types/course"
import dayjs from "dayjs"

interface StatisticData {
  totalTeachers: number
  totalStudents: number
  totalCourses: number
}

interface MonthlyStudentData {
  month: string
  count: number
}

interface YearlyCourseData {
  year: string
  count: number
}

function AdminHome() {
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState<StatisticData>({
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0
  })
  const [monthlyStudentData, setMonthlyStudentData] = useState<MonthlyStudentData[]>([])
  const [yearlyCourseData, setYearlyCourseData] = useState<YearlyCourseData[]>([])

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      
      const [teachersData, studentsData, coursesData] = await Promise.all([
        getUsersApi(1, 10000, "name", "ASC", undefined, { roleCode: "giaovien" }),
        getUsersApi(1, 10000, "name", "ASC", undefined, { roleCode: "hocsinh" }),
        getCoursesApi(1, 10000)
      ])

      const teachers = teachersData.items
      const students = studentsData.items
      const courses = coursesData.items

      setStatistics({
        totalTeachers: teachersData.meta.total,
        totalStudents: studentsData.meta.total,
        totalCourses: coursesData.meta.total
      })

      const monthlyData = processMonthlyStudentData(students)
      setMonthlyStudentData(monthlyData)

      const yearlyData = processYearlyCourseData(courses)
      setYearlyCourseData(yearlyData)
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error)
      message.error("Lỗi khi tải dữ liệu thống kê")
    } finally {
      setLoading(false)
    }
  }

  const processMonthlyStudentData = (students: UserListItem[]): MonthlyStudentData[] => {
    const now = dayjs()
    const months: { [key: string]: number } = {}
    
    for (let i = 11; i >= 0; i--) {
      const month = now.subtract(i, "month")
      const monthKey = month.format("MM/YYYY")
      months[monthKey] = 0
    }

    students.forEach(student => {
      if (student.createdAt) {
        const createdDate = dayjs(student.createdAt)
        const monthKey = createdDate.format("MM/YYYY")
        if (months.hasOwnProperty(monthKey)) {
          months[monthKey]++
        }
      }
    })

    return Object.keys(months).map(month => ({
      month,
      count: months[month]
    }))
  }

  const processYearlyCourseData = (courses: Course[]): YearlyCourseData[] => {
    const years: { [key: string]: number } = {}
    
    courses.forEach(course => {
      if (course.createdAt) {
        const year = dayjs(course.createdAt).format("YYYY")
        years[year] = (years[year] || 0) + 1
      }
    })

    const sortedYears = Object.keys(years).sort()
    return sortedYears.map(year => ({
      year,
      count: years[year]
    }))
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ padding: "24px" }}>
      
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số giáo viên"
              value={statistics.totalTeachers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số học sinh"
              value={statistics.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số khóa học"
              value={statistics.totalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Biến động số học sinh theo tháng" style={{ marginBottom: "16px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyStudentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#52c41a" strokeWidth={2} name="Số học sinh" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Số khóa học qua từng năm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyCourseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#fa8c16" name="Số khóa học" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminHome

