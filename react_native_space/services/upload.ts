import { api } from './api';
import axios from 'axios';

interface PresignedUrlResponse {
  uploadUrl: string;
  cloud_storage_path: string;
}

interface FileResponse {
  id: string;
  cloud_storage_path: string;
}

interface FileUrlResponse {
  url: string;
}

export const uploadService = {
  async getPresignedUrl(fileName: string, contentType: string, isPublic: boolean): Promise<PresignedUrlResponse> {
    const response = await api.post<PresignedUrlResponse>('/upload/presigned', {
      fileName,
      contentType,
      isPublic,
    });
    return response?.data ?? { uploadUrl: '', cloud_storage_path: '' };
  },

  async uploadFile(presignedUrl: string, file: Blob, contentType: string): Promise<void> {
    // Check if Content-Disposition header is required
    const url = new URL(presignedUrl);
    const signedHeaders = url.searchParams.get('X-Amz-SignedHeaders');
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };
    
    if (signedHeaders?.includes('content-disposition')) {
      headers['Content-Disposition'] = 'attachment';
    }

    await axios.put(presignedUrl, file, { headers });
  },

  async completeUpload(cloud_storage_path: string): Promise<FileResponse> {
    const response = await api.post<FileResponse>('/upload/complete', { cloud_storage_path });
    return response?.data ?? { id: '', cloud_storage_path: '' };
  },

  async getFileUrl(fileId: string, mode: 'view' | 'download' = 'view'): Promise<string> {
    const response = await api.get<FileUrlResponse>(`/files/${fileId}/url?mode=${mode}`);
    return response?.data?.url ?? '';
  },
};
