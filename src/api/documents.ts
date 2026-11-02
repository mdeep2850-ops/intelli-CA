import { apiClient } from './client';

export interface DocumentResponse {
  id: number;
  user_id?: number;
  filename: string;
  file_type: string;
  file_size: number;
  upload_date: string;
  processing_status: string; // usually 'PENDING', 'PROCESSED', 'FAILED'
}

export const documentsApi = {
  listDocuments: async (skip = 0, limit = 100): Promise<DocumentResponse[]> => {
    const response = await apiClient.get<DocumentResponse[]>('/documents/', {
      params: { skip, limit }
    });
    return response.data;
  },

  uploadDocument: async (file: File): Promise<DocumentResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Allow axios to set multipart boundary automatically
    const response = await apiClient.post<DocumentResponse>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDocument: async (documentId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/documents/${documentId}`);
    return response.data;
  },
  
  processDocument: async (documentId: number): Promise<{ message: string; document_id: number }> => {
    const response = await apiClient.post<{ message: string; document_id: number }>(`/documents/${documentId}/process`);
    return response.data;
  }
};
