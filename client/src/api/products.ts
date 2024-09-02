import { useQuery, useMutation } from '@tanstack/react-query';
import api from './api';
import { Product } from './types';
import { delay } from '@/lib/utils';

// Fetch all products
export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      await delay(1500);
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
  return useMutation({
    mutationFn: (newProduct: Omit<Product, 'id'>) => {
      return api.post('/products/', newProduct);
    },
  });
};

// Update an existing product
export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: (updatedProduct: Product) => {
      return api.put(`/products/${updatedProduct.id}/`, updatedProduct);
    },
  });
};

// Delete a product
export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return api.delete(`/products/${id}/`);
    },
  });
};
