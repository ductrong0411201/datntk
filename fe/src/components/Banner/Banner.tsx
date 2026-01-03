import { Row, Col } from "antd"
import { CrownOutlined } from "@ant-design/icons"
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
              <Title>Lớp Fullstack qua Zoom</Title>
              <CrownIcon>
                <CrownOutlined />
              </CrownIcon>
            </TitleWrapper>
            <Description>
              Học online trực tiếp với giảng viên và trợ giảng giàu kinh nghiệm. Review code và chấm bài trực tiếp. Giờ học linh hoạt, phù hợp mọi đối tượng.
            </Description>
            <CTAButton type="primary" size="large">
              NHẬN LỘ TRÌNH FULLSTACK
            </CTAButton>
          </BannerContent>
        </Col>
        <Col xs={24} md={12}>
          <BannerImage>
            <BannerImg 
              src="/director-illustration.png" 
              alt="Director illustration"
            />
          </BannerImage>
        </Col>
      </Row>
    </BannerWrapper>
  )
}

export default Banner

