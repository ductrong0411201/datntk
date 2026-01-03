import { Button, Row, Col } from "antd"
import { CrownOutlined } from "@ant-design/icons"
import { BannerWrapper, BannerContent, BannerImage } from "./Banner.styles"

const Banner = () => {
  return (
    <BannerWrapper>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={14}>
          <BannerContent>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#fff" }}>
                Lớp Fullstack qua Zoom
              </h1>
              <CrownOutlined style={{ fontSize: "24px", color: "#ffd700" }} />
            </div>
            <p style={{ fontSize: "16px", color: "#fff", lineHeight: "1.6", marginBottom: "24px", opacity: 0.9 }}>
              Học online trực tiếp qua Zoom, phù hợp nếu bạn muốn được review code, chấm bài trực tiếp bởi giảng viên và trợ giảng giàu kinh nghiệm. Giờ học linh hoạt, phù hợp cả sinh viên và người đi làm.
            </p>
            <Button
              type="primary"
              size="large"
              style={{
                background: "#ffd700",
                borderColor: "#ffd700",
                color: "#000",
                fontWeight: "bold",
                height: "48px",
                padding: "0 32px",
                borderRadius: "8px"
              }}
            >
              NHẬN LỘ TRÌNH FULLSTACK
            </Button>
          </BannerContent>
        </Col>
        <Col xs={24} md={10}>
          <BannerImage>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              height: "100%"
            }}>
              <div style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "16px",
                backdropFilter: "blur(10px)"
              }}>
                <div style={{ fontSize: "12px", color: "#fff", marginBottom: "8px", fontWeight: "bold" }}>
                  SƠN ĐẶNG ĐỨNG LỚP
                </div>
                <div style={{
                  width: "100%",
                  height: "120px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff"
                }}>
                  Giảng viên
                </div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "16px",
                backdropFilter: "blur(10px)"
              }}>
                <div style={{ fontSize: "12px", color: "#fff", marginBottom: "8px", fontWeight: "bold" }}>
                  TRỢ GIẢNG HỖ TRỢ
                </div>
                <div style={{
                  width: "100%",
                  height: "120px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff"
                }}>
                  Trợ giảng
                </div>
              </div>
              <div style={{
                gridColumn: "span 2",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "16px",
                backdropFilter: "blur(10px)"
              }}>
                <div style={{ fontSize: "12px", color: "#fff", marginBottom: "8px", fontWeight: "bold" }}>
                  GIẢNG VIÊN CHỮA BÀI
                </div>
                <div style={{
                  width: "100%",
                  height: "100px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff"
                }}>
                  Chữa bài
                </div>
              </div>
            </div>
          </BannerImage>
        </Col>
      </Row>
    </BannerWrapper>
  )
}

export default Banner

