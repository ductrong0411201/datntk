import { Row, Col } from "antd"
import { CrownOutlined } from "@ant-design/icons"
import bannerImage from "src/assets/images/banner.jpg"
import {
  BannerWrapper,
  BannerContent,
  TitleWrapper,
  Title,
  CrownIcon,
  Description,
  CTAButton,
  BannerImage,
  BannerImg
} from "./Banner.styles"

const Banner = () => {
  return (
    <BannerWrapper>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={12}>
          <BannerContent>
            <TitleWrapper>
              <Title>Trung tâm dạy thêm Thế Kiên</Title>
              <CrownIcon>
                <CrownOutlined />
              </CrownIcon>
            </TitleWrapper>
            <Description>
              Học trực tiếp với giảng viên và trợ giảng giàu kinh nghiệm. Chấm bài trực tiếp. Giờ học linh hoạt, phù hợp mọi đối tượng.
            </Description>
            <CTAButton type="primary" size="large">
              ĐĂNG KÝ NGAY
            </CTAButton>
          </BannerContent>
        </Col>
        <Col xs={24} md={12}>
          <BannerImage>
            <BannerImg
              src={bannerImage}
              alt="Banner illustration"
            />
          </BannerImage>
        </Col>
      </Row>
    </BannerWrapper>
  )
}

export default Banner

