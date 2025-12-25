import type { PathWithResource, PathWithoutResource } from "../@types/permission"

export const PATH = {
  HOME: {
    url: "/",
    name: "Trang chủ"
  } as PathWithoutResource,
  LOGIN: {
    url: "/login",
    name: "Đăng nhập"
  } as PathWithoutResource,
  REGISTER: {
    url: "/register",
    name: "Đăng ký"
  } as PathWithoutResource,
  ROLES: {
    resourceType: "ROLE",
    url: "/roles",
    name: "Vai trò"
  } as PathWithResource,
  USERS: {
    resourceType: "USER",
    url: "/users",
    name: "Người dùng"
  } as PathWithResource,
  NOT_FOUND: {
    url: "/404",
    name: "Không tìm thấy"
  } as PathWithoutResource
}
