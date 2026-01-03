import styled from "styled-components"
import { Link } from "react-router-dom"

export const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
`

export const ErrorCode = styled.h1`
  font-size: 8rem;
  margin: 0;
  font-weight: bold;
`

export const ErrorTitle = styled.h2`
  font-size: 2.5rem;
  margin: 1rem 0;
  font-weight: 500;
`

export const ErrorMessage = styled.p`
  font-size: 1.2rem;
  margin: 1rem 0;
  opacity: 0.9;
  max-width: 500px;
`

export const HomeLink = styled(Link)`
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background-color: #fff;
  color: #667eea;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.2s;
  display: inline-block;

  &:hover {
    transform: scale(1.05);
  }
`

