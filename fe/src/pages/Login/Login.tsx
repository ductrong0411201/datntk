import { useState, useEffect } from "react"
import { connect, type ConnectedProps as ReduxConnectedProps } from "react-redux"
import { login } from "./Login.thunks"
import { useNavigate, Link } from "react-router-dom"
import { PATH, ADMIN_PATH, USER_PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import { LoginContent, LoginWrapper } from "./Login.styles"
import { Alert, Button, Card, Form, Input, Typography } from "antd"

const mapStateToProps = (state: RootState) => ({
  loading: state.login.loading,
  user: state.app.user
})

const mapDispatchToProps = {
  login
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface Props extends ReduxConnectedProps<typeof connector> {}

const Login = (props: Props) => {
  const { login, loading, user } = props
  const [form] = Form.useForm()
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const userRole = user.roleDetail?.code
      const homePath = (userRole === "admin" || userRole === "quanly") ? ADMIN_PATH.HOME.url : USER_PATH.HOME.url
      navigate(homePath, { replace: true })
    }
  }, [user, navigate])

  const submit = (values: ReqLogin) => {
    if (loading) return
    setError("")
    login(values)
      .catch((err: { payload?: { message?: string } }) => {
        setError(err.payload?.message || "Đăng nhập thất bại")
      })
      .catch((err: { payload?: { message?: string } }) => {
        setError(err.payload?.message || "Đăng nhập thất bại")
      })
  }

  return (
    <LoginWrapper>
      <LoginContent>
        <Card>
          <Typography.Title level={2} style={{ marginBottom: 8, textAlign: "center" }}>
            Đăng nhập
          </Typography.Title>
          <Typography.Paragraph style={{ textAlign: "center", color: "#6b7280", marginBottom: 24 }}>
            Nhập thông tin tài khoản để tiếp tục
          </Typography.Paragraph>
          {error && (
            <Alert
              type="error"
              message={error}
              style={{ marginBottom: 16 }}
              showIcon
            />
          )}
          <Form form={form} layout="vertical" onFinish={submit} autoComplete="off">
            <Form.Item
              label="Tên đăng nhập hoặc email"
              name="userNameOrEmail"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập hoặc email" }]}
            >
              <Input size="large" placeholder="Nhập tên đăng nhập hoặc email" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password size="large" placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
              <Typography.Text>
                Chưa có tài khoản?{" "}
                <Link to={PATH.REGISTER.url}>Đăng ký ngay</Link>
              </Typography.Text>
            </Form.Item>
          </Form>
        </Card>
      </LoginContent>
    </LoginWrapper>
  )
}

export default connector(Login)
