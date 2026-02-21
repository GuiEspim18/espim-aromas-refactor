import { useState } from 'react';
import { trpc } from '@/lib/trpc';

interface UploadProgress {
  loaded: number;
  total: number;
}

interface UseImageUploadResult {
  upload: (file: File) => Promise<string>;
  loading: boolean;
  error: string | null;
  progress: UploadProgress;
}

export function useImageUpload(): UseImageUploadResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress>({ loaded: 0, total: 0 });

  const saveImageMetadata = trpc.images.saveMetadata.useMutation();

  const upload = async (file: File): Promise<string> => {
    setLoading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size });

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('A imagem deve ter no máximo 5MB');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to /uploads endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      const imageUrl = data.url;

      // Save metadata to database
      await saveImageMetadata.mutateAsync({
        filename: file.name,
        url: imageUrl,
        size: file.size,
        type: file.type,
      });

      setProgress({ loaded: file.size, total: file.size });
      setLoading(false);

      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return {
    upload,
    loading,
    error,
    progress,
  };
}
