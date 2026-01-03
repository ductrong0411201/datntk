import type { PathWithResource, PathWithoutResource } from "../@types/permission"

export const PATH = {
  LOGIN: {
    url: "/login",
    name: "Đăng nhập"
  } as PathWithoutResource,
  REGISTER: {
    url: "/register",
    name: "Đăng ký"
  } as PathWithoutResource,
  NOT_FOUND: {
    url: "/404",
    name: "Không tìm thấy"
  } as PathWithoutResource
}

export const ADMIN_PATH = {
  HOME: {
    url: "/admin",
    name: "Trang chủ"
  } as PathWithoutResource,
  ROLES: {
    resourceType: "ROLE",
    url: "/admin/roles",
    name: "Quản lý vai trò"
  } as PathWithResource,
  USERS: {
    resourceType: "USER",
    url: "/admin/users",
    name: "Quản lý người dùng"
  } as PathWithResource,
  SUBJECTS: {
    resourceType: "SUBJECT",
    url: "/admin/subjects",
    name: "Quản lý môn học"
  } as PathWithResource,
  COURSES: {
    resourceType: "COURSE",
    url: "/admin/courses",
    name: "Quản lý khóa học"
  } as PathWithResource,
  PAYMENTS: {
    resourceType: "PAYMENT",
    url: "/admin/payments",
    name: "Quản lý thanh toán"
  } as PathWithResource,
  PAYMENT_METHODS: {
    resourceType: "PAYMENT_METHOD",
    url: "/admin/payment-methods",
    name: "Quản lý phương thức thanh toán"
  } as PathWithResource,
  TEACHERS: {
    resourceType: "USER",
    url: "/admin/teachers",
    name: "Quản lý giáo viên"
  } as PathWithResource,
  STUDENTS: {
    resourceType: "USER",
    url: "/admin/students",
    name: "Quản lý học sinh"
  } as PathWithResource
}

export const USER_PATH = {
  HOME: {
    url: "/",
    name: "Trang chủ"
  } as PathWithoutResource,
  COURSES: {
    resourceType: "COURSE",
    url: "/my-courses",
    name: "Khóa học của tôi"
  } as PathWithResource,
  COURSE_DETAIL: {
    url: "/courses/:id",
    name: "Chi tiết khóa học"
  } as PathWithoutResource,
}
