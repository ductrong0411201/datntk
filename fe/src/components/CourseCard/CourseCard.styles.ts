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

export const CoverWrapper = styled.div<{ gradient: string }>`
  height: 200px;
  background: ${props => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const CourseTitle = styled(Title)`
  color: #fff;
  margin: 0;
  text-align: center;
  padding: 0 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 32px);
  z-index: 1;
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
