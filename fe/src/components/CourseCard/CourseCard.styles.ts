import styled from "styled-components"

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
