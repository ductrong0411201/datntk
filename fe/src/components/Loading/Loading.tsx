import { Spin } from "antd"
import { LoadingWrapper } from "./Loading.styles"

export default function Loading() {
  return (
    <LoadingWrapper>
      <Spin size="large" />
    </LoadingWrapper>
  )
}
