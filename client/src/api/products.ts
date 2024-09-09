import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { APIErrorResponse, Product } from './types';
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





// Create a new product (multipart form data)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Omit<Product, 'id'>) => {
      return api.post('/products/', newProduct);  // Now `newProduct.image` is a Base64 string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
        exact: true,
      });
      toast.success('Produto adicionado com sucesso');
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Erro ao adicionar produto';
      toast.error(errorMessage);
    },
  });
};

// Update an existing product (multipart form data)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedProduct: Product) => {
      return api.put(`/products/${updatedProduct.id}/`, updatedProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
        exact: true,
      });
      toast.success('Produto atualizado com sucesso');
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
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

// Upload a product CSV
export const useUploadCsvProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => {
      return api.post('/products/upload-csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
        exact: true,
      });
      toast.success('Produto importado com sucesso');
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Erro ao processar o CSV';
      toast.error(errorMessage);
    },
  });
};

