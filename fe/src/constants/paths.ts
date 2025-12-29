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
    name: "Quản lý vai trò"
  } as PathWithResource,
  USERS: {
    resourceType: "USER",
    url: "/users",
    name: "Quản lý người dùng"
  } as PathWithResource,
  SUBJECTS: {
    resourceType: "SUBJECT",
    url: "/subjects",
    name: "Quản lý môn học"
  } as PathWithResource,
  COURSES: {
    resourceType: "COURSE",
    url: "/courses",
    name: "Quản lý khóa học"
  } as PathWithResource,
  PAYMENTS: {
    resourceType: "PAYMENT",
    url: "/payments",
    name: "Quản lý thanh toán"
  } as PathWithResource,
  PAYMENT_METHODS: {
    resourceType: "PAYMENT_METHOD",
    url: "/payment-methods",
    name: "Quản lý phương thức thanh toán"
  } as PathWithResource,
  TEACHERS: {
    resourceType: "USER",
    url: "/teachers",
    name: "Quản lý giáo viên"
  } as PathWithResource,
  STUDENTS: {
    resourceType: "USER",
    url: "/students",
    name: "Quản lý học sinh"
  } as PathWithResource,
  NOT_FOUND: {
    url: "/404",
    name: "Không tìm thấy"
  } as PathWithoutResource
}


export const ADMIN_PATH = {
  ROLES: {
    resourceType: "ROLE",
    url: "/roles",
    name: "Quản lý vai trò"
  } as PathWithResource,
  USERS: {
    resourceType: "USER",
    url: "/users",
    name: "Quản lý người dùng"
  } as PathWithResource,
  SUBJECTS: {
    resourceType: "SUBJECT",
    url: "/subjects",
    name: "Quản lý môn học"
  } as PathWithResource,
  COURSES: {
    resourceType: "COURSE",
    url: "/courses",
    name: "Quản lý khóa học"
  } as PathWithResource,
  PAYMENTS: {
    resourceType: "PAYMENT",
    url: "/payments",
    name: "Quản lý thanh toán"
  } as PathWithResource,
  PAYMENT_METHODS: {
    resourceType: "PAYMENT_METHOD",
    url: "/payment-methods",
    name: "Quản lý phương thức thanh toán"
  } as PathWithResource,
  TEACHERS: {
    resourceType: "USER",
    url: "/teachers",
    name: "Quản lý giáo viên"
  } as PathWithResource,
  STUDENTS: {
    resourceType: "USER",
    url: "/students",
    name: "Quản lý học sinh"
  } as PathWithResource,

}


export const USER_PATH = {
  COURSES: {
    resourceType: "COURSE",
    url: "/courses",
    name: "Khóa học"
  } as PathWithResource,
  PAYMENTS: {
    resourceType: "PAYMENT",
    url: "/payments",
    name: "Thanh toán"
  } as PathWithResource,
}