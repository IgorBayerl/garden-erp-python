import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { Piece } from './types';
import { toast } from 'sonner';

// Fetch all pieces
export const useGetPieces = () => {
  return useQuery({
    queryKey: ['pieces'],
    queryFn: async () => {
      const response = await api.get<Piece[]>('/pieces/');
      return response.data;
    },
  });
};

// Fetch a single piece by ID
export const useGetPieceById = (id: number) => {
  return useQuery({
    queryKey: ['piece', id],
    queryFn: async () => {
      const response = await api.get<Piece>(`/pieces/${id}/`);
      return response.data;
    },
  });
};

// Create a new piece
export const useCreatePiece = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPiece: Omit<Piece, 'id'>) => {
      return api.post('/pieces/', newPiece);
    },
    onSuccess: () => {
      // Invalidate the 'pieces' query to refetch the list of pieces
      queryClient.invalidateQueries({
        queryKey: ['pieces'],
        exact: true,
      });
      toast.success('Peça adicionada com sucesso');
    },

  });
};

// Update an existing piece
export const useUpdatePiece = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedPiece: Piece) => {
      return api.put(`/pieces/${updatedPiece.id}/`, updatedPiece);
    },
    onSuccess: () => {
      // Invalidate the 'pieces' query to refetch the list of pieces
      queryClient.invalidateQueries({
        queryKey: ['pieces'],
        exact: true,
      });
      toast.success('Peça atualizada com sucesso');
    },
  });
};

// Delete a piece
export const useDeletePiece = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return api.delete(`/pieces/${id}/`);
    },
    onSuccess: () => {
      // Invalidate the 'pieces' query to refetch the list of pieces
      queryClient.invalidateQueries({
        queryKey: ['pieces'],
        exact: true,
      });
      toast.success('Peça excluída com sucesso');
    },
  });
};
