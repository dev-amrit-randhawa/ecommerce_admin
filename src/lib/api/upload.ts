import { useAuthStore } from '@/lib/stores/auth-store';

import { ApiError } from './client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface UploadedImage {
  url: string;
  key: string;
}

/**
 * Uploads a single image to the API (which optimizes it and stores it on
 * S3/CloudFront in production, or local disk in dev). Returns the public URL.
 */
export async function uploadImage(file: File, folder = 'products'): Promise<UploadedImage> {
  const token = useAuthStore.getState().tokens?.accessToken;

  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);

  // NOTE: do not set Content-Type — the browser sets the multipart boundary.
  const response = await fetch(`${API_BASE}/uploads/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: { code: 'UNKNOWN', message: 'Upload failed' },
    }));
    throw new ApiError(
      response.status,
      error.error?.code || 'UNKNOWN',
      error.error?.message || 'Upload failed',
    );
  }

  const data = await response.json();
  return data.data as UploadedImage;
}
