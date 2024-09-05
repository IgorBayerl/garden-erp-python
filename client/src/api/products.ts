import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { APIErrorResponse, PostProduct, Product } from './types';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

// Fetch all products
export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<Product[]>('/products/');
      return response.data;
    },
  });
};

// Fetch a single product by ID
export const useGetProductById = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get<Product>(`/products/${id}/`);
      return response.data;
    },
  });
};

// Create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProduct: Omit<PostProduct, 'id'>) => {
      return api.post('/products/', newProduct);
    },
    onSuccess: () => {
      // Invalidate the 'products' query to refetch the list of products
      queryClient.invalidateQueries({
        queryKey: ['products'],
        exact: true,
      });
      toast.success('Produto adicionado com sucesso');
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      // Extract the error message if it exists
      const errorMessage = error.response?.data?.message || 'Erro ao adicionar produto';
      toast.error(errorMessage);
    },
  });
};

// Update an existing product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedProduct: PostProduct) => {
      return api.put(`/products/${updatedProduct.id}/`, updatedProduct);
    },
    onSuccess: () => {
      // Invalidate the 'products' query to refetch the list of products
      queryClient.invalidateQueries({
        queryKey: ['products'],
        exact: true,
      });
      toast.success('Produto atualizado com sucesso');
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      // Extract the error message if it exists
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar produto';
      toast.error(errorMessage);
    },
  });
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return api.delete(`/products/${id}/`);
    },
    onSuccess: () => {
      // Invalidate the 'products' query to refetch the list of products
      queryClient.invalidateQueries({
        queryKey: ['products'],
        exact: true,
      });
      toast.success('Produto excluído com sucesso');
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      // Extract the error message if it exists
      const errorMessage = error.response?.data?.message || 'Erro ao excluir produto';
      toast.error(errorMessage);
    },
  });
};
