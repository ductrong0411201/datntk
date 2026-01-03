import styled from "styled-components"

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

export const BannerImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

