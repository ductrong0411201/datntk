import { apiClient } from "./base.api"
import type { UploadDocumentData, Document, DocumentResponse } from "../@types/document"

export const uploadDocumentApi = async (data: UploadDocumentData): Promise<Document> => {
  const formData = new FormData()
  formData.append("file", data.file)
  formData.append("lesson_id", data.lesson_id.toString())
  formData.append("document_type_id", data.document_type_id.toString())

  const response = await apiClient.post<DocumentResponse>("/documents/upload", formData)

  if (response?.status === 201 && response?.data) {
    return response.data
  }

  throw new Error(response?.message || "Upload file thất bại")
}

