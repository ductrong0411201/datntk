import styled from "styled-components"
import { Typography } from "antd"

const { Title } = Typography

export const CourseCardWrapper = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
  }
`

export const CoverWrapper = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
`

export const CoverImage = styled.img`
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

export const CourseTitle = styled(Title)`
  color: #fff !important;
  margin: 0;
  text-align: center;
  padding: 0 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 32px);
  z-index: 2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  
  &.ant-typography {
    color: #fff !important;
  }
`

export const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TeacherWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`
