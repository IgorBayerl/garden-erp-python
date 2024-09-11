import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';
import { APIErrorResponse, DeletePieceErrorResponse, Piece, ProductPiece } from '@/api/types';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

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
    onError: (error: AxiosError<APIErrorResponse>) => {
      // Extract the error message if it exists
      const errorMessage = error.response?.data?.message || 'Erro ao adicionar peça';
      toast.error(errorMessage);
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
    onError: (error: AxiosError<APIErrorResponse>) => {
      // Extract the error message if it exists
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar peça';
      toast.error(errorMessage);
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
    onError: (error: AxiosError<DeletePieceErrorResponse>) => {
      // Extract the error message if it exists
      handleDeletePieceError(error);
    },
  });
};

const handleDeletePieceError = (error: AxiosError<DeletePieceErrorResponse>) => {
  const errorMessage = error.response?.data?.message || 'Erro ao excluir peça';
  const relatedProducts = error.response?.data?.related_products;

  let detailedErrorMessage = errorMessage;

  if (relatedProducts && relatedProducts.length > 0) {
    const productNames = relatedProducts.map(p => `${p.product_name}`).join(', ');
    detailedErrorMessage += `\nProdutos relacionados: ${productNames}`;
  }

  toast.error(detailedErrorMessage);
};


// Upload a CSV and get the list of pieces
export const useParseCsvProduct = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post<{ pieces: ProductPiece[] }>('/pieces/parse-csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.pieces;  // Return the parsed list of pieces
    },
    onSuccess: (pieces: ProductPiece[]) => {
      toast.success('CSV processado com sucesso');
      console.log('Parsed pieces:', pieces);  // Log the pieces or handle them as needed
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Erro ao processar o CSV';
      toast.error(errorMessage);
    },
  });
};
