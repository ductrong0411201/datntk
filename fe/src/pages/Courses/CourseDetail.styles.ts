import styled from "styled-components"
import { Card, Typography, Button } from "antd"

export const DetailWrapper = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`

export const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

export const RightSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const VideoCard = styled(Card)`
  .ant-card-body {
    padding: 0;
  }
`

export const VideoThumbnail = styled.div<{ gradient?: string }>`
  width: 100%;
  aspect-ratio: 16/9;
  background: ${props => props.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
    z-index: 1;
  }
  
  .play-button {
    font-size: 64px;
    margin-bottom: 16px;
    z-index: 2;
    position: relative;
  }
  
  .video-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    padding: 0 16px;
    z-index: 2;
    position: relative;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
`

export const VideoThumbnailImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 0.3s ease;
  z-index: 0;
`

export const VideoLink = styled.a`
  display: block;
  padding: 16px;
  text-align: center;
  color: #1890ff;
  text-decoration: none;
  
  &:hover {
    color: #40a9ff;
  }
`

export const PriceCard = styled(Card)`
  position: sticky;
  top: 24px;
  height: fit-content;

  .ant-card-body {
    padding: 24px;
  }
`

export const PriceSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

export const PriceAmount = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #ff6600;
  margin-bottom: 8px;
`

export const ActionButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: bold;
`

export const InfoCard = styled(Card)`
  .ant-card-body {
    padding: 24px;
  }
`

export const SectionTitle = styled(Typography.Title)`
  margin-bottom: 16px !important;
`

export const LearningPoints = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const LearningPoint = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  
  .icon {
    color: #ff4d4f;
    font-size: 20px;
    margin-top: 2px;
    flex-shrink: 0;
  }
`

export const CourseContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

export const CourseContentSummary = styled.div`
  color: #8c8c8c;
  font-size: 14px;
`

export const ExpandLink = styled.a`
  color: #1890ff;
  text-decoration: none;
  
  &:hover {
    color: #40a9ff;
  }
`

export const LessonItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .lesson-name {
    flex: 1;
    color: #262626;
  }
  
  .lesson-duration {
    color: #8c8c8c;
    font-size: 14px;
  }
`

export const CourseInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`

export const CourseInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #595959;
  
  .icon {
    font-size: 18px;
    color: #8c8c8c;
  }
`

export const PaymentModalContent = styled.div`
  padding: 8px 0;
`

export const PaymentInfo = styled.div`
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 24px;
  
  div {
    margin-top: 8px;
  }
`

export const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 24px;
`

export const QRCodeImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: contain;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
`

export const PaymentButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`

