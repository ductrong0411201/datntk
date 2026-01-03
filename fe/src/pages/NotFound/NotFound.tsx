import { USER_PATH } from "src/constants/paths"
import {
  NotFoundWrapper,
  ErrorCode,
  ErrorTitle,
  ErrorMessage,
  HomeLink
} from "./NotFound.styles"

export default function NotFound() {
  return (
    <NotFoundWrapper>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>Không tìm thấy trang</ErrorTitle>
      <ErrorMessage>
        Bạn không có quyền truy cập trang này hoặc trang không tồn tại.
      </ErrorMessage>
      <HomeLink to={USER_PATH.HOME.url}>
        Về trang chủ
      </HomeLink>
    </NotFoundWrapper>
  )
}
