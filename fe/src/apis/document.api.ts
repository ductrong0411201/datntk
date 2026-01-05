import { apiClient } from "./base.api"
import type { UploadDocumentData, Document, DocumentResponse, DocumentListResponse } from "../@types/document"

export interface DocumentType {
  id: number
  name: string
  code: string
}

export interface DocumentTypeListResponse {
  status: number
  data: {
    items: DocumentType[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message: string
}

export const getDocumentsApi = async (
  page: number = 1,
  limit: number = 1000,
  filters?: Record<string, any>
): Promise<DocumentListResponse["data"]> => {
  const params: any = { page, limit }
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
        params[key] = filters[key]
      }
    })
  }
  
  const response = await apiClient.get<DocumentListResponse>("/documents", { params })

  if (response?.status === 200 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Lấy danh sách tài liệu thất bại")
}

export const getDocumentTypesApi = async (): Promise<DocumentType[]> => {
  const response = await apiClient.get<DocumentTypeListResponse>("/document-types", {
    params: { limit: 1000 }
  })

  if (response?.status === 200 && response?.data) {
    return response.data.items
  }

  throw new Error(response?.message || "Lấy danh sách loại tài liệu thất bại")
}

export const uploadDocumentApi = async (data: UploadDocumentData): Promise<Document> => {
  const formData = new FormData()
  formData.append("file", data.file)
  formData.append("lesson_id", data.lesson_id.toString())
  if (data.document_type_id) {
    formData.append("document_type_id", data.document_type_id.toString())
  }

  const response = await apiClient.post<DocumentResponse>("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Upload file thất bại")
}

