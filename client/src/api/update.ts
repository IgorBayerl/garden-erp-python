// src/hooks/useUpdate.ts

import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api/api';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface UpdateInfo {
  update_available: boolean;
  current_version: string;
  latest_version: string;
  published_at: string;
}

export const useCheckForUpdates = () => {
  return useQuery<UpdateInfo, AxiosError>({
    queryKey: ['checkForUpdates'],
    queryFn: async () => {
      const response = await api.get<UpdateInfo>('/check-update/');
      return response.data;
    }
  });
};

interface ErrorResponse {
  message?: string
}

export const useRunUpdater = () => {
  return useMutation<void, AxiosError<ErrorResponse>>({
    mutationFn: async () => {
      const response = await api.post('/update/');
      return response.data;
    },
    onSuccess: () => {
      toast.success('Atualização iniciada com sucesso. O aplicativo será atualizado em breve.');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Erro ao iniciar a atualização';
      toast.error(errorMessage);
    },
  });
};
