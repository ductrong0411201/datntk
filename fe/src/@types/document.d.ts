export interface UploadDocumentData {
  file: File
  user_id: number
  lesson_id: number
  document_type_id: number
}

export interface Document {
  id: number
  name: string
  file_path: string
  file_name: string
  file_size: number
  file_mimetype: string
  user_id: number
  lessonn_id: number
  document_type_id: number
  createdAt?: string
  updatedAt?: string
  user?: {
    id: number
    name: string
    userName: string
    email: string
  }
  lesson?: {
    id: number
    name: string
    start: string
    end: string
  }
  documentType?: {
    id: number
    name: string
    code: string
  }
}

export interface DocumentResponse {
  status: number
  data: Document
  message: string
}

