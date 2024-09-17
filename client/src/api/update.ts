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

export const usePollForUpdate = (enabled: boolean) => {
  return useQuery<UpdateInfo, AxiosError>({
    queryKey: ['pollForUpdate'],
    queryFn: async () => {
      const response = await api.get<UpdateInfo>('/check-update/');
      return response.data;
    },
    enabled,
    refetchInterval: enabled ? 2000 : false, // Poll every 2 seconds when enabled
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
