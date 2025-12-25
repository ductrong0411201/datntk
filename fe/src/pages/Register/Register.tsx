import { useState } from "react"
import { connect, type ConnectedProps as ReduxConnectedProps } from "react-redux"
import { register } from "./Register.thunks"
import { useNavigate, Link } from "react-router-dom"
import { PATH } from "src/constants/paths"
import type { RootState } from "src/reducer/reducer"
import { RegisterContent, RegisterWrapper } from "./Register.styles"
import { Alert, Button, Card, Form, Input, Typography } from "antd"

const mapStateToProps = (state: RootState) => ({
  loading: state.register.loading
})

const mapDispatchToProps = {
  register
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface Props extends ReduxConnectedProps<typeof connector> {}

const Register = (props: Props) => {
  const { register, loading } = props
  const [form] = Form.useForm()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const submit = (values: ReqRegister) => {
    if (loading) return
    setError("")
    setSuccess(false)
    register(values)
      .then(() => {
        setSuccess(true)
        setTimeout(() => {
          navigate(PATH.LOGIN.url, { replace: true })
        }, 2000)
      })
      .catch((err: { payload?: { message?: string }; message?: string }) => {
        setError(err.payload?.message || err.message || "Đăng ký thất bại")
      })
  }

  return (
    <RegisterWrapper>
      <RegisterContent>
        <Card>
          <Typography.Title level={2} style={{ marginBottom: 8, textAlign: "center" }}>
            Đăng ký
          </Typography.Title>
          <Typography.Paragraph style={{ textAlign: "center", color: "#6b7280", marginBottom: 24 }}>
            Tạo tài khoản mới để bắt đầu
          </Typography.Paragraph>
          {error && (
            <Alert
              type="error"
              message={error}
              style={{ marginBottom: 16 }}
              showIcon
            />
          )}
          {success && (
            <Alert
              type="success"
              message="Đăng ký thành công! Đang chuyển đến trang đăng nhập..."
              style={{ marginBottom: 16 }}
              showIcon
            />
          )}
          <Form form={form} layout="vertical" onFinish={submit} autoComplete="off">
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input size="large" placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item
              label="Tên đăng nhập"
              name="userName"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
            >
              <Input size="large" placeholder="Nhập tên đăng nhập" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" }
              ]}
            >
              <Input size="large" placeholder="Nhập email" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
              ]}
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
                Đăng ký
              </Button>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
              <Typography.Text>
                Đã có tài khoản?{" "}
                <Link to={PATH.LOGIN.url}>Đăng nhập ngay</Link>
              </Typography.Text>
            </Form.Item>
          </Form>
        </Card>
      </RegisterContent>
    </RegisterWrapper>
  )
}

export default connector(Register)

