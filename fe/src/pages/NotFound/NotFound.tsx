import { Link } from "react-router-dom"
import { USER_PATH } from "src/constants/paths"

export default function NotFound() {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      textAlign: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff"
    }}>
      <h1 style={{ fontSize: "8rem", margin: 0, fontWeight: "bold" }}>404</h1>
      <h2 style={{ fontSize: "2.5rem", margin: "1rem 0", fontWeight: 500 }}>Không tìm thấy trang</h2>
      <p style={{ fontSize: "1.2rem", margin: "1rem 0", opacity: 0.9, maxWidth: "500px" }}>
        Bạn không có quyền truy cập trang này hoặc trang không tồn tại.
      </p>
      <Link 
        to={USER_PATH.HOME.url}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 2rem",
          backgroundColor: "#fff",
          color: "#667eea",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "bold",
          transition: "transform 0.2s",
          display: "inline-block"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        Về trang chủ
      </Link>
    </div>
  )
}
