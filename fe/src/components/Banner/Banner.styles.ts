import styled from "styled-components"
import { Button } from "antd"

export const BannerWrapper = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 48px;
  margin-bottom: 32px;
  color: #fff;
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`

export const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`

export const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  color: #fff;
`

export const CrownIcon = styled.span`
  font-size: 24px;
  color: #ffd700;
`

export const Description = styled.p`
  font-size: 16px;
  color: #fff;
  line-height: 1.6;
  margin-bottom: 24px;
  opacity: 0.9;
`

export const CTAButton = styled(Button)`
  background: #ffd700;
  border-color: #ffd700;
  color: #000;
  font-weight: bold;
  height: 48px;
  padding: 0 32px;
  border-radius: 8px;

  &:hover {
    background: #ffed4e;
    border-color: #ffed4e;
    color: #000;
  }
`

export const BannerImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export const BannerImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  max-height: 400px;
`

