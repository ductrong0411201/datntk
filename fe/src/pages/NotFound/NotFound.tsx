import { Link } from "react-router-dom"
import MainLayout from "src/layouts/MainLayout"
import { PATH } from "src/constants/paths"

export default function NotFound() {
  return (
    <MainLayout>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "60vh",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "6rem", margin: 0, fontWeight: "bold" }}>404</h1>
        <h2 style={{ fontSize: "2rem", margin: "1rem 0" }}>Không tìm thấy trang</h2>
        <p style={{ fontSize: "1.2rem", margin: "1rem 0", color: "#666" }}>
          Bạn không có quyền truy cập trang này hoặc trang không tồn tại.
        </p>
        <Link 
          to={PATH.HOME.url}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 2rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        >
          Về trang chủ
        </Link>
      </div>
    </MainLayout>
  )
}
