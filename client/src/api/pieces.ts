import { useQuery, useMutation } from '@tanstack/react-query';
import api from './api';
import { Piece } from './types';
import { delay } from '@/lib/utils';

// Fetch all pieces
export const useGetPieces = () => {
  return useQuery({
    queryKey: ['pieces'],
    queryFn: async () => {
      await delay(1500);
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
  return useMutation({
    mutationFn: (newPiece: Omit<Piece, 'id'>) => {
      return api.post('/pieces/', newPiece);
    },
  });
};

// Update an existing piece
export const useUpdatePiece = () => {
  return useMutation({
    mutationFn: (updatedPiece: Piece) => {
      return api.put(`/pieces/${updatedPiece.id}/`, updatedPiece);
    },
  });
};

// Delete a piece
export const useDeletePiece = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return api.delete(`/pieces/${id}/`);
    },
  });
};
