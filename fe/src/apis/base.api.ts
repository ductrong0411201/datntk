import axios, { type AxiosRequestConfig, type Method } from "axios"

const getApiBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  if (import.meta.env.DEV) {
    return '/api'
  }
  return "http://localhost:3000"
}

const api = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true
})

type RequestConfig = Omit<AxiosRequestConfig, "url" | "method" | "data">

const request = async <T>(
  method: Method,
  url: string,
  payload?: unknown,
  config?: RequestConfig
): Promise<T> => {
  try {
    const token = localStorage.getItem("token")
    const headers = {
      ...config?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
    
    const res = await api.request<T>({
      method,
      url,
      data: payload,
      headers,
      ...config
    })
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message =
        (err.response?.data as { error?: string; message?: string })?.error ||
        (err.response?.data as { error?: string; message?: string })?.message ||
        err.message ||
        "Request failed"
      throw new Error(message)
    }
    throw err
  }
}

export const apiClient = {
  get: <T>(url: string, config?: RequestConfig) =>
    request<T>("GET", url, undefined, config),
  post: <T>(url: string, payload?: unknown, config?: RequestConfig) =>
    request<T>("POST", url, payload, config),
  put: <T>(url: string, payload?: unknown, config?: RequestConfig) =>
    request<T>("PUT", url, payload, config),
  patch: <T>(url: string, payload?: unknown, config?: RequestConfig) =>
    request<T>("PATCH", url, payload, config),
  delete: <T>(url: string, config?: RequestConfig) =>
    request<T>("DELETE", url, undefined, config)
}

export default apiClient
